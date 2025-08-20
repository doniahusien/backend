import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Handle POST (send email)
export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: email,
      to: "donhus862003@gmail.com",
      subject: `رسالة جديدة من ${name}`,
      text: `
        الاسم: ${name}
        البريد: ${email}
        الرسالة: ${message}
      `,
    });

    return NextResponse.json(
      { success: true },
      {
        status: 200,
        headers: corsHeaders(),
      }
    );
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json(
      { success: false },
      {
        status: 500,
        headers: corsHeaders(),
      }
    );
  }
}

// Handle OPTIONS (CORS preflight)
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders() });
}

// helper function
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*", // or "http://localhost:3000" if you want restrict
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}
