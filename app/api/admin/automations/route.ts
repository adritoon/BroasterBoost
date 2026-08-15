import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { sendOrderToProvider } from '@/lib/provider';

function validateAdminKey(request: Request): boolean {
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey) return false;

  const url = new URL(request.url);
  const queryKey = url.searchParams.get('adminKey');
  const headerKey = request.headers.get('x-admin-key');

  return queryKey === adminKey || headerKey === adminKey;
}

function getAdminKeyFromBody(body: any, request: Request): boolean {
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey) return false;
  const providedKey = body.adminKey || request.headers.get('x-admin-key');
  return providedKey === adminKey;
}

/**
 * GET /api/admin/automations — Lista todas las automatizaciones
 */
export async function GET(request: Request) {
  if (!validateAdminKey(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const snapshot = await adminDb.collection('automations')
      .orderBy('createdAt', 'desc')
      .get();

    const automations = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        serviceId: data.serviceId,
        link: data.link,
        quantityPerRun: data.quantityPerRun,
        label: data.label || '',
        status: data.status,
        intervalHours: data.intervalHours || 3,
        durationDays: data.durationDays || 30,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : null,
        expiresAt: data.expiresAt?.toDate ? data.expiresAt.toDate().toISOString() : null,
        totalRuns: data.totalRuns || 0,
        maxRuns: data.maxRuns || 240,
        lastRunAt: data.lastRunAt || null,
        historyCount: (data.history || []).length,
        // Send last 5 history entries for preview
        recentHistory: (data.history || []).slice(-5).reverse(),
      };
    });

    return NextResponse.json({ success: true, automations });
  } catch (error) {
    console.error('Error fetching automations:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

/**
 * POST /api/admin/automations — Crea una nueva automatización
 * Body: { adminKey, serviceId, link, quantityPerRun, label?, intervalHours?, durationDays? }
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));

  if (!getAdminKeyFromBody(body, request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { serviceId, link, quantityPerRun, label, intervalHours, durationDays } = body;

  // Validación
  if (!serviceId || !link || !quantityPerRun) {
    return NextResponse.json(
      { error: 'Faltan campos requeridos: serviceId, link, quantityPerRun' },
      { status: 400 }
    );
  }

  const numServiceId = Number(serviceId);
  const numQuantity = Number(quantityPerRun);

  if (isNaN(numServiceId) || numServiceId <= 0) {
    return NextResponse.json({ error: 'Service ID inválido' }, { status: 400 });
  }

  if (isNaN(numQuantity) || numQuantity <= 0) {
    return NextResponse.json({ error: 'Cantidad inválida' }, { status: 400 });
  }

  // Validar intervalHours (mínimo 1h, máximo 72h, default 3h)
  const numInterval = Number(intervalHours) || 3;
  if (numInterval < 1 || numInterval > 72) {
    return NextResponse.json({ error: 'Intervalo inválido. Debe ser entre 1 y 72 horas.' }, { status: 400 });
  }

  // Validar durationDays (mínimo 1 día, máximo 90 días, default 30)
  const numDuration = Number(durationDays) || 30;
  if (numDuration < 1 || numDuration > 90) {
    return NextResponse.json({ error: 'Duración inválida. Debe ser entre 1 y 90 días.' }, { status: 400 });
  }

  try {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + numDuration * 24 * 60 * 60 * 1000);
    // maxRuns = duración en horas / intervalo en horas
    const maxRuns = Math.floor((numDuration * 24) / numInterval);

    const docRef = await adminDb.collection('automations').add({
      serviceId: numServiceId,
      link: link.trim(),
      quantityPerRun: numQuantity,
      label: (label || '').trim() || `Service #${numServiceId}`,
      status: 'active',
      intervalHours: numInterval,
      durationDays: numDuration,
      createdAt: FieldValue.serverTimestamp(),
      expiresAt: expiresAt,
      totalRuns: 0,
      maxRuns,
      lastRunAt: null,
      history: [],
    });

    console.log(`⚡ Automatización creada: ${docRef.id} — Service ${numServiceId}, ${numQuantity}/run, cada ${numInterval}h, ${numDuration} días`);

    return NextResponse.json({
      success: true,
      id: docRef.id,
      message: `Automatización creada. Se ejecutará cada ${numInterval}h durante ${numDuration} días (${maxRuns} ejecuciones máx.)`,
    });
  } catch (error) {
    console.error('Error creating automation:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/automations — Pausa, reanuda, elimina o ejecuta manualmente una automatización
 * Body: { adminKey, automationId, action: 'pause' | 'resume' | 'delete' | 'run_now' }
 */
export async function PATCH(request: Request) {
  const body = await request.json().catch(() => ({}));

  if (!getAdminKeyFromBody(body, request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { automationId, action } = body;

  if (!automationId || !action) {
    return NextResponse.json({ error: 'Faltan automationId o action' }, { status: 400 });
  }

  const validActions = ['pause', 'resume', 'delete', 'run_now'];
  if (!validActions.includes(action)) {
    return NextResponse.json({ error: `Acción inválida. Usar: ${validActions.join(', ')}` }, { status: 400 });
  }

  try {
    const docRef = adminDb.collection('automations').doc(automationId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: 'Automatización no encontrada' }, { status: 404 });
    }

    if (action === 'delete') {
      await docRef.delete();
      console.log(`🗑️ Automatización ${automationId} eliminada`);
      return NextResponse.json({ success: true, message: 'Automatización eliminada' });
    }

    if (action === 'pause') {
      await docRef.update({ status: 'paused' });
      console.log(`⏸️ Automatización ${automationId} pausada`);
      return NextResponse.json({ success: true, message: 'Automatización pausada' });
    }

    if (action === 'resume') {
      const data = docSnap.data();
      const expiresAt = data?.expiresAt?.toDate ? data.expiresAt.toDate() : null;

      if (expiresAt && new Date() >= expiresAt) {
        return NextResponse.json({ error: `No se puede reanudar: la automatización ya expiró (${data?.durationDays || 30} días)` }, { status: 400 });
      }

      await docRef.update({ status: 'active' });
      console.log(`▶️ Automatización ${automationId} reanudada`);
      return NextResponse.json({ success: true, message: 'Automatización reanudada' });
    }

    if (action === 'run_now') {
      const data = docSnap.data();
      if (!data) return NextResponse.json({ error: 'Datos no encontrados' }, { status: 404 });

      const maxRuns = data.maxRuns || 240;
      const totalRuns = data.totalRuns || 0;
      
      if (totalRuns >= maxRuns) {
        return NextResponse.json({ error: 'Límite de ejecuciones alcanzado' }, { status: 400 });
      }

      const result = await sendOrderToProvider(Number(data.serviceId), data.link, Number(data.quantityPerRun));
      const now = new Date().toISOString();
      
      const runEntry = {
        runIndex: totalRuns,
        providerOrderId: result.success ? (result.orderId?.toString() || null) : null,
        sentAt: now,
        success: result.success,
        error: result.success ? null : (result.error || 'Unknown error'),
      };

      const history = data.history || [];
      history.push(runEntry);
      const trimmedHistory = history.length > 50 ? history.slice(-50) : history;

      const newTotalRuns = totalRuns + 1;
      const updateData: any = {
        totalRuns: newTotalRuns,
        lastRunAt: now,
        history: trimmedHistory,
      };

      if (newTotalRuns >= maxRuns) {
        updateData.status = 'completed';
      }

      await docRef.update(updateData);

      if (result.success) {
        return NextResponse.json({ success: true, message: `Orden enviada exitosamente (ID: ${result.orderId})` });
      } else {
        return NextResponse.json({ error: `Error del proveedor: ${result.error}` }, { status: 400 });
      }
    }

    return NextResponse.json({ error: 'Acción no procesada' }, { status: 400 });
  } catch (error) {
    console.error('Error updating automation:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
