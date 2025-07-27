import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    const filePath = path.join(process.cwd(), "public/users.json");

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "users.json not found" }, { status: 404 });
    }

    const fileData = fs.readFileSync(filePath, "utf-8");
    const users = JSON.parse(fileData);

    
    const user = users.find((user) => user.email === email && user.password === password);

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    return NextResponse.json(user); 
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
