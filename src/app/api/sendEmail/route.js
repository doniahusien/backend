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

    return new NextResponse(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*", // السماح لكل المواقع (ممكن تحددي دومين معين)
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (error) {
    console.error("Email error:", error);
    return new NextResponse(
      JSON.stringify({ success: false }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}

// لازم تضيفي هاندلر للـ OPTIONS عشان الـ preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
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

    return new NextResponse(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*", // السماح لكل المواقع (ممكن تحددي دومين معين)
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (error) {
    console.error("Email error:", error);
    return new NextResponse(
      JSON.stringify({ success: false }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}

// لازم تضيفي هاندلر للـ OPTIONS عشان الـ preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
