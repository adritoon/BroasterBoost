'use client';

import React, { useState, useEffect, useCallback } from 'react';

type Tab = 'chunks' | 'yape' | 'history';

interface ChunkInfo {
  index: number;
  size: number;
  status: 'sent' | 'pending_chunk' | 'failed';
  providerOrderId: string | null;
  sentAt: string | null;
}

interface OrderItem {
  name?: string;
  quantity: number;
  link: string;
  serviceType: string;
  type?: string;
  comments?: string[];
}

interface OrderBase {
  id?: string;
  orderId?: string; // Some apis use id, some use orderId
  platform: string;
  totalPEN: number;
  createdAt: any;
  expiresAt?: any;
  status?: string;
  gateway?: string;
  items: OrderItem[];
}

interface OrderWithChunks extends OrderBase {
  orderId: string;
  totalChunks: number;
  chunksDelivered: number;
  chunks: ChunkInfo[];
  pendingCount: number;
}

interface GeneralOrder extends OrderBase {
  id: string;
  chunks?: ChunkInfo[];
  totalChunks?: number;
  chunksDelivered?: number;
}

export default function AdminDashboardPage() {
  const [adminKey, setAdminKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('chunks');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Data states
  const [chunkOrders, setChunkOrders] = useState<OrderWithChunks[]>([]);
  const [yapeOrders, setYapeOrders] = useState<GeneralOrder[]>([]);
  const [historyOrders, setHistoryOrders] = useState<GeneralOrder[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [processingAction, setProcessingAction] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [lastRefresh, setLastRefresh] = useState<string>('');

  const fetchTab = useCallback(async (tab: Tab) => {
    setLoading(true);
    try {
      let url = '';
      if (tab === 'chunks') {
        url = `/api/admin/chunks?adminKey=${encodeURIComponent(adminKey)}`;
      } else if (tab === 'yape') {
        url = `/api/admin/orders?adminKey=${encodeURIComponent(adminKey)}&status=pending_yape`;
      } else {
        url = `/api/admin/orders?adminKey=${encodeURIComponent(adminKey)}`;
      }

      const res = await fetch(url);
      if (res.status === 401) {
        setIsAuthenticated(false);
        setMessage({ text: 'Clave inválida', type: 'error' });
        return;
      }
      
      const data = await res.json();
      if (data.success) {
        if (tab === 'chunks') setChunkOrders(data.orders || []);
        if (tab === 'yape') setYapeOrders(data.orders || []);
        if (tab === 'history') setHistoryOrders(data.orders || []);
        setLastRefresh(new Date().toLocaleTimeString('es-PE'));
      }
    } catch {
      setMessage({ text: 'Error de conexión', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [adminKey]);

  const fetchOrders = useCallback(() => {
    fetchTab(activeTab);
  }, [activeTab, fetchTab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey.trim()) return;

    setLoading(true);
    try {
      // Intentar una llamada inicial para ver si la clave es válida
      const res = await fetch(`/api/admin/chunks?adminKey=${encodeURIComponent(adminKey)}`);
      if (res.status === 401) {
        setMessage({ text: 'Clave incorrecta', type: 'error' });
        return;
      }
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        setChunkOrders(data.orders || []);
        setLastRefresh(new Date().toLocaleTimeString('es-PE'));
        sessionStorage.setItem('adminKey', adminKey);
      }
    } catch {
      setMessage({ text: 'Error de conexión', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSendChunk = async (orderId: string) => {
    setProcessingAction(orderId);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/chunks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, adminKey }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ text: `✅ Chunk enviado. Quedan ${data.remainingPending} pendientes.`, type: 'success' });
        fetchOrders();
      } else {
        setMessage({ text: `❌ Error: ${data.error}`, type: 'error' });
      }
    } catch {
      setMessage({ text: '❌ Error de conexión', type: 'error' });
    } finally {
      setProcessingAction(null);
    }
  };

  const handleYapeAction = async (orderId: string, action: 'approve_yape' | 'reject_yape') => {
    setProcessingAction(orderId);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, adminKey, action }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ text: `✅ ${data.message}`, type: 'success' });
        fetchOrders();
      } else {
        setMessage({ text: `❌ Error: ${data.error}`, type: 'error' });
      }
    } catch {
      setMessage({ text: '❌ Error de conexión', type: 'error' });
    } finally {
      setProcessingAction(null);
    }
  };

  useEffect(() => {
    const savedKey = sessionStorage.getItem('adminKey');
    if (savedKey) {
      setAdminKey(savedKey);
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && adminKey) {
      fetchOrders();
    }
  }, [isAuthenticated, adminKey, activeTab, fetchOrders]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const filteredHistoryOrders = historyOrders.filter(order => {
    if (!searchTerm) return true;
    const lowerTerm = searchTerm.toLowerCase();
    return order.id.toLowerCase().includes(lowerTerm) || 
           (order.items?.[0]?.link && order.items[0].link.toLowerCase().includes(lowerTerm));
  });

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

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              🛠️ Panel de Control
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
              }}
              className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm hover:bg-red-900/50 hover:border-red-700 transition-colors"
            >
              🚪 Salir
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-2 mb-6 border-b border-zinc-800 pb-2 overflow-x-auto">
          {(['chunks', 'yape', 'history'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setExpandedOrderId(null); }}
              className={`px-4 py-2 font-bold rounded-lg text-sm transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-[#ccff00] text-black'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {tab === 'chunks' && '📦 Chunks Pendientes'}
              {tab === 'yape' && '⏳ Pagos Yape'}
              {tab === 'history' && '📋 Todas las Órdenes'}
            </button>
          ))}
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${message.type === 'success' ? 'bg-green-900/30 border-green-700 text-green-300' : 'bg-red-900/30 border-red-700 text-red-300'}`}>
            {message.text}
          </div>
        )}

        {/* CONTENIDO DE PESTAÑAS */}
        {loading && (!chunkOrders.length && !yapeOrders.length && !historyOrders.length) ? (
          <div className="text-center py-20 text-zinc-500">
            <div className="text-4xl mb-4 animate-pulse">Cargando...</div>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* TABS CHUNKS */}
            {activeTab === 'chunks' && (
              <>
                {chunkOrders.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-zinc-400 text-lg">No hay chunks pendientes</p>
                  </div>
                ) : (
                  chunkOrders.map((order) => {
                    const sentCount = order.chunks.filter(c => c.status === 'sent').length;
                    const totalCount = order.chunks.length;
                    const progress = (sentCount / totalCount) * 100;

                    return (
                      <div key={order.orderId} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h2 className="font-mono text-sm text-zinc-400">{order.orderId}</h2>
                            <p className="text-white font-medium mt-1">{order.items?.[0]?.name}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-[#ccff00] font-bold">S/ {order.totalPEN?.toFixed(2)}</span>
                            <button 
                              onClick={() => setExpandedOrderId(expandedOrderId === order.orderId ? null : order.orderId)}
                              className="text-xs block mt-1 ml-auto text-zinc-400 hover:text-white underline decoration-zinc-600 underline-offset-2"
                            >
                              {expandedOrderId === order.orderId ? 'Ocultar' : 'Detalles'}
                            </button>
                          </div>
                        </div>

                        {order.items?.[0]?.link && (
                          <div className="mb-3 text-xs text-blue-400 break-all">
                            🔗 {order.items[0].link}
                          </div>
                        )}

                        {expandedOrderId === order.orderId && (
                          <div className="mt-3 p-3 bg-black/40 rounded-lg text-xs space-y-2 mb-3 border border-zinc-800">
                            <p><strong className="text-zinc-500">Gateway:</strong> {order.gateway || 'N/A'}</p>
                            <p><strong className="text-zinc-500">Plataforma:</strong> {order.platform}</p>
                            <div>
                              <strong className="text-zinc-500">Items:</strong>
                              <ul className="list-disc pl-4 mt-1">
                                {order.items?.map((item, i) => (
                                  <li key={i}>
                                    {item.name || `${item.quantity} unidades`}
                                    {item.comments && item.comments.length > 0 && (
                                      <div className="mt-1 bg-zinc-900/50 p-2 rounded border border-zinc-700 text-[11px]">
                                        <p className="text-zinc-500 mb-1 font-bold">Comentarios ({item.comments.length}):</p>
                                        <ul className="list-decimal pl-4 text-zinc-300">
                                          {item.comments.map((c, j) => <li key={j}>{c}</li>)}
                                        </ul>
                                      </div>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}

                        <div className="mb-3 w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-[#ccff00] transition-all" style={{ width: `${progress}%` }} />
                        </div>

                        {order.pendingCount > 0 && (
                          <button
                            onClick={() => handleSendChunk(order.orderId)}
                            disabled={processingAction === order.orderId}
                            className="w-full py-3 bg-[#ccff00] text-black font-bold rounded-lg mt-2"
                          >
                            {processingAction === order.orderId ? '⏳ Enviando...' : `🚀 Enviar siguiente chunk`}
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </>
            )}

            {/* TAB YAPE */}
            {activeTab === 'yape' && (
              <>
                {yapeOrders.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-zinc-400 text-lg">No hay pagos Yape pendientes</p>
                  </div>
                ) : (
                  yapeOrders.map((order) => {
                    const isExpired = order.expiresAt ? new Date(order.expiresAt) < new Date() : false;

                    return (
                      <div key={order.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h2 className="font-mono text-sm text-zinc-400">{order.id}</h2>
                            <p className="text-white font-medium mt-1">{order.items?.[0]?.name}</p>
                            <p className="text-xs text-zinc-500 mt-1">Creado: {new Date(order.createdAt).toLocaleString('es-PE')}</p>
                          </div>
                          <div className="text-right flex flex-col items-end">
                            <span className="text-[#ccff00] font-bold text-lg">S/ {order.totalPEN?.toFixed(2)}</span>
                            {isExpired ? (
                              <span className="bg-red-900/50 text-red-400 px-2 py-1 rounded text-xs mt-2 border border-red-700/50">EXPIRADO</span>
                            ) : (
                              <span className="bg-amber-900/50 text-amber-400 px-2 py-1 rounded text-xs mt-2 border border-amber-700/50">ESPERANDO PAGO</span>
                            )}
                            <button 
                              onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                              className="text-xs mt-2 text-zinc-400 hover:text-white underline decoration-zinc-600 underline-offset-2"
                            >
                              {expandedOrderId === order.id ? 'Ocultar' : 'Detalles'}
                            </button>
                          </div>
                        </div>

                        {expandedOrderId === order.id && (
                          <div className="mt-3 p-3 bg-black/40 rounded-lg text-xs space-y-2 mb-3 border border-zinc-800">
                            <p><strong className="text-zinc-500">Plataforma:</strong> {order.platform}</p>
                            <div>
                              <strong className="text-zinc-500">Items:</strong>
                              <ul className="list-disc pl-4 mt-1">
                                {order.items?.map((item, i) => (
                                  <li key={i}>
                                    {item.name || `${item.quantity} unidades`} <br/> <a href={item.link} target="_blank" className="text-blue-400 break-all">🔗 {item.link}</a>
                                    {item.comments && item.comments.length > 0 && (
                                      <div className="mt-1 bg-zinc-900/50 p-2 rounded border border-zinc-700 text-[11px]">
                                        <p className="text-zinc-500 mb-1 font-bold">Comentarios ({item.comments.length}):</p>
                                        <ul className="list-decimal pl-4 text-zinc-300">
                                          {item.comments.map((c, j) => <li key={j}>{c}</li>)}
                                        </ul>
                                      </div>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => handleYapeAction(order.id, 'reject_yape')}
                            disabled={processingAction === order.id}
                            className="flex-1 py-2 bg-zinc-800 text-red-400 font-bold rounded-lg border border-red-900 hover:bg-red-900/30 transition-colors"
                          >
                            Rechazar / Eliminar
                          </button>
                          <button
                            onClick={() => handleYapeAction(order.id, 'approve_yape')}
                            disabled={processingAction === order.id}
                            className="flex-1 py-2 bg-[#ccff00] text-black font-bold rounded-lg hover:bg-[#b8e600] transition-colors"
                          >
                            {processingAction === order.id ? 'Aprobando...' : '✅ Aprobar Pago'}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </>
            )}

            {/* TAB HISTORY */}
            {activeTab === 'history' && (
              <>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="🔍 Buscar por ID de Orden o Enlace..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#ccff00] transition-colors"
                  />
                </div>
                {filteredHistoryOrders.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-zinc-400 text-lg">No se encontraron órdenes</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-zinc-400">
                      <thead className="text-xs text-zinc-500 uppercase bg-zinc-900/50 border-b border-zinc-800">
                        <tr>
                          <th className="px-4 py-3">ID / Fecha</th>
                          <th className="px-4 py-3">Servicio</th>
                          <th className="px-4 py-3">Estado</th>
                          <th className="px-4 py-3">Monto</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredHistoryOrders.map(order => (
                          <React.Fragment key={order.id}>
                            <tr 
                              onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                              className="border-b border-zinc-800 hover:bg-zinc-900/50 transition-colors cursor-pointer"
                            >
                              <td className="px-4 py-3">
                                <div className="font-mono text-white">{order.id}</div>
                                <div className="text-xs">{new Date(order.createdAt).toLocaleDateString('es-PE')}</div>
                              </td>
                              <td className="px-4 py-3 truncate max-w-[200px]" title={order.items?.[0]?.name}>
                                {order.items?.[0]?.name || 'N/A'}
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded text-xs border ${
                                  order.status === 'completed' ? 'bg-green-900/30 text-green-400 border-green-800/50' :
                                  order.status === 'pending_yape' ? 'bg-amber-900/30 text-amber-400 border-amber-800/50' :
                                  order.status === 'cancelled' ? 'bg-red-900/30 text-red-400 border-red-800/50' :
                                  'bg-zinc-800 text-zinc-400 border-zinc-700'
                                }`}>
                                  {order.status?.toUpperCase() || 'UNKNOWN'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-white font-bold text-right">
                                S/ {order.totalPEN?.toFixed(2)}
                              </td>
                            </tr>
                            {expandedOrderId === order.id && (
                              <tr className="bg-zinc-900/80 border-b border-zinc-800">
                                <td colSpan={4} className="p-4 text-xs">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <p><strong className="text-zinc-500">Gateway:</strong> {order.gateway || 'N/A'}</p>
                                      <p><strong className="text-zinc-500">Plataforma:</strong> {order.platform}</p>
                                    </div>
                                    <div>
                                      <strong className="text-zinc-500">Items:</strong>
                                      <ul className="list-disc pl-4 mt-1">
                                        {order.items?.map((item, i) => (
                                          <li key={i}>
                                            {item.name || `${item.quantity} unidades`} <br/> <a href={item.link} target="_blank" className="text-blue-400 break-all">🔗 {item.link}</a>
                                            {item.comments && item.comments.length > 0 && (
                                              <div className="mt-1 bg-zinc-900/50 p-2 rounded border border-zinc-700 text-[11px]">
                                                <p className="text-zinc-500 mb-1 font-bold">Comentarios ({item.comments.length}):</p>
                                                <ul className="list-decimal pl-4 text-zinc-300">
                                                  {item.comments.map((c, j) => <li key={j}>{c}</li>)}
                                                </ul>
                                              </div>
                                            )}
                                          </li>
                                        ))}
                                      </ul>
                                      {order.chunks && order.chunks.length > 0 && (
                                        <div className="mt-4 border-t border-zinc-800 pt-3">
                                          <strong className="text-zinc-500">Chunks ({order.chunksDelivered || 0}/{order.totalChunks || order.chunks.length}):</strong>
                                          <div className="flex flex-wrap gap-1 mt-2">
                                            {order.chunks.map((chunk: any, i: number) => (
                                              <span key={i} title={chunk.status} className={`px-2 py-0.5 text-[10px] rounded border ${chunk.status === 'sent' ? 'bg-green-900/30 text-green-400 border-green-800' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
                                                {chunk.status === 'sent' ? '✅' : '⏳'} {chunk.size.toLocaleString()}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
