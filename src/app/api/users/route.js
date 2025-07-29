import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

// ✅ دعم preflight request (CORS)
export async function OPTIONS(request) {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    const filePath = path.join(process.cwd(), "public/users.json");

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "users.json not found" }, {
        status: 404,
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:3000",
        },
      });
    }

    const fileData = fs.readFileSync(filePath, "utf-8");
    const users = JSON.parse(fileData);

    const user = users.find((user) => user.email === email && user.password === password);

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, {
        status: 401,
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:3000",
        },
      });
    }

    return NextResponse.json(user, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
      },
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
      },
    });
  }
}
