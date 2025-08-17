import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";

// Handle CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

// GET all orders from MongoDB
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("shopDB"); // change to your DB name
    const orders = await db.collection("orders").find({}).toArray();

    return NextResponse.json(orders, {
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      {
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  }
}
