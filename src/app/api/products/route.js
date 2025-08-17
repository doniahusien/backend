import cloudinary from "cloudinary";
import clientPromise from "../../../../lib/mongodb";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
 * GET → Fetch all products + categories from shopDB
 */

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("shopDB");

    // Fetch products and categories
    const products = await db.collection("products").find({}).toArray();
    const categories = await db.collection("categories ").find({}).toArray();

    // Map products
    const productsMapped = products.map(p => ({
      ...p,
       _id: p._id.toString(),
      id: p._id.toString(),
      categoryId: p.categoryId?.toString() || null, // safeguard
    }));

    // Map categories
    const categoriesMapped = categories.map(c => ({
      _id: c._id.toString(),
      id: c.id ? String(c.id) : c._id.toString(), // fallback to _id
      name: c.name,
    }));

    return new Response(
      JSON.stringify({ products: productsMapped, categories: categoriesMapped }),
      { status: 200, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ products: [], categories: [] }),
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}

/**
 * POST → Add new product into shopDB
 */
export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db("shopDB");

    const formData = await req.formData();
    const name = formData.get("name");
    const price = formData.get("price");
    const categoryId = formData.get("categoryId");
    const image = formData.get("image");

    if (!name || !price || !categoryId) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: corsHeaders() });
    }

    let imageUrl = null;
    if (image && image.size > 0) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload_stream({ folder: "products" }, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }).end(buffer);
      });
      imageUrl = uploadResult.secure_url;
    }

    const newProduct = {
      name,
      price,
      categoryId: String(categoryId), // store as string
      images: imageUrl ? [imageUrl] : [],
      createdAt: new Date(),
    };

    const insertResult = await db.collection("products").insertOne(newProduct);

    return new Response(
      JSON.stringify({ product: { ...newProduct, id: insertResult.insertedId.toString() } }),
      { status: 200, headers: corsHeaders() }
    );
  } catch (err) {
    console.error("POST error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to add product", details: err.message }),
      { status: 500, headers: corsHeaders() }
    );
  }
}
