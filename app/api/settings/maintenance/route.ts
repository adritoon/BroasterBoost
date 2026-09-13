import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

const SETTINGS_COLLECTION = 'settings';
const MAINTENANCE_DOC = 'maintenance';

function validateAdminKey(request: Request): boolean {
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey) return false;

  const url = new URL(request.url);
  const queryKey = url.searchParams.get('adminKey');
  const headerKey = request.headers.get('x-admin-key');
  
  return queryKey === adminKey || headerKey === adminKey;
}

interface MaintenanceConfig {
  subcategories: { type: string; service_type: string }[];
  categories: string[];
  updatedAt?: string;
}

/**
 * GET — Público (sin auth). 
 * Devuelve la config de mantenimiento actual desde Firestore.
 * Si no existe el documento, devuelve listas vacías.
 */
export async function GET() {
  try {
    const doc = await adminDb.collection(SETTINGS_COLLECTION).doc(MAINTENANCE_DOC).get();
    
    if (!doc.exists) {
      return NextResponse.json({
        success: true,
        subcategories: [],
        categories: [],
      });
    }

    const data = doc.data() as MaintenanceConfig;
    return NextResponse.json({
      success: true,
      subcategories: data.subcategories || [],
      categories: data.categories || [],
    });
  } catch (error) {
    console.error('Error fetching maintenance config:', error);
    return NextResponse.json({
      success: true,
      subcategories: [],
      categories: [],
    });
  }
}

/**
 * POST — Admin only.
 * Acciones:
 * - toggle_subcategory: Agrega/elimina una subcategoría de mantenimiento
 * - toggle_category: Agrega/elimina una categoría completa de mantenimiento
 */
export async function POST(request: Request) {
  if (!validateAdminKey(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action } = body;

    const docRef = adminDb.collection(SETTINGS_COLLECTION).doc(MAINTENANCE_DOC);
    const doc = await docRef.get();
    
    const currentConfig: MaintenanceConfig = doc.exists
      ? (doc.data() as MaintenanceConfig)
      : { subcategories: [], categories: [] };

    if (action === 'toggle_subcategory') {
      const { type, service_type } = body;
      if (!type || !service_type) {
        return NextResponse.json({ error: 'Missing type or service_type' }, { status: 400 });
      }

      const idx = currentConfig.subcategories.findIndex(
        s => s.type === type && s.service_type === service_type
      );

      if (idx >= 0) {
        // Remove — re-enable
        currentConfig.subcategories.splice(idx, 1);
      } else {
        // Add — disable (put in maintenance)
        currentConfig.subcategories.push({ type, service_type });
      }
    } else if (action === 'toggle_category') {
      const { categoryId } = body;
      if (!categoryId) {
        return NextResponse.json({ error: 'Missing categoryId' }, { status: 400 });
      }

      const idx = currentConfig.categories.indexOf(categoryId);
      if (idx >= 0) {
        // Remove — re-enable
        currentConfig.categories.splice(idx, 1);
      } else {
        // Add — disable
        currentConfig.categories.push(categoryId);
      }
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    currentConfig.updatedAt = new Date().toISOString();
    await docRef.set(currentConfig);

    return NextResponse.json({
      success: true,
      message: 'Configuración actualizada',
      subcategories: currentConfig.subcategories,
      categories: currentConfig.categories,
    });
  } catch (error) {
    console.error('Error updating maintenance config:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
