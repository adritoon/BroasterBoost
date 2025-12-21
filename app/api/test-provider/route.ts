// app/api/test-provider/route.ts (puedes renombrar el archivo anterior)

import { NextResponse } from 'next/server';
import { sendOrderToProvider } from '@/lib/provider'; // <--- Usamos el nuevo import

export async function GET() {
  try {
    // Busca un ID cualquiera en MoreThanPanel para probar (ej: un servicio de likes barato)
    const testServiceId = 7717; // <--- PON UN ID REAL DE MTP AQUÍ
    const testLink = 'https://www.tiktok.com/@tiktok/video/123456789';
    const quantity = 3000; // Asegúrate que cumpla el mínimo del servicio

    console.log("🧪 Probando conexión con MoreThanPanel...");

    const result = await sendOrderToProvider(testServiceId, testLink, quantity);

    if (result?.success) {
      return NextResponse.json({ msg: '✅ ¡CONEXIÓN EXITOSA!', orderId: result.orderId });
    } else {
      // Si dice "Not enough funds", TAMBIÉN ES ÉXITO (la conexión funciona)
      return NextResponse.json({ msg: '❌ Error del proveedor', error: result?.error });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}