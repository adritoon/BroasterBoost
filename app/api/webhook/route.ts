import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { sendOrderToProvider } from '@/lib/provider';

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN! 
});

export async function POST(request: Request) {
  try {
    // 1. Leemos el cuerpo del mensaje para saber QUÉ TIPO de aviso es
    const body = await request.json().catch(() => null);
    
    // --- 🛑 FILTRO DE ACCIÓN (SOLUCIÓN SIN DATABASE) ---
    // Si el mensaje es solo de "creación", lo ignoramos.
    // Esperamos al mensaje de "actualización" que llega milisegundos después.
    if (body?.action === 'payment.created') {
        console.log("Ignorando evento 'payment.created' para evitar duplicados.");
        return NextResponse.json({ status: 'OK' });
    }
    // ---------------------------------------------------

    // Recuperamos el ID (puede venir en el body o en la URL)
    const url = new URL(request.url);
    const id = body?.data?.id || url.searchParams.get('data.id') || url.searchParams.get('id');

    if (id) {
      // 2. Consultamos el estado real del pago
      const payment = new Payment(client);
      const paymentData = await payment.get({ id });

      // 3. Verificamos que esté APROBADO
      if (paymentData.status === 'approved') {
        
        const { target_link, service_id, quantity } = paymentData.metadata;

        console.log(`💰 Pago ${id} aprobado (Evento: ${body?.action || 'unknown'}). Procesando...`);
        console.log(`Link: ${target_link} | Service: ${service_id} | Cant: ${quantity}`);

        // 4. Enviamos la orden
        if (target_link && service_id && quantity) {
           await sendOrderToProvider(Number(service_id), target_link, Number(quantity));
        }
      }
    }

    return NextResponse.json({ status: 'OK' });

  } catch (error) {
    console.error("Webhook Error:", error);
    // Respondemos OK para que MP no siga reintentando si fue un error de código nuestro
    return NextResponse.json({ status: 'OK' }, { status: 200 }); 
  }
}