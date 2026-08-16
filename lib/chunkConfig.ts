// lib/chunkConfig.ts
// Configuración de chunking para evitar que el proveedor SMM se bufee con pedidos grandes.
// El chunking divide pedidos grandes en envíos más pequeños.

export interface ChunkRule {
  serviceType: string;      // service_type del producto (e.g., 'views', 'followers', 'likes')
  maxChunkSize: number;     // Máximo de unidades por envío
  threshold: number;        // Solo aplica chunking si quantity > threshold
  description: string;      // Para logs y panel admin
}

// Reglas de chunking — agregar/modificar según necesidad
export const CHUNK_RULES: ChunkRule[] = [
  {
    serviceType: 'views',
    maxChunkSize: 20000,
    threshold: 20000,       // Si piden ≤20K → envío normal
    description: 'Views'
  },
  {
    serviceType: 'viewsShorts',
    maxChunkSize: 20000,
    threshold: 20000,
    description: 'Views Shorts'
  },
  {
    serviceType: 'followers',
    maxChunkSize: 100,
    threshold: 100,         // Si piden ≤100 → envío normal
    description: 'Seguidores'
  },
  {
    serviceType: 'likes',
    maxChunkSize: 10000,
    threshold: 10000,       // Si piden ≤10K → envío normal
    description: 'Likes'
  },
];

/**
 * Busca la regla de chunking para un service_type dado.
 * Retorna null si no hay regla (envío normal).
 */
export function findChunkRule(serviceType: string): ChunkRule | null {
  return CHUNK_RULES.find(r => r.serviceType === serviceType) || null;
}

/**
 * Divide una cantidad en chunks según la regla.
 * Ej: splitIntoChunks(100000, 20000) → [20000, 20000, 20000, 20000, 20000]
 * Ej: splitIntoChunks(50000, 20000) → [20000, 20000, 10000]
 */
export function splitIntoChunks(quantity: number, maxChunkSize: number): number[] {
  const chunks: number[] = [];
  let remaining = quantity;

  while (remaining > 0) {
    const chunkSize = Math.min(remaining, maxChunkSize);
    chunks.push(chunkSize);
    remaining -= chunkSize;
  }

  return chunks;
}

export interface ChunkData {
  index: number;
  size: number;
  status: 'sent' | 'pending_chunk' | 'failed';
  providerOrderId: string | null;
  sentAt: string | null;
  itemIndex: number;       // Índice del item en la orden (para custom packs con múltiples items)
  serviceId: number;       // provider service ID para el reenvío
  link: string;            // URL del contenido
}
