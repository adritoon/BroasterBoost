'use client';

import React, { useState, useEffect, useCallback } from 'react';

type Tab = 'chunks' | 'yape' | 'history' | 'automations';

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

interface AutomationHistoryEntry {
  runIndex: number;
  providerOrderId: string | null;
  sentAt: string;
  success: boolean;
  error?: string;
}

interface Automation {
  id: string;
  serviceId: number;
  link: string;
  quantityPerRun: number;
  label: string;
  status: 'active' | 'paused' | 'completed' | 'error';
  intervalHours: number;
  durationDays: number;
  createdAt: string | null;
  expiresAt: string | null;
  totalRuns: number;
  maxRuns: number;
  lastRunAt: string | null;
  historyCount: number;
  recentHistory: AutomationHistoryEntry[];
}

function NextRunCountdown({ lastRunAt, intervalHours, status }: { lastRunAt: string | null, intervalHours: number, status: string }) {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (status !== 'active') {
      setTimeLeft('');
      return;
    }

    const calculate = () => {
      const now = new Date();
      let nextRun: Date;
      if (!lastRunAt) {
        setTimeLeft('Lista para ejecutar');
        return;
      } else {
        nextRun = new Date(new Date(lastRunAt).getTime() + intervalHours * 60 * 60 * 1000);
      }

      const diff = nextRun.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft('Lista para ejecutar');
      } else {
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`Próxima en ${h}h ${m}m ${s}s`);
      }
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [lastRunAt, intervalHours, status]);

  if (!timeLeft) return null;

  return (
    <span className={`text-[10px] font-medium ml-2 px-1.5 py-0.5 rounded ${timeLeft === 'Lista para ejecutar' ? 'bg-[#ccff00]/20 text-[#ccff00]' : 'bg-zinc-800 text-zinc-400'}`}>
      ⏱️ {timeLeft}
    </span>
  );
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
  const [automations, setAutomations] = useState<Automation[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [processingAction, setProcessingAction] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Automation form state
  const [autoForm, setAutoForm] = useState({
    serviceId: '',
    link: '',
    quantityPerRun: '',
    label: '',
    intervalHours: '3',
    durationDays: '30',
  });
  const [creatingAuto, setCreatingAuto] = useState(false);
  const [runningCron, setRunningCron] = useState(false);
  const [expandedAutoId, setExpandedAutoId] = useState<string | null>(null);
  const [editingAutoId, setEditingAutoId] = useState<string | null>(null);
  const [editAutoForm, setEditAutoForm] = useState({ quantityPerRun: '', intervalHours: '' });
  const [lastRefresh, setLastRefresh] = useState<string>('');

  const fetchTab = useCallback(async (tab: Tab) => {
    setLoading(true);
    try {
      let url = '';
      if (tab === 'chunks') {
        url = `/api/admin/chunks?adminKey=${encodeURIComponent(adminKey)}`;
      } else if (tab === 'yape') {
        url = `/api/admin/orders?adminKey=${encodeURIComponent(adminKey)}&status=pending_yape`;
      } else if (tab === 'automations') {
        url = `/api/admin/automations?adminKey=${encodeURIComponent(adminKey)}`;
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
        if (tab === 'automations') setAutomations(data.automations || []);
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

  const handleCreateAutomation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!autoForm.serviceId || !autoForm.link || !autoForm.quantityPerRun) return;

    setCreatingAuto(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/automations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminKey,
          serviceId: autoForm.serviceId,
          link: autoForm.link,
          quantityPerRun: autoForm.quantityPerRun,
          label: autoForm.label,
          intervalHours: autoForm.intervalHours,
          durationDays: autoForm.durationDays,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ text: `✅ ${data.message}`, type: 'success' });
        setAutoForm({ serviceId: '', link: '', quantityPerRun: '', label: '', intervalHours: '3', durationDays: '30' });
        fetchOrders();
      } else {
        setMessage({ text: `❌ ${data.error}`, type: 'error' });
      }
    } catch {
      setMessage({ text: '❌ Error de conexión', type: 'error' });
    } finally {
      setCreatingAuto(false);
    }
  };

  const handleRunCron = async () => {
    if (!confirm('¿Procesar ahora todas las automatizaciones pendientes?')) return;
    setRunningCron(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/automations/cron?adminKey=${adminKey}`);
      const data = await res.json();
      if (data.success) {
        setMessage({ text: `✅ Tareas procesadas: ${data.processed} (${data.successCount} exitosas, ${data.failCount} fallidas)`, type: 'success' });
        fetchTab('automations');
      } else {
        setMessage({ text: `❌ Error: ${data.error}`, type: 'error' });
      }
    } catch {
      setMessage({ text: '❌ Error al ejecutar las tareas', type: 'error' });
    } finally {
      setRunningCron(false);
    }
  };

  const handleAutomationAction = async (automationId: string, action: 'pause' | 'resume' | 'delete' | 'run_now' | 'update', updates?: { quantityPerRun?: string; intervalHours?: string }) => {
    setProcessingAction(automationId);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/automations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminKey, automationId, action, updates }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ text: `✅ ${data.message}`, type: 'success' });
        setEditingAutoId(null);
        fetchOrders();
      } else {
        setMessage({ text: `❌ ${data.error}`, type: 'error' });
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
          {(['chunks', 'yape', 'history', 'automations'] as Tab[]).map((tab) => (
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
              {tab === 'automations' && '⚡ Automatización'}
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

            {/* TAB AUTOMATIZACIÓN */}
            {activeTab === 'automations' && (
              <>
                <div className="flex justify-end mb-6">
                  <button
                    onClick={handleRunCron}
                    disabled={runningCron}
                    className="flex items-center gap-2 bg-[#ccff00] text-black px-4 py-2 rounded-lg font-bold hover:bg-[#b8e600] transition-colors disabled:opacity-50"
                  >
                    {runningCron ? '⏳ Procesando...' : '🔄 Procesar Tareas Pendientes'}
                  </button>
                </div>

                {/* Formulario para crear nueva automatización */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-6">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <span className="text-xl">⚡</span> Nueva Automatización
                  </h2>
                  <p className="text-zinc-400 text-sm mb-4">
                    Envía órdenes automáticamente al proveedor SMM. Configura el intervalo y la duración.
                  </p>
                  <form onSubmit={handleCreateAutomation} className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-zinc-500 mb-1 font-medium">Service ID del Proveedor *</label>
                        <input
                          type="number"
                          value={autoForm.serviceId}
                          onChange={(e) => setAutoForm({ ...autoForm, serviceId: e.target.value })}
                          placeholder="Ej: 1234"
                          className="w-full bg-black border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#ccff00] transition-colors placeholder:text-zinc-600"
                          required
                          min="1"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-500 mb-1 font-medium">Cantidad por ejecución *</label>
                        <input
                          type="number"
                          value={autoForm.quantityPerRun}
                          onChange={(e) => setAutoForm({ ...autoForm, quantityPerRun: e.target.value })}
                          placeholder="Ej: 1000"
                          className="w-full bg-black border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#ccff00] transition-colors placeholder:text-zinc-600"
                          required
                          min="1"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-zinc-500 mb-1 font-medium">Intervalo (horas) *</label>
                        <input
                          type="number"
                          value={autoForm.intervalHours}
                          onChange={(e) => setAutoForm({ ...autoForm, intervalHours: e.target.value })}
                          placeholder="3"
                          className="w-full bg-black border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#ccff00] transition-colors placeholder:text-zinc-600"
                          required
                          min="1"
                          max="72"
                        />
                        <p className="text-[10px] text-zinc-600 mt-1">Cada cuántas horas se ejecuta (1-72h)</p>
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-500 mb-1 font-medium">Duración (días) *</label>
                        <input
                          type="number"
                          value={autoForm.durationDays}
                          onChange={(e) => setAutoForm({ ...autoForm, durationDays: e.target.value })}
                          placeholder="30"
                          className="w-full bg-black border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#ccff00] transition-colors placeholder:text-zinc-600"
                          required
                          min="1"
                          max="90"
                        />
                        <p className="text-[10px] text-zinc-600 mt-1">Cuántos días estará activa (1-90 días)</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1 font-medium">Link / URL del contenido *</label>
                      <input
                        type="url"
                        value={autoForm.link}
                        onChange={(e) => setAutoForm({ ...autoForm, link: e.target.value })}
                        placeholder="https://..."
                        className="w-full bg-black border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#ccff00] transition-colors placeholder:text-zinc-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1 font-medium">Etiqueta (opcional)</label>
                      <input
                        type="text"
                        value={autoForm.label}
                        onChange={(e) => setAutoForm({ ...autoForm, label: e.target.value })}
                        placeholder="Ej: Views para video principal"
                        className="w-full bg-black border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#ccff00] transition-colors placeholder:text-zinc-600"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={creatingAuto || !autoForm.serviceId || !autoForm.link || !autoForm.quantityPerRun || !autoForm.intervalHours || !autoForm.durationDays}
                      className="w-full py-3 bg-[#ccff00] text-black font-bold rounded-lg hover:bg-[#b8e600] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                      {creatingAuto ? '⏳ Creando...' : `🚀 Crear Automatización (cada ${autoForm.intervalHours || 3}h × ${autoForm.durationDays || 30} días)`}
                    </button>
                  </form>
                </div>

                {/* Lista de automatizaciones */}
                {automations.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-4xl mb-3">⚡</div>
                    <p className="text-zinc-400 text-lg">No hay automatizaciones creadas</p>
                    <p className="text-zinc-600 text-sm mt-1">Usa el formulario de arriba para crear una</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {automations.map((auto) => {
                      const progress = auto.maxRuns > 0 ? (auto.totalRuns / auto.maxRuns) * 100 : 0;
                      const daysLeft = auto.expiresAt
                        ? Math.max(0, Math.ceil((new Date(auto.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
                        : 0;
                      const isExpanded = expandedAutoId === auto.id;

                      const statusConfig: Record<string, { bg: string; text: string; border: string; label: string }> = {
                        active: { bg: 'bg-green-900/30', text: 'text-green-400', border: 'border-green-800/50', label: 'ACTIVA' },
                        paused: { bg: 'bg-amber-900/30', text: 'text-amber-400', border: 'border-amber-800/50', label: 'PAUSADA' },
                        completed: { bg: 'bg-blue-900/30', text: 'text-blue-400', border: 'border-blue-800/50', label: 'COMPLETADA' },
                        error: { bg: 'bg-red-900/30', text: 'text-red-400', border: 'border-red-800/50', label: 'ERROR' },
                      };
                      const st = statusConfig[auto.status] || statusConfig.active;

                      return (
                        <div key={auto.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${st.bg} ${st.text} ${st.border}`}>
                                  {st.label}
                                </span>
                                <NextRunCountdown lastRunAt={auto.lastRunAt} intervalHours={auto.intervalHours} status={auto.status} />
                                {auto.status === 'active' && (
                                  <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                  </span>
                                )}
                              </div>
                              <h3 className="text-white font-medium truncate">{auto.label}</h3>
                              <p className="text-xs text-zinc-500 font-mono mt-0.5">ID: {auto.id}</p>
                            </div>
                            <div className="text-right ml-3 flex-shrink-0">
                              <p className="text-[#ccff00] font-bold text-sm">Service #{auto.serviceId}</p>
                              {editingAutoId === auto.id ? (
                                <div className="flex flex-col gap-1.5 mt-1">
                                  <div className="flex items-center gap-1">
                                    <label className="text-[10px] text-zinc-500 w-8">Qty:</label>
                                    <input
                                      type="number"
                                      value={editAutoForm.quantityPerRun}
                                      onChange={(e) => setEditAutoForm({ ...editAutoForm, quantityPerRun: e.target.value })}
                                      className="w-20 bg-black border border-zinc-600 text-white rounded px-2 py-0.5 text-xs focus:border-[#ccff00] outline-none"
                                      min="1"
                                    />
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <label className="text-[10px] text-zinc-500 w-8">Int:</label>
                                    <input
                                      type="number"
                                      value={editAutoForm.intervalHours}
                                      onChange={(e) => setEditAutoForm({ ...editAutoForm, intervalHours: e.target.value })}
                                      className="w-20 bg-black border border-zinc-600 text-white rounded px-2 py-0.5 text-xs focus:border-[#ccff00] outline-none"
                                      min="1"
                                      max="72"
                                    />
                                    <span className="text-[10px] text-zinc-500">h</span>
                                  </div>
                                  <div className="flex gap-1 mt-0.5">
                                    <button
                                      onClick={() => handleAutomationAction(auto.id, 'update', { quantityPerRun: editAutoForm.quantityPerRun, intervalHours: editAutoForm.intervalHours })}
                                      disabled={processingAction === auto.id}
                                      className="px-2 py-0.5 bg-[#ccff00] text-black font-bold rounded text-[10px] hover:bg-[#b8e600] disabled:opacity-50"
                                    >
                                      💾
                                    </button>
                                    <button
                                      onClick={() => setEditingAutoId(null)}
                                      className="px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded text-[10px] hover:bg-zinc-700"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <p className="text-zinc-400 text-xs">{auto.quantityPerRun.toLocaleString()} / cada {auto.intervalHours}h</p>
                                  {(auto.status === 'active' || auto.status === 'paused') && (
                                    <button
                                      onClick={() => {
                                        setEditingAutoId(auto.id);
                                        setEditAutoForm({
                                          quantityPerRun: auto.quantityPerRun.toString(),
                                          intervalHours: auto.intervalHours.toString(),
                                        });
                                      }}
                                      className="mt-1 px-2 py-0.5 bg-zinc-800 text-zinc-400 hover:text-[#ccff00] hover:border-[#ccff00]/50 transition-colors text-[10px] rounded border border-zinc-700"
                                    >
                                      ✏️ Editar
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </div>

                          {/* Link */}
                          <div className="mb-3 text-xs text-blue-400 break-all">
                            🔗 {auto.link}
                          </div>

                          {/* Progress */}
                          <div className="mb-3">
                            <div className="flex justify-between text-xs text-zinc-500 mb-1">
                              <span>{auto.totalRuns} / {auto.maxRuns} ejecuciones</span>
                              <span>{daysLeft} días restantes</span>
                            </div>
                            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all rounded-full ${
                                  auto.status === 'error' ? 'bg-red-500' :
                                  auto.status === 'completed' ? 'bg-blue-500' :
                                  'bg-[#ccff00]'
                                }`}
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              />
                            </div>
                          </div>

                          {/* Last run info */}
                          {auto.lastRunAt && (
                            <p className="text-xs text-zinc-500 mb-3">
                              Última ejecución: {new Date(auto.lastRunAt).toLocaleString('es-PE')}
                            </p>
                          )}

                          {/* Expandable history */}
                          <button
                            onClick={() => setExpandedAutoId(isExpanded ? null : auto.id)}
                            className="text-xs text-zinc-400 hover:text-white underline decoration-zinc-600 underline-offset-2 mb-3"
                          >
                            {isExpanded ? 'Ocultar historial' : `Ver historial (${auto.historyCount} ejecuciones)`}
                          </button>

                          {isExpanded && auto.recentHistory.length > 0 && (
                            <div className="mt-2 mb-3 p-3 bg-black/40 rounded-lg border border-zinc-800">
                              <p className="text-xs text-zinc-500 font-bold mb-2">Últimas ejecuciones:</p>
                              <div className="space-y-1.5">
                                {auto.recentHistory.map((h, i) => (
                                  <div key={i} className="flex items-center justify-between text-[11px] py-1 border-b border-zinc-800/50 last:border-0">
                                    <div className="flex items-center gap-2">
                                      <span>{h.success ? '✅' : '❌'}</span>
                                      <span className="text-zinc-400">
                                        Run #{h.runIndex + 1}
                                      </span>
                                      {h.providerOrderId && (
                                        <span className="text-zinc-600">→ Order #{h.providerOrderId}</span>
                                      )}
                                      {h.error && (
                                        <span className="text-red-400">{h.error}</span>
                                      )}
                                    </div>
                                    <span className="text-zinc-600">
                                      {new Date(h.sentAt).toLocaleString('es-PE', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              {auto.historyCount > 5 && (
                                <p className="text-[10px] text-zinc-600 mt-2 text-center">
                                  Mostrando las últimas 5 de {auto.historyCount} ejecuciones
                                </p>
                              )}
                            </div>
                          )}

                          {isExpanded && auto.recentHistory.length === 0 && (
                            <div className="mt-2 mb-3 p-3 bg-black/40 rounded-lg border border-zinc-800 text-center">
                              <p className="text-xs text-zinc-500">Aún no hay ejecuciones</p>
                            </div>
                          )}

                          {/* Action buttons */}
                          {(auto.status === 'active' || auto.status === 'paused' || auto.status === 'error') && (
                            <div className="flex gap-2 mt-2">
                              {auto.status === 'active' && (
                                <>
                                  <button
                                    onClick={() => handleAutomationAction(auto.id, 'run_now')}
                                    disabled={processingAction === auto.id}
                                    className="flex-1 py-2 bg-[#ccff00]/10 text-[#ccff00] font-bold rounded-lg text-sm border border-[#ccff00]/30 hover:bg-[#ccff00]/20 transition-colors disabled:opacity-50"
                                  >
                                    ▶️ Ejecutar Ahora
                                  </button>
                                  <button
                                    onClick={() => handleAutomationAction(auto.id, 'pause')}
                                    disabled={processingAction === auto.id}
                                    className="flex-1 py-2 bg-zinc-800 text-amber-400 font-bold rounded-lg text-sm border border-amber-900/50 hover:bg-amber-900/20 transition-colors disabled:opacity-50"
                                  >
                                    ⏸️ Pausar
                                  </button>
                                </>
                              )}
                              {(auto.status === 'paused' || auto.status === 'error') && (
                                <button
                                  onClick={() => handleAutomationAction(auto.id, 'resume')}
                                  disabled={processingAction === auto.id}
                                  className="flex-1 py-2 bg-[#ccff00] text-black font-bold rounded-lg text-sm hover:bg-[#b8e600] transition-colors disabled:opacity-50"
                                >
                                  {processingAction === auto.id ? '⏳...' : '▶️ Reanudar'}
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  if (confirm('¿Seguro que quieres eliminar esta automatización?')) {
                                    handleAutomationAction(auto.id, 'delete');
                                  }
                                }}
                                disabled={processingAction === auto.id}
                                className="py-2 px-4 bg-zinc-800 text-red-400 font-bold rounded-lg text-sm border border-red-900/50 hover:bg-red-900/20 transition-colors disabled:opacity-50"
                              >
                                🗑️
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
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
