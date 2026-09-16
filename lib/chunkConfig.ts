// lib/chunkConfig.ts
// Configuración de chunking para evitar que el proveedor SMM se bufee con pedidos grandes.
// El chunking divide pedidos grandes en envíos más pequeños.

export interface ChunkRule {
  serviceType: string;      // service_type del producto (e.g., 'views', 'followers', 'likes')
  maxChunkSize: number;     // Máximo de unidades por envío
  minChunkSize: number;     // Mínimo de unidades por envío (para evitar rechazos del SMM)
  threshold: number;        // Solo aplica chunking si quantity > threshold
  description: string;      // Para logs y panel admin
}

// Reglas de chunking — agregar/modificar según necesidad
export const CHUNK_RULES: ChunkRule[] = [
  {
    serviceType: 'views',
    maxChunkSize: 20000,
    minChunkSize: 1000,
    threshold: 20000,       // Si piden ≤20K → envío normal
    description: 'Views'
  },
  {
    serviceType: 'viewsShorts',
    maxChunkSize: 20000,
    minChunkSize: 1000,
    threshold: 20000,
    description: 'Views Shorts'
  },
  {
    serviceType: 'followers',
    maxChunkSize: 100,
    minChunkSize: 10,
    threshold: 100,         // Si piden ≤100 → envío normal
    description: 'Seguidores'
  },
  {
    serviceType: 'likes',
    maxChunkSize: 2000,
    minChunkSize: 50,
    threshold: 2000,       // Si piden ≤2K → envío normal, si es más, se divide de 2K en 2K
    description: 'Likes'
  },
  {
    serviceType: 'shares',
    maxChunkSize: 200,
    minChunkSize: 20,
    threshold: 200,        // Si piden ≤200 → envío normal
    description: 'Compartidos'
  },
  {
    serviceType: 'saves',
    maxChunkSize: 200,
    minChunkSize: 20,
    threshold: 200,        // Si piden ≤200 → envío normal
    description: 'Guardados/Favoritos'
  },
  {
    serviceType: 'comments',
    maxChunkSize: 20,
    minChunkSize: 5,
    threshold: 20,         // Si piden ≤20 → envío normal
    description: 'Comentarios'
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
 * Calcula la cantidad de chunks que necesita el servicio más demandante del pack.
 */
export function calculatePackChunks(items: any[]): number {
  let maxChunks = 1;
  for (const item of items) {
    const rule = findChunkRule(item.serviceType || '');
    if (rule) {
      const chunksNeeded = Math.ceil(item.quantity / rule.maxChunkSize);
      if (chunksNeeded > maxChunks) {
        maxChunks = chunksNeeded;
      }
    }
  }
  return maxChunks;
}

/**
 * Divide una cantidad en un número exacto de chunks.
 * Si el chunkSize resultante es menor al minChunkSize, agrupa los chunks para no violar el límite del proveedor.
 */
export function splitIntoFixedChunks(quantity: number, numChunks: number, minChunkSize: number): number[] {
  const chunks: number[] = [];
  
  if (numChunks <= 1) return [quantity];

  let actualChunks = numChunks;
  if (quantity / numChunks < minChunkSize) {
    actualChunks = Math.floor(quantity / minChunkSize);
    if (actualChunks < 1) actualChunks = 1;
  }

  const baseSize = Math.floor(quantity / actualChunks);
  let remainder = quantity % actualChunks;

  for (let i = 0; i < actualChunks; i++) {
    chunks.push(baseSize + (remainder > 0 ? 1 : 0));
    remainder--;
  }

  return chunks;
}

/**
 * Divide una cantidad en chunks según la regla (Lógica antigua para servicios sueltos sin pack).
 * Ej: splitIntoChunks(100000, 20000) → [20000, 20000, 20000, 20000, 20000]
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
