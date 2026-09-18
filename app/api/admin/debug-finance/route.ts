import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export async function GET(request: Request) {
  const snapshot = await adminDb.collection('orders').where('status', '==', 'completed').get();
  const allDocs = snapshot.docs;
  
  const target = allDocs.find(d => {
    const data = d.data();
    return data.items && data.items.some((i: any) => i.name && i.name.includes('100 Viewers (1 Hora)'));
  });

  if (!target) return NextResponse.json({ error: 'Not found' });

  return NextResponse.json({
    id: target.id,
    items: target.data().items
  });
}
