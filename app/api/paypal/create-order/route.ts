import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

const PAYPAL_API_URL = process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID!;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!;

// Tipo de cambio PEN → USD
const EXCHANGE_RATE = 3.40;
// Comisión PayPal (~5.4%) que se le agrega al cliente
const PAYPAL_COMMISSION = 0.054;

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
  if (!response.ok) {
    console.error('PayPal token error:', data);
    throw new Error(`Failed to get access token: ${data.error_description || data.error || 'Unknown error'}`);
  }
  return data.access_token;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Falta el orderId" }, { status: 400 });
    }

    const orderRef = adminDb.collection('orders').doc(orderId);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
    }

    const orderData = orderSnap.data();
    
    // Precio en PEN calculado por nuestro backend
    const pricePEN = orderData.totalPEN;
    
    // Agregar comisión PayPal al precio
    const priceWithCommission = pricePEN * (1 + PAYPAL_COMMISSION);
    
    // Convertir a USD
    const priceUSD = (priceWithCommission / EXCHANGE_RATE).toFixed(2);

    let title = "SocialBoost - Pago";
    if (orderData.items.length === 1) {
       title = `SocialBoost - ${orderData.items[0].name}`;
    } else if (orderData.items.length > 1) {
       title = `SocialBoost - Pack de ${orderData.items.length} servicios`;
    }

    const accessToken = await getAccessToken();

    const orderResponse = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            description: title,
            amount: {
              currency_code: 'USD',
              value: priceUSD,
            },
            custom_id: orderId, // AHORA SOLO PASAMOS EL ORDER_ID
          },
        ],
        application_context: {
          brand_name: 'SocialBoost Perú',
          shipping_preference: 'NO_SHIPPING',
          user_action: 'PAY_NOW',
        },
      }),
    });

    const paypalOrderData = await orderResponse.json();

    if (paypalOrderData.id) {
      return NextResponse.json({ 
        orderID: paypalOrderData.id,
        priceUSD,
        pricePEN: priceWithCommission.toFixed(2),
      });
    } else {
      console.error('PayPal create order error:', paypalOrderData);
      return NextResponse.json({ error: "Error al crear orden PayPal" }, { status: 500 });
    }

  } catch (error) {
    console.error('PayPal create order error:', error);
    return NextResponse.json({ error: "Error al crear pago PayPal" }, { status: 500 });
  }
}
