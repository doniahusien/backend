"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/redux/features/authSlice";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { error, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-red-200 via-yellow-100 to-yellow-200">
      <form
        onSubmit={handleSubmit}
        dir="rtl"
        className="flex flex-col gap-6 bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-red-600 text-center">
          تسجيل الدخول
        </h2>

        <div>
          <label
            htmlFor="email"
            className="block text-gray-700 font-medium mb-2"
          >
            البريد الإلكتروني
          </label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleEmail}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="أدخل بريدك الإلكتروني"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-gray-700 font-medium mb-2"
          >
            كلمة المرور
          </label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handlePassword}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="أدخل كلمة المرور"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-2 text-white font-semibold rounded-lg ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-yellow-400 hover:bg-yellow-500"
          }`}
        >
          {loading ? "جاري التحميل..." : "تسجيل الدخول"}
        </button>

        {error && (
          <h1 className="text-red-500 text-center mt-4 font-semibold">
            {error}
          </h1>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
