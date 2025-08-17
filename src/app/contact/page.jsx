"use client";
import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("⏳ جاري الإرسال...");

    try {
      const res = await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("✅ تم إرسال رسالتك بنجاح");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("❌ فشل الإرسال، حاول مرة أخرى");
      }
    } catch (error) {
      setStatus("⚠️ حدث خطأ، تحقق من الاتصال");
    }
  };

  return (
    <div className="min-h-screen bg-red-50 p-8" dir="rtl">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-10">
        <h1 className="text-4xl font-extrabold text-red-600 mb-6">تواصل معنا</h1>
        <p className="text-gray-800 text-lg leading-relaxed">
          هل لديك أسئلة أو تحتاج إلى مساعدة؟ لا تتردد في التواصل معنا، وسنرد عليك في أقرب وقت ممكن.
        </p>

        {/* قسم معلومات التواصل */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          <div className="bg-red-100 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-red-600 mb-2">📧 البريد الإلكتروني</h2>
            <p className="text-gray-800">Kiddo.Kingdom.Store@gmail.com</p>
          </div>
          <div className="bg-red-100 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-red-600 mb-2">📞 الهاتف</h2>
                      <p className="text-gray-800" dir="ltr">
                          01559840993
            </p>
          </div>
          <div className="bg-red-100 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-red-600 mb-2">🏢 العنوان</h2>
            <p className="text-gray-800">عبدالسلام عارف</p>
          </div>
        </div>

        {/* نموذج التواصل */}
        <div className="mt-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">الاسم الكامل</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder="اكتب اسمك الكامل"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">البريد الإلكتروني</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder="اكتب بريدك الإلكتروني"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">رسالتك</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                rows="5"
                placeholder="اكتب رسالتك هنا..."
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition"
            >
              إرسال
            </button>
          </form>

          {status && (
            <p className="mt-4 text-center text-gray-700 font-semibold">{status}</p>
          )}
        </div>
      </div>
    </div>
  );
}
