import { promises as fs } from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'public', 'data', 'products.json');

// Helper to return CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// OPTIONS - Handle preflight CORS request
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// GET - Return products and categories
export async function GET(req) {
  try {
    const fileData = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileData);

    return new Response(JSON.stringify({
      products: data.products || [],
      categories: data.categories || [],
    }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to load data' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

// POST - Add product
export async function POST(req) {
  try {
    const formData = await req.formData();
    const name = formData.get('name');
    const price = formData.get('price');
    const categoryId = formData.get('categoryId');
    const imageFile = formData.get('image');

    const fileData = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileData);

    const newProduct = {
      id: Date.now().toString(),
      name,
      price,
      categoryId,
      images: [`/pics/${imageFile.name}`],
    };

    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadPath = path.join(process.cwd(), 'public', 'pics', imageFile.name);
    await fs.writeFile(uploadPath, buffer);

    data.products.push(newProduct);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');

    return new Response(JSON.stringify({ message: 'Product added', product: newProduct }), {
      status: 201,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Failed to add product' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}
