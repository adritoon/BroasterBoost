import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { PRODUCTS, getInterpolatedPrice, ProductType, ServiceType, CUSTOM_QTY_ELIGIBLE, getCustomCommentPrice } from '@/lib/products';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, isCustomPack = false, platform } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No hay items en la orden" }, { status: 400 });
    }

    let subtotal = 0;
    const orderItems: any[] = [];

    // Calculate real price on server
    for (const item of items) {
      if (item.type === 'standard') {
        const product = PRODUCTS.find(p => p.id === item.productId);
        if (!product || product.status === 'out_of_stock' || product.status === 'maintenance') {
          return NextResponse.json({ error: `Producto ${item.productId} no disponible` }, { status: 400 });
        }
        subtotal += product.price;
        orderItems.push({
          serviceId: product.provider_id,
          quantity: product.provider_quantity,
          link: item.link,
          price: product.price,
          name: product.name,
          productId: product.id
        });
      } else if (item.type === 'custom_quantity') {
        if (!CUSTOM_QTY_ELIGIBLE.includes(item.service as ServiceType)) {
          return NextResponse.json({ error: `Servicio ${item.service} no elegible para cantidad custom` }, { status: 400 });
        }
        const tierProducts = PRODUCTS.filter(p =>
          p.type === item.platform &&
          p.service_type === item.service &&
          !p.isCustomQuantity &&
          p.status !== 'out_of_stock' &&
          p.status !== 'maintenance'
        ).sort((a, b) => a.provider_quantity - b.provider_quantity);

        if (tierProducts.length === 0) {
           return NextResponse.json({ error: `No se encontraron tiers para ${item.platform} ${item.service}` }, { status: 400 });
        }

        const { total, nearestTier } = getInterpolatedPrice(tierProducts, item.quantity);

        if (!nearestTier) {
           return NextResponse.json({ error: `Error al calcular precio para ${item.platform} ${item.service}` }, { status: 400 });
        }

        subtotal += total;
        orderItems.push({
          serviceId: nearestTier.provider_id,
          quantity: item.quantity,
          link: item.link,
          price: total,
          name: `${item.quantity.toLocaleString()} ${item.service} personalizados`
        });
      } else if (item.type === 'custom_comments') {
         const { total } = getCustomCommentPrice(item.quantity);
         const product = PRODUCTS.find(p => p.id === item.productId);
         if (!product) return NextResponse.json({ error: `Producto de comentarios no encontrado` }, { status: 400 });
         
         subtotal += total;
         orderItems.push({
           serviceId: product.provider_id,
           quantity: item.quantity,
           link: item.link,
           price: total,
           comments: item.comments,
           name: `${item.quantity.toLocaleString()} Comentarios Personalizados`,
           productId: product.id
         });
      }
    }

    // Apply custom pack discount if multiple items (must match frontend logic)
    let totalPEN = subtotal;
    let appliedDiscount = 0;
    if (isCustomPack && orderItems.length >= 2) {
      appliedDiscount = subtotal * 0.05; // 5% discount
      totalPEN = subtotal - appliedDiscount;
    }

    // Generar un ID ordenado cronológicamente (SB-timestamp-random)
    const timestamp = Date.now().toString();
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderId = `SB-${timestamp}-${randomStr}`;

    // Save to Firestore
    const ordersRef = adminDb.collection('orders');
    await ordersRef.doc(orderId).set({
      items: orderItems,
      subtotalPEN: subtotal,
      discountPEN: appliedDiscount,
      totalPEN: totalPEN,
      status: 'pending',
      createdAt: FieldValue.serverTimestamp(),
      platform: platform || 'mixed',
      isCustomPack
    });

    return NextResponse.json({ success: true, orderId: orderId, totalPEN });

  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
