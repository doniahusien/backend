import { promises as fs } from 'fs';
import path from 'path';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

const dataFile = path.join(process.cwd(), 'public', 'data', 'products.json');

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

export async function PUT(req, { params }) {
  const id = params.id;
  const formData = await req.formData();
  const name = formData.get('name');
  const price = formData.get('price');
  const categoryId = formData.get('categoryId');
  const image = formData.get('image');

  const buffer = image ? Buffer.from(await image.arrayBuffer()) : null;
  const imageName = image ? `${Date.now()}-${image.name}` : null;

  const file = await fs.readFile(dataFile, 'utf8');
  const json = JSON.parse(file);
  const index = json.products.findIndex(p => p.id === id);

  if (index === -1)
    return new Response(JSON.stringify({ error: 'Product not found' }), {
      status: 404,
      headers: corsHeaders(),
    });

  const updatedProduct = {
    ...json.products[index],
    name,
    price,
    categoryId,
  };

  if (imageName && buffer) {
    const uploadPath = path.join(process.cwd(), 'public', 'uploads', imageName);
    await fs.writeFile(uploadPath, buffer);
    updatedProduct.images = [imageName];
  }

  json.products[index] = updatedProduct;
  await fs.writeFile(dataFile, JSON.stringify(json, null, 2));

  return new Response(JSON.stringify({ product: updatedProduct }), {
    status: 200,
    headers: corsHeaders(),
  });
}

export async function DELETE(req, { params }) {
  const id = params.id;

  const file = await fs.readFile(dataFile, 'utf8');
  const json = JSON.parse(file);
  const filtered = json.products.filter(p => p.id !== id);

  if (filtered.length === json.products.length)
    return new Response(JSON.stringify({ error: 'Product not found' }), {
      status: 404,
      headers: corsHeaders(),
    });

  json.products = filtered;
  await fs.writeFile(dataFile, JSON.stringify(json, null, 2));

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: corsHeaders(),
  });
}