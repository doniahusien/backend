import nodemailer from "nodemailer";

// ✅ إعداد CORS headers
function setCorsHeaders(res) {
  res.headers.set("Access-Control-Allow-Origin", "*"); // ممكن بدل * تحط دومين موقعك
  res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
}

// ✅ هندلر للـ OPTIONS (عشان preflight request)
export async function OPTIONS(req) {
  const res = new Response(null, { status: 204 });
  setCorsHeaders(res);
  return res;
}

// ✅ هندلر للـ POST
export async function POST(req) {
  const { name, email, message } = await req.json();

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: `New Contact Form Message from ${name}`,
      text: message,
      replyTo: email,
    });

    const res = new Response(
      JSON.stringify({ success: true, message: "Message sent successfully" }),
      { status: 200 }
    );
    setCorsHeaders(res);
    return res;
  } catch (error) {
    console.error(error);
    const res = new Response(
      JSON.stringify({ success: false, message: "Error sending message" }),
      { status: 500 }
    );
    setCorsHeaders(res);
    return res;
  }
}
