import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { PRODUCTS } from '@/lib/products';

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN! 
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, targetLink } = body;

    const product = PRODUCTS.find(p => p.id === productId);

    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }

    if (!targetLink) {
       return NextResponse.json({ error: "Falta el enlace" }, { status: 400 });
    }

    // OBTENEMOS LA URL DE VERCEL (O usará localhost si estás probando en tu PC)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const preference = new Preference(client);
    
    const result = await preference.create({
      body: {
        items: [
          {
            id: product.id,
            title: product.name,
            quantity: 1,
            unit_price: product.price,
            currency_id: 'PEN',
          },
        ],
        metadata: {
          target_link: targetLink,
          service_id: product.provider_id,
          quantity: product.provider_quantity,
          product_name: product.name
        },
        // --- AQUÍ ESTÁ EL CAMBIO CLAVE ---
        // Usamos la variable siteUrl en lugar de escribir la dirección a mano
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