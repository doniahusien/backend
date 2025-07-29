import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, password, name } = await request.json();
    const filePath = path.join(process.cwd(), "public/users.json");

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: "users.json not found" },
        {
          status: 404,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        }
      );
    }

    const fileData = fs.readFileSync(filePath, "utf-8");
    const users = JSON.parse(fileData);

    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        {
          status: 409,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        }
      );
    }

    const newUser = {
      id: users.length + 1,
      email,
      password,
      name,
    };

    users.push(newUser);
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

    return NextResponse.json(newUser, {
      status: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server error" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  }
}
