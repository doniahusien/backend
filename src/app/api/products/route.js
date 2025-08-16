import cloudinary from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// JSONBin Setup
const BIN_ID = process.env.JSONBIN_BIN_ID;
const API_KEY = process.env.JSONBIN_API_KEY;
const baseUrl = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

// Handle CORS preflight
export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

/**
 * GET → Fetch all products from JSONBin
 */
export async function GET() {
  try {
    const current = await fetch(`${baseUrl}/latest`, {
      headers: { "X-Master-Key": API_KEY },
      cache: "no-store",
    }).then((r) => r.json());

    const json = current.record || { products: [], categories: [] };

    return new Response(
      JSON.stringify({ products: json.products || [], categories: json.categories || [] }),
      { status: 200, headers: corsHeaders() }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch products",
        details: error.message,
      }),
      { status: 500, headers: corsHeaders() }
    );
  }
}


/**
 * POST → Add new product
 */
export async function POST(req) {
  try {
    const formData = await req.formData();
    const name = formData.get("name");
    const price = formData.get("price");
    const categoryId = formData.get("categoryId");
    const image = formData.get("image");

    console.log("Received product data:", { name, price, categoryId });

    let imageUrl = null;

    // Upload to Cloudinary if image exists
    if (image && typeof image === "object") {
      const buffer = Buffer.from(await image.arrayBuffer());
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "products" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(buffer);
      });

      imageUrl = uploadResult.secure_url;
      console.log("Image uploaded to Cloudinary:", imageUrl);
    }

    // Get current JSONBin data
    const current = await fetch(`${baseUrl}/latest`, {
      headers: { "X-Master-Key": API_KEY },
      cache: "no-store",
    }).then((r) => r.json());

    const json = current.record || { products: [] };

    const newProduct = {
      id: `${Date.now()}`,
      name,
      price,
      categoryId,
      images: imageUrl ? [imageUrl] : [],
    };

    json.products.push(newProduct);

    // Save back to JSONBin
    await fetch(baseUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": API_KEY,
        "X-Bin-Versioning": "false", // prevent multiple versions piling up
      },
      body: JSON.stringify(json),
      cache: "no-store",
    });

    return new Response(JSON.stringify({ product: newProduct }), {
      status: 200,
      headers: corsHeaders(),
    });
  } catch (error) {
    console.error("Error saving product:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to add product",
        details: error.message,
      }),
      { status: 500, headers: corsHeaders() }
    );
  }
}
