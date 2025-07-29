import { promises as fs } from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

const filePath = path.join(process.cwd(), 'public', 'data', 'products.json');

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", 
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET(req) {
  try {
    const fileData = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileData);

    return new Response(JSON.stringify({
      products: data.products || [],
      categories: data.categories || [],
    }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to load data' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const name = formData.get('name');
    const price = formData.get('price');
    const categoryId = formData.get('categoryId');
    const imageFile = formData.get('image');

    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: 'products' }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }).end(buffer);
    });

    const imageUrl = uploadResult.secure_url;

    const fileData = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileData);

    const newProduct = {
      id: Date.now().toString(),
      name,
      price,
      categoryId,
      images: [imageUrl],
    };

    data.products.push(newProduct);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');

    return new Response(JSON.stringify({ message: 'Product added', product: newProduct }), {
      status: 201,
      headers: corsHeaders,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Failed to add product' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}
