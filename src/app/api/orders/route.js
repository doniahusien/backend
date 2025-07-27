import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const ordersFile = path.join(process.cwd(), 'public', 'orders.json');

export async function GET() {
  try {
    const data = await fs.readFile(ordersFile, 'utf-8');
    const json = JSON.parse(data);
    return NextResponse.json(json.orders); // ⬅️ إرجاع مصفوفة الطلبات مباشرة
  } catch (err) {
    return NextResponse.json({ error: 'Failed to read orders' }, { status: 500 });
  }
}


export async function PUT(req, { params }) {
  const orderId = parseInt(params.id); // تأكد من التحويل إلى رقم
  const { status } = await req.json();

  try {
    const data = await fs.readFile(ordersFile, 'utf-8');
    const json = JSON.parse(data);
    const orders = json.orders;

    const index = orders.findIndex((order) => order.id === orderId);
    if (index === -1) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    orders[index].status = status;

    await fs.writeFile(ordersFile, JSON.stringify({ orders }, null, 2), 'utf-8');

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}