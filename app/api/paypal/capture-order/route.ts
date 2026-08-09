import { NextResponse } from 'next/server';
import { sendOrderToProvider } from '@/lib/provider';
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
            // Iterar sobre los items y mandar al proveedor SMM
            for (const item of orderData.items) {
              if (item.serviceId && item.link && item.quantity) {
                providerResult = await sendOrderToProvider(Number(item.serviceId), item.link, Number(item.quantity));
              }
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
