import clientPromise from "../../../../lib/mongodb";

function setCorsHeaders(headers = {}) {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    ...headers,
  };
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: setCorsHeaders() });
}

// ✅ GET Cart
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  const client = await clientPromise;
  const db = client.db("shopDB");
  const cart = await db.collection("carts").findOne({ userId });

  return new Response(
    JSON.stringify({ carts: { [userId]: cart?.items || [] } }),
    { status: 200, headers: setCorsHeaders({ "Content-Type": "application/json" }) }
  );
}

// ✅ Add to Cart
export async function POST(request) {
  const { userId, product } = await request.json();

  if (!userId || !product?._id) {
    return new Response(
      JSON.stringify({ message: "❌ Missing userId or product._id" }),
      { status: 400, headers: setCorsHeaders({ "Content-Type": "application/json" }) }
    );
  }

  const client = await clientPromise;
  const db = client.db("shopDB");
  const carts = db.collection("carts");

  const productData = {
    _id: product._id,
    name: product.name,
    price: product.price,
    images: product.images || [],
    quantity: 1,
  };

  // ✅ Check if product already exists
  const existing = await carts.findOne({ userId, "items._id": product._id });

  if (existing) {
    // increase quantity if already in cart
    await carts.updateOne(
      { userId, "items._id": product._id },
      { $inc: { "items.$.quantity": 1 } }
    );
  } else {
    // push new product
    await carts.updateOne(
      { userId },
      { $push: { items: productData } },
      { upsert: true }
    );
  }

  return new Response(JSON.stringify({ message: "✅ Added to cart", item: productData }), {
    status: 200,
    headers: setCorsHeaders({ "Content-Type": "application/json" }),
  });
}


// ✅ Remove from Cart
export async function DELETE(request) {
  const { userId, productId } = await request.json();

  const client = await clientPromise;
  const db = client.db("shopDB");
  const carts = db.collection("carts");

  await carts.updateOne(
    { userId },
    { $pull: { items: { _id: productId } } }
  );

  return new Response(JSON.stringify({ message: "Item removed", productId }), {
    status: 200,
    headers: setCorsHeaders({ "Content-Type": "application/json" }),
  });
}

// ✅ Update Quantity
export async function PUT(request) {
  const { userId, productId, change } = await request.json();

  const client = await clientPromise;
  const db = client.db("shopDB");
  const carts = db.collection("carts");

  await carts.updateOne(
    { userId, "items._id": productId },
    { $inc: { "items.$.quantity": change } }
  );

  return new Response(JSON.stringify({ message: "Cart updated", productId, change }), {
    status: 200,
    headers: setCorsHeaders({ "Content-Type": "application/json" }),
  });
}
