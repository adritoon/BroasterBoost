import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { sendOrderToProvider } from '@/lib/provider';

// Rate limiting simple: máximo 5 llamadas por minuto por IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minuto

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  
  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }
  
  entry.count++;
  return true;
}

function validateAdminKey(request: Request): boolean {
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey) return false;

  // Buscar la key en el header, body, o query params
  const url = new URL(request.url);
  const queryKey = url.searchParams.get('adminKey');
  const headerKey = request.headers.get('x-admin-key');
  
  return queryKey === adminKey || headerKey === adminKey;
}

function getClientIp(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
         request.headers.get('x-real-ip') || 
         'unknown';
}

/**
 * GET /api/admin/chunks — Lista todas las órdenes con chunks pendientes
 */
export async function GET(request: Request) {
  if (!validateAdminKey(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Rate limit exceeded. Máximo 5 peticiones por minuto.' }, { status: 429 });
  }

  try {
    // Buscar órdenes que tengan chunks con al menos uno pendiente
    const ordersSnapshot = await adminDb.collection('orders')
      .where('totalChunks', '>', 0)
      .orderBy('totalChunks')
      .get();

    const ordersWithPendingChunks: any[] = [];

    for (const doc of ordersSnapshot.docs) {
      const data = doc.data();
      const chunks = data.chunks || [];
      const pendingChunks = chunks.filter((c: any) => c.status === 'pending_chunk');
      
      if (pendingChunks.length > 0) {
        ordersWithPendingChunks.push({
          orderId: doc.id,
          platform: data.platform,
          totalPEN: data.totalPEN,
          createdAt: data.createdAt,
          gateway: data.gateway,
          items: data.items?.map((item: any) => ({
            name: item.name,
            quantity: item.quantity,
            link: item.link,
            serviceType: item.serviceType,
          })),
          totalChunks: data.totalChunks,
          chunksDelivered: data.chunksDelivered,
          chunks: chunks.map((c: any) => ({
            index: c.index,
            size: c.size,
            status: c.status,
            providerOrderId: c.providerOrderId,
            sentAt: c.sentAt,
          })),
          pendingCount: pendingChunks.length,
        });
      }
    }

    return NextResponse.json({
      success: true,
      count: ordersWithPendingChunks.length,
      orders: ordersWithPendingChunks,
    });

  } catch (error) {
    console.error('Error fetching chunks:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

/**
 * POST /api/admin/chunks — Envía el siguiente chunk pendiente de una orden
 * Body: { "orderId": "SB-xxx", "adminKey": "xxx" }
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  
  // Validar admin key (desde body o header)
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey) {
    return NextResponse.json({ error: 'ADMIN_API_KEY not configured' }, { status: 500 });
  }

  const providedKey = body.adminKey || request.headers.get('x-admin-key');
  if (providedKey !== adminKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Rate limit exceeded. Máximo 5 peticiones por minuto.' }, { status: 429 });
  }

  const { orderId } = body;
  if (!orderId) {
    return NextResponse.json({ error: 'Falta el orderId' }, { status: 400 });
  }

  try {
    const orderRef = adminDb.collection('orders').doc(orderId);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 });
    }

    const orderData = orderSnap.data();
    if (!orderData) {
      return NextResponse.json({ error: 'Datos de orden vacíos' }, { status: 404 });
    }

    const chunks = orderData.chunks || [];
    
    // Encontrar el primer chunk pendiente
    const pendingIndex = chunks.findIndex((c: any) => c.status === 'pending_chunk');
    
    if (pendingIndex === -1) {
      return NextResponse.json({ 
        error: 'No hay chunks pendientes en esta orden',
        totalChunks: orderData.totalChunks,
        chunksDelivered: orderData.chunksDelivered,
      }, { status: 400 });
    }

    const chunk = chunks[pendingIndex];
    
    console.log(`🚀 Admin enviando chunk ${pendingIndex + 1}/${chunks.length} de orden ${orderId}: ${chunk.size} unidades`);

    // Enviar al proveedor
    const result = await sendOrderToProvider(
      Number(chunk.serviceId),
      chunk.link,
      Number(chunk.size)
    );

    const now = new Date().toISOString();

    if (result.success) {
      // Actualizar el chunk como enviado
      chunks[pendingIndex] = {
        ...chunk,
        status: 'sent',
        providerOrderId: result.orderId?.toString() || null,
        sentAt: now,
      };

      const newDelivered = (orderData.chunksDelivered || 0) + 1;

      await orderRef.update({
        chunks,
        chunksDelivered: newDelivered,
      });

      // Log de auditoría
      await adminDb.collection('admin_logs').add({
        action: 'chunk_sent',
        orderId,
        chunkIndex: pendingIndex,
        chunkSize: chunk.size,
        providerOrderId: result.orderId,
        ip,
        timestamp: now,
      });

      const remainingPending = chunks.filter((c: any) => c.status === 'pending_chunk').length - 1;

      console.log(`✅ Chunk ${pendingIndex + 1} enviado. Quedan ${remainingPending} pendientes.`);

      return NextResponse.json({
        success: true,
        message: `Chunk ${pendingIndex + 1}/${chunks.length} enviado exitosamente`,
        chunkSize: chunk.size,
        providerOrderId: result.orderId,
        chunksDelivered: newDelivered,
        totalChunks: orderData.totalChunks,
        remainingPending,
      });
    } else {
      // Log del fallo
      await adminDb.collection('admin_logs').add({
        action: 'chunk_failed',
        orderId,
        chunkIndex: pendingIndex,
        chunkSize: chunk.size,
        error: result.error,
        ip,
        timestamp: now,
      });

      console.error(`❌ Falló el envío del chunk ${pendingIndex + 1} de orden ${orderId}:`, result.error);

      return NextResponse.json({
        success: false,
        error: `Error del proveedor: ${result.error}`,
        chunkIndex: pendingIndex,
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error sending chunk:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
