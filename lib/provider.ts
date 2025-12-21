// lib/provider.ts
// Este archivo maneja la conexión con CUALQUIER panel SMM (JAP, MoreThanPanel, etc.)

export async function sendOrderToProvider(serviceId: number, link: string, quantity: number) {
  // Usamos nombres de variables genéricos
  const apiKey = process.env.SMM_API_KEY; 
  const apiUrl = process.env.SMM_API_URL; 

  if (!apiKey || !apiUrl) {
    console.error("❌ Faltan las claves del PROVEEDOR en .env.local");
    return { success: false, error: 'Configuration Error' };
  }

  // La mayoría de paneles (JAP/MTP) usan este estándar
  const params = new URLSearchParams();
  params.append('key', apiKey);
  params.append('action', 'add');
  params.append('service', serviceId.toString());
  params.append('link', link);
  params.append('quantity', quantity.toString());

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: params,
    });
    
    const data = await response.json();

    // Manejo de errores común para ambos paneles
    if (data.error) {
      console.error(`❌ Error del Proveedor (${apiUrl}):`, data.error);
      return { success: false, error: data.error };
    }

    console.log(`✅ Orden enviada exitosamente. ID: ${data.order}`);
    return { success: true, orderId: data.order };

  } catch (error) {
    console.error("❌ Error de conexión con el proveedor:", error);
    return { success: false, error: 'Connection error' };
  }
}