import { NextResponse } from 'next/server';
import { sendOrderToProvider} from '@/lib/provider';
import { PRODUCTS } from '@/lib/products';

export async function GET() {
  try {
    // 1. Elegimos un producto barato para probar (ej: TikTok Views)
    // Asegúrate que el 'provider_id' en products.ts tenga un ID real de JAP (ej: 2555)
    // Si sigue en 0, cámbialo temporalmente aquí o en el archivo products.ts
    const testServiceId = 3867; // <--- PON AQUÍ UN ID REAL DE UN SERVICIO BARATO DE JAP
    const testLink = 'https://www.tiktok.com/@tiktok/video/123456789';
    const quantity = 1000;

    console.log("🧪 Iniciando prueba de conexión con JAP...");

    // 2. Llamamos a la función que creamos
    const result = await sendOrderToProvider(testServiceId, testLink, quantity);

    // 3. Mostramos el resultado en pantalla
    if (result?.success) {
      return NextResponse.json({ 
        msg: '✅ ¡ÉXITO! JAP recibió la orden.', 
        orderId: result.orderId 
      });
    } else {
      return NextResponse.json({ 
        msg: '❌ Falló la conexión con JAP', 
        error: result?.error 
      }, { status: 500 });
    }

  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}