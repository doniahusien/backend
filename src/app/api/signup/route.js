import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, password, name } = await request.json();
    const filePath = path.join(process.cwd(), "public/users.json");

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "users.json not found" }, { status: 404 });
    }

    const fileData = fs.readFileSync(filePath, "utf-8");
    const users = JSON.parse(fileData);

    // Check if the user already exists
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    // Create new user object
    const newUser = {
      id: users.length + 1, // Simple way to generate an ID
      email,
      password,
      name,
    };

    // Add the new user to the users array
    users.push(newUser);

    // Write the updated users array back to the file
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

    return NextResponse.json(newUser, { status: 201 }); // Return the newly created user
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
