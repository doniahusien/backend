import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // بريدك
        pass: process.env.GMAIL_PASS, // كلمة مرور التطبيق (App Password)
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
