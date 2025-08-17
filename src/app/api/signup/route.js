import clientPromise from "../../../../lib/mongodb";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function POST(request) {
  try {
    const { email, password, name } = await request.json();

    const client = await clientPromise;
    const db = client.db("shopDB");

    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409, headers: corsHeaders }
      );
    }

    const newUser = { email, password, name };
    const result = await db.collection("users").insertOne(newUser);

    return NextResponse.json(
      { ...newUser, _id: result.insertedId },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
