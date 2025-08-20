import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // ✅ Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*"); // or specific domain e.g. "https://kido-gray.vercel.app"
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  const { name, email, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER, // 👈 لازم يكون إيميلك نفسه
      to: process.env.GMAIL_USER,   // 👈 الرسالة توصلك إنت
      subject: `New Contact Form Message from ${name}`,
      text: message,
      replyTo: email, // 👈 إيميل الشخص اللي بعت الفورم
    });

    res.status(200).json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error sending message" });
  }
}
