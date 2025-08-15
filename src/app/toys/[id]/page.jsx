"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import { selectToys } from "@/redux/selectors/productSelectors";
import { addToCart } from "@/redux/features/cartSlice";

const ToyDetailsPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const toys = useSelector(selectToys);
    const userId = useSelector((state) => state.auth.user?.id);
    const toy = toys.find((t) => t.id === id);

    if (!toy) {
        return <p className="text-center text-red-600 text-2xl font-bold mt-10">اللعبة غير موجودة.</p>;
    }

    const handleAddToCart = () => {
        dispatch(addToCart({ userId, item: toy }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-yellow-50 to-blue-50 py-12 px-6" dir="rtl">
            <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-3xl p-8">
                <h1 className="text-5xl font-bold text-red-600 text-center mb-8">{toy.name}</h1>

                <div className="flex flex-col md:flex-row items-center justify-center gap-12">
                    {/* معرض الصور */} 
                    <div className="w-full md:w-1/2 grid grid-cols-1 gap-4">
                        {toy.images.map((img, index) => (
                            <Image
                                key={index}
                                src={img}
                                alt={`${toy.name} - ${index + 1}`}
                                width={800}
                                height={850}
                                className="w-full  h-52 rounded-2xl shadow-md hover:scale-105 transition-transform duration-300"
                            />
                        ))}
                    </div>

                    {/* تفاصيل اللعبة */}
                    <div className="w-full md:w-1/2 space-y-6 text-center md:text-right">
                        <p className="text-2xl font-semibold text-gray-800">
                            السعر: <span className="text-red-500">ج.م{toy.price}</span>
                        </p>
                        <p className="text-lg text-gray-600">
                            هذه لعبة رائعة للأطفال! استمتعوا بساعات من المرح والتعلم من خلال تجربة لعب تفاعلية ومسلية.
                        </p>
                        <button
                            onClick={handleAddToCart}
                            className="mt-6 w-full md:w-auto px-8 py-3 bg-red-500 text-white text-xl font-bold rounded-full shadow-lg hover:bg-red-600 transition-all duration-300"
                        >
                            أضف إلى السلة 🛒
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ToyDetailsPage;
