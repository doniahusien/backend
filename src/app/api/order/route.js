import { promises as fs } from 'fs';
import path from 'path';

// Paths to JSON files
const ordersPath = path.join(process.cwd(), 'public', 'orders.json');
const cartPath = path.join(process.cwd(), 'public', 'cart.json');

// Utility: Read JSON file
async function readFile(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return filePath === ordersPath ? { orders: [] } : { carts: {} };
    }
}

// Utility: Write JSON file
async function writeFile(filePath, data) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// Handle CORS preflight requests
export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}

// Handle order creation
export async function POST(request) {
    const { userId, name, address, phone, items, total } = await request.json();

    // Read existing orders and cart
    const orderData = await readFile(ordersPath);
    const cartData = await readFile(cartPath);

    // Create new order
    const newOrder = {
        id: Date.now(),
        userId,
        name,
        address,
        phone,
        items,
        total,
        date: new Date().toISOString()
    };

    // Save new order
    orderData.orders.push(newOrder);
    await writeFile(ordersPath, orderData);

    // Clear user's cart
    if (cartData.carts[userId]) {
        cartData.carts[userId] = [];
        await writeFile(cartPath, cartData);
    }

    return new Response(JSON.stringify({ message: 'Order placed successfully', order: newOrder }), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
    });
}

// Handle fetching orders
export async function GET() {
    const orders = await readFile(ordersPath);
    return new Response(JSON.stringify(orders), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
    });
}
