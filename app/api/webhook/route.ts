import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { sendOrderToProvider } from '@/lib/provider';

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN! 
});

export async function POST(request: Request) {
  try {
    // 1. Mercado Pago nos envía una notificación
    const url = new URL(request.url);
    const topic = url.searchParams.get('topic') || url.searchParams.get('type');
    const id = url.searchParams.get('id') || url.searchParams.get('data.id');

    if (topic === 'payment' && id) {
      // 2. Consultamos el estado real del pago a Mercado Pago
      const payment = new Payment(client);
      const paymentData = await payment.get({ id });

      // 3. Verificamos que esté APROBADO (Cobrado)
      if (paymentData.status === 'approved') {
        
        // Recuperamos los datos que guardamos en "metadata" en el paso anterior
        const { target_link, service_id, quantity } = paymentData.metadata;

        console.log(`💰 Pago ${id} aprobado. Enviando orden a JAP...`);
        console.log(`Link: ${target_link} | Service: ${service_id} | Cant: ${quantity}`);

        // 4. ¡ENVIAMOS LA ORDEN A JAP!
        if (target_link && service_id && quantity) {
           await sendOrderToProvider(Number(service_id), target_link, Number(quantity));
        }
      }
    }

    return NextResponse.json({ status: 'OK' });

  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ status: 'Error' }, { status: 500 });
  }
}