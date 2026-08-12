import { NextResponse } from 'next/server';
import { sendOrderWithChunking } from '@/lib/provider';
import { adminDb } from '@/lib/firebaseAdmin';

const PAYPAL_API_URL = process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID!;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!;

async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  
  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderID } = body;

    if (!orderID) {
      return NextResponse.json({ error: "Falta el orderID" }, { status: 400 });
    }

    const accessToken = await getAccessToken();

    // Capturar el pago
    const captureResponse = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const captureData = await captureResponse.json();

    if (captureData.status === 'COMPLETED') {
      console.log(`💰 PayPal pago ${orderID} completado. Procesando...`);

      // Extraer el custom_id, que ahora es el ID del documento en Firestore
      const customId = captureData.purchase_units?.[0]?.payments?.captures?.[0]?.custom_id || 
                       captureData.purchase_units?.[0]?.custom_id;
      
      if (customId) {
        const orderId = customId;
        const orderRef = adminDb.collection('orders').doc(orderId);
        const orderSnap = await orderRef.get();

        if (orderSnap.exists) {
          const orderData = orderSnap.data();
          if (!orderData) {
            return NextResponse.json({ error: "Datos de orden vacíos" }, { status: 404 });
          }

          if (orderData?.status === 'pending') {
            console.log(`💰 Pago PayPal para Orden ${orderId} aprobado. Procesando items...`);
            
            // Marcar como completada ANTES de procesar
            await orderRef.update({ status: 'completed', paymentId: orderID, gateway: 'paypal' });

            let providerResult = null;
            let allChunks: any[] = [];
            let totalChunksCount = 0;
            let chunksDeliveredCount = 0;

            // Iterar sobre los items y mandar al proveedor SMM con chunking
            for (let i = 0; i < orderData.items.length; i++) {
              const item = orderData.items[i];
              if (item.serviceId && item.link && item.quantity) {
                providerResult = await sendOrderWithChunking(
                  Number(item.serviceId),
                  item.link,
                  Number(item.quantity),
                  item.serviceType || '',
                  i
                );

                if (providerResult.chunked && providerResult.chunks) {
                  allChunks = allChunks.concat(providerResult.chunks);
                  totalChunksCount += providerResult.totalChunks || 0;
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
            
            return NextResponse.json({ 
              status: 'COMPLETED',
              providerResult: providerResult,
            });
          } else {
             console.log(`Orden ${orderId} ya estaba procesada.`);
          }
        } else {
           console.error(`Orden ${orderId} no encontrada en Firestore.`);
        }
      }

      return NextResponse.json({ status: 'COMPLETED' });
    } else {
      console.error('PayPal capture failed:', captureData);
      return NextResponse.json({ 
        error: "El pago no se completó", 
        details: captureData 
      }, { status: 400 });
    }

  } catch (error) {
    console.error('PayPal capture error:', error);
    return NextResponse.json({ error: "Error al capturar pago PayPal" }, { status: 500 });
  }
}
