import clientPromise from "../../../../../../lib/mongodb";
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
        if (!ObjectId.isValid(params.id)) {
            return new Response(
                JSON.stringify({ error: "Invalid product ID" }),
                { status: 400, headers: corsHeaders() }
            );
        }

        const { highlight } = await req.json();
        if (typeof highlight !== "boolean") {
            return new Response(
                JSON.stringify({ error: "highlight must be boolean" }),
                { status: 400, headers: corsHeaders() }
            );
        }

        const client = await clientPromise;
        const db = client.db("shopDB");

        await db.collection("products").updateOne(
            { _id: new ObjectId(params.id) },
            { $set: { highlight } }
        );

        const updated = await db.collection("products").findOne(
            { _id: new ObjectId(params.id) },
            { projection: { _id: 1, name: 1, highlight: 1 } }
        );

        return new Response(JSON.stringify(updated), {
            status: 200,
            headers: corsHeaders(),
        });
    } catch (err) {
        console.error("Highlight toggle error:", err);
        return new Response(
            JSON.stringify({ error: "Failed to toggle highlight" }),
            { status: 500, headers: corsHeaders() }
        );
    }
}
