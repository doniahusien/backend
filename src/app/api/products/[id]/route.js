import cloudinary from "cloudinary";
import { ObjectId } from "mongodb";  
import clientPromise from "../../../../../lib/mongodb";

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

// CORS preflight
export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

// UPDATE product
export async function PUT(req, { params }) {
  try {
    const id = params.id;
    if (!ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: "Invalid product ID" }), {
        status: 400,
        headers: corsHeaders(),
      });
    }

    const client = await clientPromise;
    const db = client.db("shopDB");

    const formData = await req.formData();
    const name = formData.get("name");
    const price = formData.get("price");
    const categoryId = formData.get("categoryId");
    const image = formData.get("image");

    const updatedData = { 
      name, 
      price, 
      categoryId: String(categoryId) 
    };

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
      updatedData.images = [uploadResult.secure_url];
    }

    // First update
    const updateResult = await db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    );

    if (updateResult.matchedCount === 0) {
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404,
        headers: corsHeaders(),
      });
    }

    // Then fetch the updated product
    const updatedProduct = await db.collection("products").findOne({ _id: new ObjectId(id) });

    return new Response(JSON.stringify({ product: updatedProduct }), {
      status: 200,
      headers: corsHeaders(),
    });

  } catch (err) {
    console.error("PUT /products/:id error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders(),
    });
  }
}



// DELETE product
export async function DELETE(req, { params }) {
  try {
    const id = params.id; // this must be MongoDB _id
    const client = await clientPromise;
    const db = client.db("shopDB");

    const result = await db.collection("products").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0)
      return new Response(JSON.stringify({ error: "Product not found" }), { status: 404, headers: corsHeaders() });

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders() });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders() });
  }
}



export async function GET(req, { params }) {
  try {
    const id = params.id;
    const client = await clientPromise;
    const db = client.db("shopDB");

    const product = await db
      .collection("products")
      .findOne({ _id: new ObjectId(id) });

    if (!product)
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404,
        headers: corsHeaders(),
      });

    return new Response(JSON.stringify({ product }), {
      status: 200,
      headers: corsHeaders(),
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders(),
    });
  }
}