"use client"
import { signupUser } from '@/redux/features/authSlice'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
const SignUpForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const { loading, error } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const handleEmail = (e) => setEmail(e.target.value);
    const handlePassword = (e) => setPassword(e.target.value);
    const handleName = (e) => setName(e.target.value);

   const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // نفذ الـ dispatch واستنى النتيجة
      await dispatch(signupUser({ email, password, name })).unwrap();

      // لو تم بنجاح
      toast.success("✅ تمت تسجيل الحساب", {
        duration: 2000,
        style: {
          background: "#4caf50",
          color: "#fff",
          fontSize: "16px",
          fontWeight: "bold",
        },
      });

      // بعد ثانيتين يحول للـ home
      setTimeout(() => {
        router.push("/");
      }, 2000);

    } catch (err) {
      toast.error("❌ فشل التسجيل", {
        duration: 2000,
        style: {
          background: "#f44336",
          color: "#fff",
          fontSize: "16px",
          fontWeight: "bold",
        },
      });
    }
  };
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-red-200 via-yellow-100 to-yellow-200">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-6 bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
            >
                <h2 className="text-2xl font-bold text-gray-800 text-center">إنشاء حساب</h2>

                <div>
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">البريد الإلكتروني</label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={handleEmail}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="أدخل بريدك الإلكتروني"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-gray-700 font-medium mb-2">كلمة المرور</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={handlePassword}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="أدخل كلمة المرور"
                    />
                </div>

                <div>
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">الاسم</label>
                    <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={handleName}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="أدخل اسمك"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full px-4 py-2 text-white font-semibold rounded ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-800'
                        }`}
                >
                    {loading ? 'جارٍ التسجيل...' : 'تسجيل'}
                </button>

                {error && <h1 className="text-red-500 text-center">{error}</h1>}
            </form>
        </div>
    )
}

export default SignUpForm
