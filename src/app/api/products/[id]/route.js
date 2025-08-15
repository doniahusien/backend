import { promises as fs } from 'fs';
import path from 'path';
import cloudinary from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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


export async function POST(req) {
  try {
    const formData = await req.formData();
    const name = formData.get('name');
    const price = formData.get('price');
    const categoryId = formData.get('categoryId');
    const image = formData.get('image');

    console.log('Received product data:', { name, price, categoryId, image });

    // Handle image upload if present
    let imageUrl = null;
    if (image) {
      const result = await cloudinary.uploader.upload(image, {
        folder: 'products',
      });
      imageUrl = result.secure_url;  // Cloudinary URL of the uploaded image
      console.log('Uploaded image URL:', imageUrl);
    }

    // Read existing products data
    const file = await fs.readFile(dataFile, 'utf8');
    const json = JSON.parse(file);

    // Create new product object
    const newProduct = {
      id: `${Date.now()}`,  // Unique ID based on timestamp
      name,
      price,
      categoryId,
      images: imageUrl ? [imageUrl] : [],  // Add image URL if available
    };

    console.log('New product created:', newProduct);

    // Save new product to the JSON file
    json.products.push(newProduct);
    await fs.writeFile(dataFile, JSON.stringify(json, null, 2));

    return new Response(JSON.stringify({ product: newProduct }), {
      status: 200,
      headers: corsHeaders(),
    });
  } catch (error) {
    console.error('Error saving product:', error);  // Log the full error for debugging
    return new Response(JSON.stringify({ error: 'Failed to add product', details: error.message }), {
      status: 500,
      headers: corsHeaders(),
    });
  }
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
