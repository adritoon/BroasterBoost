import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { PROVIDER_COSTS, PRODUCTS } from '@/lib/products';

function validateAdminKey(request: Request): boolean {
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey) return false;

  const url = new URL(request.url);
  const queryKey = url.searchParams.get('adminKey');
  const headerKey = request.headers.get('x-admin-key');

  return queryKey === adminKey || headerKey === adminKey;
}

// Tipo de cambio por defecto (se puede enviar como query param)
const DEFAULT_USD_RATE = 3.70;

interface FinanceItem {
  platform: string;
  serviceType: string;
  revenuePEN: number;
  costUSD: number;
  costPEN: number;
  profitPEN: number;
  orderCount: number;
}

/**
 * GET — Admin only.
 * Devuelve métricas financieras agregadas desde las órdenes completadas.
 * Query params opcionales:
 * - period: 'today' | 'week' | 'month' | 'all' (default: 'all')
 * - usdRate: tipo de cambio USD→PEN (default: 3.70)
 */
export async function GET(request: Request) {
  if (!validateAdminKey(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const period = url.searchParams.get('period') || 'all';
  const usdRate = parseFloat(url.searchParams.get('usdRate') || '') || DEFAULT_USD_RATE;

  try {
    // Determinar fecha de inicio según el periodo
    let startDate: Date | null = null;
    const now = new Date();

    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'all':
      default:
        startDate = null;
    }

    // Consultar órdenes completadas (= pagadas y confirmadas)
    // Nota: Las órdenes con chunks también tienen status 'completed'.
    // Los chunks son sub-divisiones internas de cada item, no estados de la orden.
    let query: any = adminDb.collection('orders').where('status', '==', 'completed');

    if (startDate) {
      query = query.where('createdAt', '>=', startDate);
    }

    const snapshot = await query.get();
    const allDocs = snapshot.docs;

    // Agregar métricas
    let totalRevenuePEN = 0;
    let totalCostUSD = 0;
    let totalOrders = allDocs.length;
    const byPlatform: Record<string, FinanceItem> = {};
    const byService: Record<string, FinanceItem> = {};

    // Para órdenes históricas sin totalCostUSD, recalcular desde items
    for (const doc of allDocs) {
      const data = doc.data();
      const orderRevenue = data.totalPEN || 0;
      totalRevenuePEN += orderRevenue;

      // Costo directo de la orden o recalcular
      let orderCostUSD = data.totalCostUSD || 0;

      if (!orderCostUSD && data.items) {
        // Recalcular para órdenes históricas que no tienen totalCostUSD
        for (const item of data.items) {
          if (item.providerCostUSD) {
            orderCostUSD += item.providerCostUSD;
          } else if (item.serviceId) {
            const costInfo = PROVIDER_COSTS[item.serviceId];
            if (costInfo) {
              orderCostUSD += (item.quantity / costInfo.baseQty) * costInfo.costUSD;
            }
          }
        }
      }

      totalCostUSD += orderCostUSD;

      // Desglose por items
      if (data.items) {
        for (const item of data.items) {
          const platform = data.platform || 'unknown';
          // Resolver serviceType: campo directo > buscar por productId > buscar por serviceId > 'unknown'
          let serviceType = item.serviceType;
          if (!serviceType && item.productId) {
            const matchedProduct = PRODUCTS.find(p => p.id === item.productId);
            if (matchedProduct) serviceType = matchedProduct.service_type;
          }
          if (!serviceType && item.serviceId) {
            const matchedProduct = PRODUCTS.find(p => p.provider_id === item.serviceId);
            if (matchedProduct) serviceType = matchedProduct.service_type;
          }
          if (!serviceType) serviceType = 'unknown';
          const itemRevenue = item.price || 0;

          let itemCostUSD = item.providerCostUSD || 0;
          if (!itemCostUSD && item.serviceId) {
            const costInfo = PROVIDER_COSTS[item.serviceId];
            if (costInfo) {
              itemCostUSD = (item.quantity / costInfo.baseQty) * costInfo.costUSD;
            }
          }

          const itemCostPEN = itemCostUSD * usdRate;

          // Por plataforma
          if (!byPlatform[platform]) {
            byPlatform[platform] = {
              platform,
              serviceType: '',
              revenuePEN: 0,
              costUSD: 0,
              costPEN: 0,
              profitPEN: 0,
              orderCount: 0,
            };
          }
          byPlatform[platform].revenuePEN += itemRevenue;
          byPlatform[platform].costUSD += itemCostUSD;
          byPlatform[platform].costPEN += itemCostPEN;
          byPlatform[platform].profitPEN += itemRevenue - itemCostPEN;
          byPlatform[platform].orderCount += 1;

          // Por servicio (platform + serviceType)
          const serviceKey = `${platform}:${serviceType}`;
          if (!byService[serviceKey]) {
            byService[serviceKey] = {
              platform,
              serviceType,
              revenuePEN: 0,
              costUSD: 0,
              costPEN: 0,
              profitPEN: 0,
              orderCount: 0,
            };
          }
          byService[serviceKey].revenuePEN += itemRevenue;
          byService[serviceKey].costUSD += itemCostUSD;
          byService[serviceKey].costPEN += itemCostPEN;
          byService[serviceKey].profitPEN += itemRevenue - itemCostPEN;
          byService[serviceKey].orderCount += 1;
        }
      }
    }

    const totalCostPEN = totalCostUSD * usdRate;
    const totalProfitPEN = totalRevenuePEN - totalCostPEN;
    const profitMargin = totalRevenuePEN > 0 ? (totalProfitPEN / totalRevenuePEN) * 100 : 0;

    // Ordenar por revenue
    const platformBreakdown = Object.values(byPlatform)
      .map(p => ({
        ...p,
        revenuePEN: parseFloat(p.revenuePEN.toFixed(2)),
        costPEN: parseFloat(p.costPEN.toFixed(2)),
        costUSD: parseFloat(p.costUSD.toFixed(4)),
        profitPEN: parseFloat(p.profitPEN.toFixed(2)),
      }))
      .sort((a, b) => b.revenuePEN - a.revenuePEN);

    const serviceBreakdown = Object.values(byService)
      .map(s => ({
        ...s,
        revenuePEN: parseFloat(s.revenuePEN.toFixed(2)),
        costPEN: parseFloat(s.costPEN.toFixed(2)),
        costUSD: parseFloat(s.costUSD.toFixed(4)),
        profitPEN: parseFloat(s.profitPEN.toFixed(2)),
      }))
      .sort((a, b) => b.profitPEN - a.profitPEN);

    return NextResponse.json({
      success: true,
      period,
      usdRate,
      summary: {
        totalOrders,
        totalRevenuePEN: parseFloat(totalRevenuePEN.toFixed(2)),
        totalCostUSD: parseFloat(totalCostUSD.toFixed(4)),
        totalCostPEN: parseFloat(totalCostPEN.toFixed(2)),
        totalProfitPEN: parseFloat(totalProfitPEN.toFixed(2)),
        profitMargin: parseFloat(profitMargin.toFixed(1)),
      },
      platformBreakdown,
      serviceBreakdown,
    });
  } catch (error) {
    console.error('Error fetching finance data:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
