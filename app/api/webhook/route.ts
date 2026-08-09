import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { sendOrderToProvider } from '@/lib/provider';
import { adminDb } from '@/lib/firebaseAdmin';

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
        const orderId = paymentData.external_reference || paymentData.metadata?.order_id;

        if (orderId) {
          const orderRef = adminDb.collection('orders').doc(orderId);
          const orderSnap = await orderRef.get();

          if (orderSnap.exists) {
            const orderData = orderSnap.data();

            if (orderData?.status === 'pending') {
              console.log(`💰 Pago MP ${id} para Orden ${orderId} aprobado. Procesando items...`);
              
              // Marcar como completada ANTES de procesar para evitar doble envío si MP llama al webhook 2 veces
              await orderRef.update({ status: 'completed', paymentId: id, gateway: 'mercadopago' });

              // Iterar sobre los items y mandar al proveedor SMM
              for (const item of orderData.items) {
                if (item.serviceId && item.link && item.quantity) {
                  // Si tiene comentarios, el proveedor SMM normalmente pide enviarlos en el 'link' o 'comments' parameter.
                  // Nuestro 'sendOrderToProvider' por ahora solo toma link (el panel SMM deduce los comentarios del link o se los pasaremos en el futuro).
                  // NOTA: Para custom comments de verdad, la API SMM requiere el parametro 'comments' (action=add&service=X&link=Y&comments=Z)
                  await sendOrderToProvider(Number(item.serviceId), item.link, Number(item.quantity));
                }
              }
            } else {
              console.log(`Orden ${orderId} ya estaba procesada.`);
            }
          }
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