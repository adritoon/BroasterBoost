import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { adminDb } from '@/lib/firebaseAdmin';

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN! 
});

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
    if (!orderData) {
      return NextResponse.json({ error: "Datos de orden vacíos" }, { status: 404 });
    }

    // OBTENEMOS LA URL DE VERCEL (O usará localhost si estás probando en tu PC)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const preference = new Preference(client);
    
    let title = "SocialBoost - Pago";
    if (orderData.items.length === 1) {
       title = `SocialBoost - ${orderData.items[0].name}`;
    } else if (orderData.items.length > 1) {
       title = `SocialBoost - Pack de ${orderData.items.length} servicios`;
    }

    const result = await preference.create({
      body: {
        items: [
          {
            id: orderId,
            title: title,
            quantity: 1,
            unit_price: orderData.totalPEN,
            currency_id: 'PEN',
          },
        ],
        metadata: {
          order_id: orderId
        },
        external_reference: orderId,
        notification_url: `${siteUrl}/api/webhook`, 
        back_urls: {
          success: `${siteUrl}/track`, // O '/track' si prefieres esa página
          failure: `${siteUrl}/`,
          pending: `${siteUrl}/`,
        },
        auto_return: 'approved',
      }
    });

    return NextResponse.json({ preferenceId: result.id });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al crear pago" }, { status: 500 });
  }
}