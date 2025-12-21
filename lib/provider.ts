// lib/provider.ts
export async function sendOrderToProvider(serviceId: number, link: string, quantity: number) {
  // Ahora usamos nombres genéricos
  const apiKey = process.env.SMM_API_KEY; 
  const apiUrl = process.env.SMM_API_URL; 

  if (!apiKey || !apiUrl) {
    console.error("❌ Faltan las claves del PROVEEDOR en .env");
    return { success: false, error: 'Config Error' };
  }

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

    if (data.error) {
      console.error("❌ Error del Proveedor:", data.error);
      return { success: false, error: data.error };
    }

    return { success: true, orderId: data.order };

  } catch (error) {
    console.error("❌ Error de conexión:", error);
    return { success: false, error: 'Connection error' };
  }
}