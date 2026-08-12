import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { sendOrderWithChunking } from '@/lib/provider';

// Rate limiting and validation (similarly used in chunks route)
function validateAdminKey(request: Request): boolean {
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey) return false;

  const url = new URL(request.url);
  const queryKey = url.searchParams.get('adminKey');
  const headerKey = request.headers.get('x-admin-key');
  
  return queryKey === adminKey || headerKey === adminKey;
}

export async function GET(request: Request) {
  if (!validateAdminKey(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const statusFilter = url.searchParams.get('status');

  try {
    let query: any = adminDb.collection('orders');

    if (statusFilter) {
      // Si filtramos por status, NO usamos orderBy en Firebase para evitar
      // el error de "The query requires an index". Lo ordenaremos en memoria.
      query = query.where('status', '==', statusFilter);
    } else {
      // Para la vista general, ordenamos por fecha y limitamos a 100
      query = query.orderBy('createdAt', 'desc').limit(100);
    }

    const snapshot = await query.get();
    let orders = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
      // convert timestamp to readable date or ISO string
      createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate().toISOString() : null,
      expiresAt: doc.data().expiresAt?.toDate ? doc.data().expiresAt.toDate().toISOString() : null,
    }));

    if (statusFilter) {
      // Ordenamos en memoria (los más recientes primero)
      orders.sort((a: any, b: any) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    }

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey) {
    return NextResponse.json({ error: 'ADMIN_API_KEY not configured' }, { status: 500 });
  }

  const providedKey = body.adminKey || request.headers.get('x-admin-key');
  if (providedKey !== adminKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { orderId, action } = body;
  if (!orderId || !action) {
    return NextResponse.json({ error: 'Falta orderId o action' }, { status: 400 });
  }

  try {
    const orderRef = adminDb.collection('orders').doc(orderId);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 });
    }

    const orderData = orderSnap.data();

    if (action === 'reject_yape') {
      await orderRef.update({ status: 'cancelled' });
      return NextResponse.json({ success: true, message: 'Orden cancelada' });
    }

    if (action === 'approve_yape') {
      if (orderData?.status !== 'pending_yape') {
        return NextResponse.json({ error: 'La orden no está pendiente de Yape' }, { status: 400 });
      }

      console.log(`💰 Aprobando Yape manualmente para Orden ${orderId}. Procesando items...`);
      
      // Marcar como completada
      await orderRef.update({ status: 'completed', gateway: 'yape_manual' });

      // Iterar sobre los items y mandar al proveedor SMM con chunking
      let allChunks: any[] = [];
      let totalChunksCount = 0;
      let chunksDeliveredCount = 0;

      for (let i = 0; i < orderData.items.length; i++) {
        const item = orderData.items[i];
        if (item.serviceId && item.link && item.quantity) {
          const result = await sendOrderWithChunking(
            Number(item.serviceId),
            item.link,
            Number(item.quantity),
            item.serviceType || '',
            i
          );

          if (result.chunked && result.chunks) {
            allChunks = allChunks.concat(result.chunks);
            totalChunksCount += result.totalChunks || 0;
            chunksDeliveredCount += 1;
          }
        }
      }

      // Si hubo chunking, guardar los chunks en la orden
      if (allChunks.length > 0) {
        await orderRef.update({
          chunks: allChunks,
          totalChunks: totalChunksCount,
          chunksDelivered: chunksDeliveredCount,
        });
        console.log(`📦 Orden ${orderId}: ${chunksDeliveredCount}/${totalChunksCount} chunks enviados. Resto pendiente.`);
      }

      return NextResponse.json({ success: true, message: 'Pago aprobado y orden procesada' });
    }

    return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });

  } catch (error) {
    console.error('Error processing admin order action:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
