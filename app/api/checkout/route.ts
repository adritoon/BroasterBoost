import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { PRODUCTS } from '@/lib/products';

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN! 
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, targetLink } = body; // <--- Ahora recibimos targetLink

    const product = PRODUCTS.find(p => p.id === productId);

    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }

    if (!targetLink) {
       return NextResponse.json({ error: "Falta el enlace" }, { status: 400 });
    }

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
        // AQUÍ GUARDAMOS EL LINK PARA QUE EL WEBHOOK LO LEA DESPUÉS
        metadata: {
          target_link: targetLink,
          service_id: product.provider_id, // ID del mayorista
          quantity: product.provider_quantity,
          product_name: product.name
        },
        back_urls: {
          success: 'https://tu-web.com/track',
          failure: 'https://tu-web.com/',
          pending: 'https://tu-web.com/',
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