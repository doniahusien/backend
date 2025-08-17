"use client";

 import toast from "react-hot-toast";
import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/redux/features/productSlice";
import { addToCart } from "@/redux/features/cartSlice";
import { selectToys } from "@/redux/selectors/productSelectors";
import { useAuth } from "@/hooks/useAuth";
const ToysPage = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const status = useSelector((state) => state.products?.status || "idle");
    const toys = useSelector(selectToys);
    const userId = useSelector((state) => state.auth.user?.id);

    useEffect(() => {
        if (status === "idle") {
            dispatch(fetchProducts());
        }
    }, [dispatch, status]);

const handleAddToCart = (toy, event) => {
  event.stopPropagation();
  dispatch(addToCart({ userId, item: toy }));
  toast.success("✅ تمت إضافة المنتج إلى السلة", {
    duration: 2000, // disappears after 2s
    style: {
      background: "#4caf50",
      color: "#fff",
      fontSize: "16px",
      fontWeight: "bold",
    },
  });
};

      const user = useAuth();
      useEffect(() => {
        if (!user) {
          router.push("/login");
        }
      }, [user, router]);
    
      if (!user) return null;
    return (
        <div className="min-h-screen bg-gradient-to-r from-yellow-100 to-blue-100 py-10" dir="rtl">
            <h1 className="text-5xl font-extrabold text-red-600 text-center mb-10">
                مجموعة ألعابنا
            </h1>

            {status === "loading" && (
                <p className="text-center text-gray-700 text-xl">جارٍ تحميل الألعاب...</p>
            )}

            {status === "succeeded" && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {toys.length === 0 ? (
                        <p className="text-center text-red-500 text-2xl">لا توجد ألعاب متاحة حاليًا.</p>
                    ) : (
                        toys.map((toy, index) => (

                            <div key={index} onClick={() => router.push(`/toys/${toy.id}`)} className="cursor-pointer bg-white shadow-md rounded-lg p-4">
                                <div className="h-56 rounded-md mb-4 flex items-center justify-center">
                                    {toy.images?.[0] ? (
                                        <Image
                                            src={
                                                toy.images[0]}
                                            alt={toy.name}
                                            width={200}
                                            height={150}
                                            className="w-full h-52 object-cover rounded-md"
                                        />
                                    ) : (
                                        <div className="w-full h-52 bg-gray-100 flex items-center justify-center text-gray-400 text-sm italic">
                                            لا توجد صورة
                                        </div>
                                    )}

                                </div>

                                <h2 className="text-2xl font-extrabold text-blue-700 mt-4 text-center">{toy.name}</h2>
                                <p className="text-lg font-semibold text-gray-600 text-center">ج.م{toy.price}</p>
                                <button
                                    onClick={(e) => handleAddToCart(toy, e)}
                                    className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-pink-400 to-yellow-400 text-white rounded-full shadow-md hover:from-pink-500 hover:to-yellow-500 hover:shadow-lg transition-all duration-300"                                    >
                                    أضف إلى السلة
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}

            {status === "failed" && (
                <p className="text-center text-red-700 text-2xl">فشل في تحميل الألعاب.</p>
            )}
        </div>
    );
};

export default ToysPage;
