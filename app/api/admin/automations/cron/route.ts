import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { sendOrderToProvider } from '@/lib/provider';

/**
 * GET /api/admin/automations/cron — Endpoint Cron
 * 
 * Ejecuta todas las automatizaciones activas que no han expirado.
 * Protegido con CRON_SECRET (via query param o header).
 * 
 * Se ejecuta cada hora desde Vercel Cron. Cada automatización
 * tiene su propio intervalHours que determina cuándo se ejecuta.
 * Ejemplo: GET /api/admin/automations/cron?secret=TU_CRON_SECRET
 */
export async function GET(request: Request) {
  // Validar CRON_SECRET
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    console.error('❌ CRON_SECRET no configurado en .env.local');
    return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 500 });
  }

  const url = new URL(request.url);
  const providedSecret =
    url.searchParams.get('secret') ||
    request.headers.get('x-cron-secret') ||
    // Vercel Cron usa este header
    request.headers.get('authorization')?.replace('Bearer ', '');

  if (providedSecret !== cronSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const results: Array<{
    automationId: string;
    label: string;
    success: boolean;
    providerOrderId?: string;
    error?: string;
  }> = [];

  try {
    // Buscar automatizaciones activas
    const snapshot = await adminDb.collection('automations')
      .where('status', '==', 'active')
      .get();

    if (snapshot.empty) {
      console.log('⚡ Cron: No hay automatizaciones activas');
      return NextResponse.json({
        success: true,
        message: 'No hay automatizaciones activas',
        processed: 0,
      });
    }

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const automationId = doc.id;
      const label = data.label || `Service #${data.serviceId}`;

      // Verificar expiración
      const expiresAt = data.expiresAt?.toDate ? data.expiresAt.toDate() : null;
      if (expiresAt && now >= expiresAt) {
        console.log(`⏰ Automatización ${automationId} expirada. Marcando como completada.`);
        await doc.ref.update({ status: 'completed' });
        results.push({ automationId, label, success: false, error: `Expirada (${data.durationDays || 30} días)` });
        continue;
      }

      // Verificar maxRuns
      const totalRuns = data.totalRuns || 0;
      const maxRuns = data.maxRuns || 240;
      if (totalRuns >= maxRuns) {
        console.log(`🔢 Automatización ${automationId} alcanzó maxRuns (${maxRuns}). Marcando como completada.`);
        await doc.ref.update({ status: 'completed' });
        results.push({ automationId, label, success: false, error: `Máximo de ejecuciones alcanzado (${maxRuns})` });
        continue;
      }

      // Verificar intervalo: ¿ha pasado suficiente tiempo desde la última ejecución?
      const intervalHours = data.intervalHours || 3;
      if (data.lastRunAt) {
        const lastRun = new Date(data.lastRunAt);
        const nextRunAt = new Date(lastRun.getTime() + intervalHours * 60 * 60 * 1000);
        if (now < nextRunAt) {
          // Aún no toca ejecutar esta automatización
          continue;
        }
      }

      // Enviar orden al proveedor
      console.log(`🚀 Cron ejecutando automatización ${automationId}: Service ${data.serviceId}, qty ${data.quantityPerRun}, intervalo ${intervalHours}h, link: ${data.link}`);

      try {
        const result = await sendOrderToProvider(
          Number(data.serviceId),
          data.link,
          Number(data.quantityPerRun)
        );

        const runEntry = {
          runIndex: totalRuns,
          providerOrderId: result.success ? (result.orderId?.toString() || null) : null,
          sentAt: now.toISOString(),
          success: result.success,
          error: result.success ? undefined : (result.error || 'Unknown error'),
        };

        // Actualizar documento
        const newTotalRuns = totalRuns + 1;
        const history = data.history || [];
        history.push(runEntry);

        // Solo guardar las últimas 50 entradas de historial para no sobrecargar Firestore
        const trimmedHistory = history.length > 50 ? history.slice(-50) : history;

        const updateData: any = {
          totalRuns: newTotalRuns,
          lastRunAt: now.toISOString(),
          history: trimmedHistory,
        };

        // Si alcanzó maxRuns, marcar como completada
        if (newTotalRuns >= maxRuns) {
          updateData.status = 'completed';
        }

        await doc.ref.update(updateData);

        if (result.success) {
          console.log(`✅ Automatización ${automationId}: Orden enviada. Run ${newTotalRuns}/${maxRuns}. OrderID: ${result.orderId}`);
          results.push({
            automationId,
            label,
            success: true,
            providerOrderId: result.orderId?.toString(),
          });
        } else {
          console.error(`❌ Automatización ${automationId}: Error del proveedor — ${result.error}`);

          // Si falla 3 veces seguidas, pausar automáticamente
          const lastThree = trimmedHistory.slice(-3);
          const threeConsecutiveFails = lastThree.length === 3 && lastThree.every((h: any) => !h.success);
          if (threeConsecutiveFails) {
            await doc.ref.update({ status: 'error' });
            console.error(`🛑 Automatización ${automationId} pausada por 3 fallos consecutivos`);
          }

          results.push({
            automationId,
            label,
            success: false,
            error: result.error,
          });
        }
      } catch (providerError) {
        console.error(`❌ Error de conexión para automatización ${automationId}:`, providerError);
        results.push({
          automationId,
          label,
          success: false,
          error: 'Error de conexión con el proveedor',
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    console.log(`⚡ Cron completado: ${successCount} exitosos, ${failCount} fallidos de ${results.length} total`);

    // Log de auditoría del cron
    await adminDb.collection('admin_logs').add({
      action: 'cron_automation_run',
      timestamp: now.toISOString(),
      totalProcessed: results.length,
      successCount,
      failCount,
      results,
    });

    return NextResponse.json({
      success: true,
      processed: results.length,
      successCount,
      failCount,
      results,
    });
  } catch (error) {
    console.error('❌ Error en cron de automatizaciones:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
