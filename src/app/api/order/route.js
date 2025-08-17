import clientPromise from "../../../../lib/mongodb";

function setCorsHeaders(headers = {}) {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    ...headers,
  };
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: setCorsHeaders() });
}

// ✅ Place Order
export async function POST(request) {
  try {
    const { userId, name, address, phone, items, total } = await request.json();

    if (!userId || !items?.length) {
      return new Response(
        JSON.stringify({ message: "❌ Missing required fields" }),
        { status: 400, headers: setCorsHeaders({ "Content-Type": "application/json" }) }
      );
    }

    const client = await clientPromise;
    const db = client.db("shopDB");

    // Create order object
    const newOrder = {
      userId,
      name,
      address,
      phone,
      items,
      total,
      date: new Date(),
    };

    // Save to MongoDB
    const result = await db.collection("orders").insertOne(newOrder);

    // ✅ Clear user's cart after checkout
    await db.collection("carts").updateOne(
      { userId },
      { $set: { items: [] } }
    );

    return new Response(
      JSON.stringify({ message: "✅ Order placed", order: { ...newOrder, _id: result.insertedId } }),
      { status: 200, headers: setCorsHeaders({ "Content-Type": "application/json" }) }
    );
  } catch (error) {
    console.error("❌ Order POST error:", error);
    return new Response(
      JSON.stringify({ message: "❌ Failed to place order" }),
      { status: 500, headers: setCorsHeaders({ "Content-Type": "application/json" }) }
    );
  }
}

// ✅ Fetch Orders
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const client = await clientPromise;
    const db = client.db("shopDB");

    let query = {};
    if (userId) query.userId = userId;

    const orders = await db.collection("orders").find(query).sort({ date: -1 }).toArray();

    return new Response(
      JSON.stringify({ orders }),
      { status: 200, headers: setCorsHeaders({ "Content-Type": "application/json" }) }
    );
  } catch (error) {
    console.error("❌ Order GET error:", error);
    return new Response(
      JSON.stringify({ message: "❌ Failed to fetch orders" }),
      { status: 500, headers: setCorsHeaders({ "Content-Type": "application/json" }) }
    );
  }
}
