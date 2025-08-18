"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import toast from "react-hot-toast";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/redux/features/productSlice";
import { selectToys } from "@/redux/selectors/productSelectors";
import { addToCart } from "@/redux/features/cartSlice";
const HomePage = () => {
  const user = useAuth();
  const router = useRouter();

  const dispatch = useDispatch();
  const status = useSelector((state) => state.products?.status || "idle");
  const toys = useSelector(selectToys);
   const userId = useSelector((state) => state.auth.user?._id);
      const handleAddToCart = (toy, event) => {
          event.stopPropagation();
        dispatch(addToCart({ userId, item: toy }));
         toast.success("✅ تمت إضافة المنتج إلى السلة", {
    duration: 2000, 
    style: {
      background: "#4caf50",
      color: "#fff",
      fontSize: "16px",
      fontWeight: "bold",
    },
  });
      };
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <>
     <Head>
        <title>Kiddo Kingdom | صفحة ألعاب الأطفال</title>
        <meta name="description" content="Kiddo Kingdom - أفضل مكان لألعاب الأطفال. اكتشف مجموعتنا من الألعاب الممتعة التي تساعد على التعلم والمرح." />
        <meta name="keywords" content="ألعاب أطفال, Kiddo Kingdom, تسلية, تعليم, لعب, أطفال" />
        <meta name="author" content="Kiddo Kingdom" />
        
        {/* For Social Sharing (Open Graph) */}
        <meta property="og:title" content="Kiddo Kingdom | صفحة ألعاب الأطفال" />
        <meta property="og:description" content="Kiddo Kingdom - أفضل مكان لألعاب الأطفال." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/kiddo-banner.jpg" /> {/* ضع صورة من موقعك */}

        {/* For Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Kiddo Kingdom | صفحة ألعاب الأطفال" />
        <meta name="twitter:description" content="Kiddo Kingdom - أفضل مكان لألعاب الأطفال." />

        {/* Language */}
        <meta httpEquiv="Content-Language" content="ar" />
      </Head>
        <main dir="rtl" className="w-full min-h-screen bg-gradient-to-r from-red-200 via-yellow-100 to-yellow-200">
      {/* بانر الترحيب */}
      <section className="relative w-full h-[400px] bg-[url('/ban.png')] bg-cover bg-center text-white flex items-center justify-center text-center">
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative p-8 z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 animate-bounce">مرحبًا بعودتك، {user.name}!</h1>
          <p className="text-lg md:text-xl">استكشف مجموعتنا الحصرية لأطفالك.</p>
        </div>
      </section>

      {/* قسم الخدمات */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {[
            { title: "شحن مجاني", desc: "على جميع الطلبات التي تتجاوز 50 دولارًا" },
            { title: "دعم 24/7", desc: "نحن هنا لمساعدتك في أي وقت" },
            { title: "إرجاع سهل", desc: "إرجاع بدون متاعب خلال 30 يومًا" },
          ].map((service, index) => (
            <div key={index} className="p-6 bg-gray-100 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* المنتجات المميزة */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-8">منتجاتنا المميزة</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {toys.slice(0, 12).map((toy, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-4">
              <div className="h-56 rounded-md mb-4 flex items-center justify-center">
                <Image src={toy.images[0]} alt={toy.name} width={200} height={150} className="w-full h-auto" />
              </div>
              <h3 className="text-lg font-semibold">{toy.name}</h3>
              <p className="text-sm text-gray-600">ج.م{toy.price}</p>
              <button  onClick={(e) => handleAddToCart(toy, e)} className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-pink-400 to-yellow-400 text-white rounded-full shadow-md hover:from-pink-500 hover:to-yellow-500 hover:shadow-lg transition-all duration-300">
                أضف إلى السلة
              </button>
            </div>
          ))}
        </div>
      </section>
    </main> </>
 
  );
};

export default HomePage;
