'use client';

import { useState, useEffect, useCallback } from 'react';

interface ChunkInfo {
  index: number;
  size: number;
  status: 'sent' | 'pending_chunk' | 'failed';
  providerOrderId: string | null;
  sentAt: string | null;
}

interface OrderWithChunks {
  orderId: string;
  platform: string;
  totalPEN: number;
  createdAt: any;
  gateway: string;
  items: {
    name: string;
    quantity: number;
    link: string;
    serviceType: string;
  }[];
  totalChunks: number;
  chunksDelivered: number;
  chunks: ChunkInfo[];
  pendingCount: number;
}

export default function AdminChunksPage() {
  const [adminKey, setAdminKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [orders, setOrders] = useState<OrderWithChunks[]>([]);
  const [loading, setLoading] = useState(false);
  const [sendingChunk, setSendingChunk] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [lastRefresh, setLastRefresh] = useState<string>('');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/chunks?adminKey=${encodeURIComponent(adminKey)}`);
      if (res.status === 401) {
        setIsAuthenticated(false);
        setMessage({ text: 'Clave inválida', type: 'error' });
        return;
      }
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
        setLastRefresh(new Date().toLocaleTimeString('es-PE'));
      }
    } catch {
      setMessage({ text: 'Error de conexión', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [adminKey]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/chunks?adminKey=${encodeURIComponent(adminKey)}`);
      if (res.status === 401) {
        setMessage({ text: 'Clave incorrecta', type: 'error' });
        return;
      }
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        setOrders(data.orders);
        setLastRefresh(new Date().toLocaleTimeString('es-PE'));
        // Guardar en sessionStorage para la sesión actual
        sessionStorage.setItem('adminKey', adminKey);
      }
    } catch {
      setMessage({ text: 'Error de conexión', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSendChunk = async (orderId: string) => {
    setSendingChunk(orderId);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/chunks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, adminKey }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage({
          text: `✅ Chunk enviado: ${data.chunkSize?.toLocaleString()} unidades (${data.chunksDelivered}/${data.totalChunks}). Quedan ${data.remainingPending} pendientes.`,
          type: 'success',
        });
        // Refrescar la lista
        await fetchOrders();
      } else {
        setMessage({
          text: `❌ Error: ${data.error}`,
          type: 'error',
        });
      }
    } catch {
      setMessage({ text: '❌ Error de conexión', type: 'error' });
    } finally {
      setSendingChunk(null);
    }
  };

  // Intentar restaurar sesión
  useEffect(() => {
    const savedKey = sessionStorage.getItem('adminKey');
    if (savedKey) {
      setAdminKey(savedKey);
      setIsAuthenticated(true);
    }
  }, []);

  // Cargar órdenes al autenticarse
  useEffect(() => {
    if (isAuthenticated && adminKey) {
      fetchOrders();
    }
  }, [isAuthenticated, adminKey, fetchOrders]);

  // Auto-limpiar mensajes después de 8 segundos
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // ==========================================
  // PANTALLA DE LOGIN
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="text-center mb-8">
              <div className="text-3xl mb-2">🔒</div>
              <h1 className="text-xl font-bold text-white">Acceso Restringido</h1>
            </div>

            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Clave de administrador"
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#ccff00] transition-colors"
              autoFocus
            />

            <button
              type="submit"
              disabled={loading || !adminKey.trim()}
              className="w-full py-3 bg-[#ccff00] text-black font-bold rounded-lg hover:bg-[#b8e600] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verificando...' : 'Entrar'}
            </button>

            {message && (
              <p className={`text-center text-sm ${message.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                {message.text}
              </p>
            )}
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // PANEL ADMIN
  // ==========================================
  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              📦 Chunks Pendientes
            </h1>
            {lastRefresh && (
              <p className="text-zinc-500 text-sm mt-1">Última actualización: {lastRefresh}</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchOrders}
              disabled={loading}
              className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm hover:bg-zinc-700 transition-colors disabled:opacity-50"
            >
              {loading ? '⏳' : '🔄'} Refrescar
            </button>
            <button
              onClick={() => {
                sessionStorage.removeItem('adminKey');
                setIsAuthenticated(false);
                setAdminKey('');
                setOrders([]);
              }}
              className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm hover:bg-red-900/50 hover:border-red-700 transition-colors"
            >
              🚪 Salir
            </button>
          </div>
        </div>

        {/* Mensaje global */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              message.type === 'success'
                ? 'bg-green-900/30 border-green-700 text-green-300'
                : 'bg-red-900/30 border-red-700 text-red-300'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Lista de órdenes */}
        {loading && orders.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            <div className="text-4xl mb-4 animate-pulse">📦</div>
            <p>Cargando órdenes...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">✅</div>
            <p className="text-zinc-400 text-lg">No hay chunks pendientes</p>
            <p className="text-zinc-600 text-sm mt-2">Todas las órdenes están completas</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Resumen */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 mb-6">
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="text-zinc-500">Órdenes: </span>
                  <span className="text-white font-bold">{orders.length}</span>
                </div>
                <div>
                  <span className="text-zinc-500">Chunks pendientes: </span>
                  <span className="text-[#ccff00] font-bold">
                    {orders.reduce((sum, o) => sum + o.pendingCount, 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Tarjetas de órdenes */}
            {orders.map((order) => {
              const sentCount = order.chunks.filter(c => c.status === 'sent').length;
              const totalCount = order.chunks.length;
              const progress = (sentCount / totalCount) * 100;
              const totalQuantity = order.chunks.reduce((sum, c) => sum + c.size, 0);
              const sentQuantity = order.chunks.filter(c => c.status === 'sent').reduce((sum, c) => sum + c.size, 0);

              return (
                <div
                  key={order.orderId}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors"
                >
                  {/* Encabezado */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h2 className="font-mono text-sm text-zinc-400">{order.orderId}</h2>
                      <p className="text-white font-medium mt-1">
                        {order.items?.[0]?.name || 'Orden'}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[#ccff00] font-bold">S/ {order.totalPEN?.toFixed(2)}</span>
                      <p className="text-xs text-zinc-500 mt-1">{order.gateway?.toUpperCase()}</p>
                    </div>
                  </div>

                  {/* Link */}
                  {order.items?.[0]?.link && (
                    <div className="mb-3">
                      <a
                        href={order.items[0].link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:text-blue-300 break-all"
                      >
                        🔗 {order.items[0].link.length > 60
                          ? order.items[0].link.substring(0, 60) + '...'
                          : order.items[0].link}
                      </a>
                    </div>
                  )}

                  {/* Barra de progreso */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-zinc-400 mb-1">
                      <span>{sentCount}/{totalCount} chunks</span>
                      <span>{sentQuantity.toLocaleString()} / {totalQuantity.toLocaleString()} enviados</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#ccff00] rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Detalle de chunks */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {order.chunks.map((chunk) => (
                      <div
                        key={chunk.index}
                        title={`Chunk ${chunk.index + 1}: ${chunk.size.toLocaleString()} — ${chunk.status}${chunk.sentAt ? ` (${new Date(chunk.sentAt).toLocaleString('es-PE')})` : ''}`}
                        className={`px-2 py-1 rounded text-xs font-mono ${
                          chunk.status === 'sent'
                            ? 'bg-green-900/40 text-green-400 border border-green-800'
                            : chunk.status === 'failed'
                            ? 'bg-red-900/40 text-red-400 border border-red-800'
                            : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                        }`}
                      >
                        {chunk.status === 'sent' ? '✅' : chunk.status === 'failed' ? '❌' : '⏳'}{' '}
                        {chunk.size.toLocaleString()}
                      </div>
                    ))}
                  </div>

                  {/* Botón enviar */}
                  {order.pendingCount > 0 && (
                    <button
                      onClick={() => handleSendChunk(order.orderId)}
                      disabled={sendingChunk === order.orderId}
                      className="w-full py-3 bg-[#ccff00] text-black font-bold rounded-lg hover:bg-[#b8e600] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {sendingChunk === order.orderId ? (
                        <>
                          <span className="animate-spin">⏳</span> Enviando...
                        </>
                      ) : (
                        <>
                          🚀 Enviar siguiente chunk ({order.chunks.find(c => c.status === 'pending_chunk')?.size.toLocaleString()})
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
