import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const ordersFile = path.join(process.cwd(), 'public', 'orders.json');

export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function PUT(req, { params }) {
  const orderId = parseInt(params.id);
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

    return NextResponse.json(
      { success: true },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to update order' },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
