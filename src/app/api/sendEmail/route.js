import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // ✅ إعداد هيدرز CORS
  res.setHeader("Access-Control-Allow-Origin", "*"); // تقدر تخليها "http://localhost:3000" أو الدومين الحقيقي بتاعك
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ التعامل مع Preflight (CORS check)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { name, email, message } = req.body;

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
      text: `
        الاسم: ${name}
        البريد: ${email}
        الرسالة: ${message}
      `,
      replyTo: email,
    });

    return res
      .status(200)
      .json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Email error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error sending message" });
  }
}
