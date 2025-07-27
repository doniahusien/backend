import { promises as fs } from 'fs';
import path from 'path';

// Get cart.json file path
const filePath = path.join(process.cwd(), 'public', 'cart.json');


async function readCartFile() {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { carts: {} }; 
    }
}

async function writeCartFile(cartData) {
    await fs.writeFile(filePath, JSON.stringify(cartData, null, 2));
}

export async function GET() {
    const cartData = await readCartFile();
    return new Response(JSON.stringify(cartData), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
    
}

export async function POST(request) {
    const { userId, product } = await request.json();
    const cartData = await readCartFile();

    if (!cartData.carts[userId]) {
        cartData.carts[userId] = [];
    }

    const existingItem = cartData.carts[userId].find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartData.carts[userId].push({ ...product, quantity: 1 });
    }

    await writeCartFile(cartData);

    return new Response(JSON.stringify({ message: "Added to cart" }), { status: 200 });
}


export async function DELETE(request) {
    const { userId, productId } = await request.json();
    const cartData = await readCartFile();

    if (cartData.carts[userId]) {
        cartData.carts[userId] = cartData.carts[userId].filter(item => item.id !== productId);
        await writeCartFile(cartData);
    }

    return new Response(JSON.stringify({ message: "Item removed from cart" }), { status: 200 });
}



export async function PUT(request) {
    const { userId, productId, change } = await request.json();
    const cartData = await readCartFile();

    if (cartData.carts[userId]) {
        const item = cartData.carts[userId].find(item => item.id === productId);
        if (item) {
            item.quantity += change;
        }
    }

    await writeCartFile(cartData);

    return new Response(JSON.stringify({ message: "Cart updated" }), { status: 200 });
}