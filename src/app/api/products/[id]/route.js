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

/**
 * DELETE → Remove product by ID
 */
export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    // Get current JSONBin data
    const current = await fetch(`${baseUrl}/latest`, {
      headers: { "X-Master-Key": API_KEY },
      cache: "no-store",
    }).then((r) => r.json());

    const json = current.record || { products: [] };
    const filtered = json.products.filter((p) => p.id !== id);

    if (filtered.length === json.products.length) {
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404,
        headers: corsHeaders(),
      });
    }

    json.products = filtered;

    // Save updated list
    await fetch(baseUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": API_KEY,
        "X-Bin-Versioning": "false",
      },
      body: JSON.stringify(json),
      cache: "no-store",
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: corsHeaders(),
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return new Response(
      JSON.stringify({ error: "Failed to delete product", details: error.message }),
      { status: 500, headers: corsHeaders() }
    );
  }
}
