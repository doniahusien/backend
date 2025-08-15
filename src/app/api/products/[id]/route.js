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

export default async function handler(req, res) {
  const BIN_ID = process.env.JSONBIN_BIN_ID;
  const API_KEY = process.env.JSONBIN_API_KEY;
  const baseUrl = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders()).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      // Fetch data from JSONBin
      const r = await fetch(`${baseUrl}/latest`, {
        headers: { 'X-Master-Key': API_KEY },
      });
      const data = await r.json();
      res.status(200).json(data.record);
    }

    else if (req.method === 'POST') {
      const formData = await new Promise((resolve, reject) => {
        const busboy = require('busboy')({ headers: req.headers });
        const fields = {};
        const files = {};

        busboy.on('field', (name, value) => {
          fields[name] = value;
        });

        busboy.on('file', (name, file, info) => {
          const chunks = [];
          file.on('data', chunk => chunks.push(chunk));
          file.on('end', () => {
            files[name] = Buffer.concat(chunks);
          });
        });

        busboy.on('finish', () => resolve({ fields, files }));
        busboy.on('error', reject);

        req.pipe(busboy);
      });

      const { name, price, categoryId } = formData.fields;
      let imageUrl = null;

      if (formData.files.image) {
        const uploaded = await cloudinary.uploader.upload_stream(
          { folder: 'products' },
          (error, result) => {
            if (error) throw error;
            imageUrl = result.secure_url;
          }
        );
        await new Promise((resolve, reject) => {
          uploaded.end(formData.files.image);
          uploaded.on('finish', resolve);
          uploaded.on('error', reject);
        });
      }

      // Get current products
      const current = await fetch(`${baseUrl}/latest`, {
        headers: { 'X-Master-Key': API_KEY },
      }).then(r => r.json());

      const json = current.record || { products: [] };

      // Add new product
      const newProduct = {
        id: `${Date.now()}`,
        name,
        price,
        categoryId,
        images: imageUrl ? [imageUrl] : [],
      };

      json.products.push(newProduct);

      // Save back to JSONBin
      await fetch(`${baseUrl}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': API_KEY,
        },
        body: JSON.stringify(json),
      });

      res.status(200).json({ product: newProduct });
    }

    else if (req.method === 'DELETE') {
      const { id } = req.query;

      const current = await fetch(`${baseUrl}/latest`, {
        headers: { 'X-Master-Key': API_KEY },
      }).then(r => r.json());

      const json = current.record || { products: [] };
      json.products = json.products.filter(p => p.id !== id);

      await fetch(`${baseUrl}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': API_KEY,
        },
        body: JSON.stringify(json),
      });

      res.status(200).json({ success: true });
    }

    else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
