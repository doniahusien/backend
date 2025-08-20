import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function PUT(req, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db("shopDB");

    const { highlight } = await req.json();

    await db.collection("products").updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { highlight: !!highlight } }
    );

    return new Response(
      JSON.stringify({ success: true, id: params.id, highlight }),
      { status: 200, headers: corsHeaders() }
    );
  } catch (err) {
    console.error("Highlight toggle error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to toggle highlight" }),
      { status: 500, headers: corsHeaders() } // ✅ add headers here too
    );
  }
}
