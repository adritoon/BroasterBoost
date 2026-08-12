// lib/provider.ts
// Este archivo maneja la conexión con CUALQUIER panel SMM (JAP, MoreThanPanel, etc.)
// Incluye lógica de chunking para dividir pedidos grandes en envíos parciales.

import { findChunkRule, splitIntoChunks, ChunkData } from './chunkConfig';

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

/**
 * Envía una orden al proveedor con lógica de chunking.
 * Si el service_type tiene regla de chunking y la cantidad excede el threshold,
 * solo envía el primer chunk automáticamente y retorna el resto como pendientes.
 * 
 * @param serviceId - ID del servicio en el panel SMM
 * @param link - URL del contenido (video, perfil, etc.)
 * @param quantity - Cantidad total solicitada
 * @param serviceType - Tipo de servicio (views, followers, likes, etc.)
 * @param itemIndex - Índice del item en la orden (para packs con múltiples items)
 * @returns Resultado del envío, incluyendo chunks pendientes si aplica
 */
export async function sendOrderWithChunking(
  serviceId: number,
  link: string,
  quantity: number,
  serviceType: string,
  itemIndex: number = 0
): Promise<{
  success: boolean;
  orderId?: string;
  error?: string;
  chunked: boolean;
  chunks?: ChunkData[];
  totalChunks?: number;
}> {
  const rule = findChunkRule(serviceType);

  // Sin regla de chunking o cantidad dentro del threshold → envío normal
  if (!rule || quantity <= rule.threshold) {
    const result = await sendOrderToProvider(serviceId, link, quantity);
    return {
      ...result,
      chunked: false,
    };
  }

  // Chunking necesario — dividir la cantidad
  console.log(`🔀 Chunking activado para ${rule.description}: ${quantity} → chunks de ${rule.maxChunkSize}`);
  
  const chunkSizes = splitIntoChunks(quantity, rule.maxChunkSize);
  console.log(`📦 ${chunkSizes.length} chunks: [${chunkSizes.join(', ')}]`);

  // Enviar SOLO el primer chunk automáticamente
  const firstResult = await sendOrderToProvider(serviceId, link, chunkSizes[0]);

  if (!firstResult.success) {
    console.error(`❌ Falló el envío del primer chunk de ${rule.description}`);
    return {
      success: false,
      error: firstResult.error,
      chunked: true,
      chunks: chunkSizes.map((size, i) => ({
        index: i,
        size,
        status: 'failed' as const,
        providerOrderId: null,
        sentAt: null,
        itemIndex,
        serviceId,
        link,
      })),
      totalChunks: chunkSizes.length,
    };
  }

  // Primer chunk enviado exitosamente — el resto queda pendiente
  const now = new Date().toISOString();
  const chunks: ChunkData[] = chunkSizes.map((size, i) => ({
    index: i,
    size,
    status: i === 0 ? 'sent' as const : 'pending_chunk' as const,
    providerOrderId: i === 0 ? (firstResult.orderId?.toString() || null) : null,
    sentAt: i === 0 ? now : null,
    itemIndex,
    serviceId,
    link,
  }));

  console.log(`✅ Primer chunk de ${chunkSizes[0]} ${rule.description} enviado. ${chunkSizes.length - 1} chunks pendientes.`);

  return {
    success: true,
    orderId: firstResult.orderId,
    chunked: true,
    chunks,
    totalChunks: chunkSizes.length,
  };
}