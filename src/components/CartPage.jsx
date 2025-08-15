"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeFromCart, updateCartQuantity } from "@/redux/features/cartSlice";
import Link from "next/link";
const CartPage = () => {
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.auth.user?.id);
    const cart = useSelector((state) => state.carts.carts?.[userId] || []);

    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");

    useEffect(() => {
        if (userId) {
            dispatch(fetchCart(userId));
        }
    }, [dispatch, userId]);

    const handleRemove = (productId) => {
        dispatch(removeFromCart({ userId, productId }));
    };

    const handleIncrease = (productId) => {
        dispatch(updateCartQuantity({ userId, productId, change: 1 }));
    };

    const handleDecrease = (productId, quantity) => {
        if (quantity > 1) {
            dispatch(updateCartQuantity({ userId, productId, change: -1 }));
        } else {
            handleRemove(productId);
        }
    };

    const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handleSubmitOrder = async () => {
        const order = {
            userId,
            name,
            address,
            phone,
            items: cart,
            total: totalPrice,
        };
    
        try {
            const response = await fetch("/api/order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(order),
            });
    
            const data = await response.json();
            if (response.ok) {
                alert("✅ تم تأكيد الطلب بنجاح!");
                setShowForm(false);
                setName("");
                setAddress("");
                setPhone("");
                // Optional: refresh cart in Redux
                dispatch(fetchCart(userId));
            } else {
                alert("❌ فشل في تأكيد الطلب");
            }
        } catch (error) {
            console.error("Error placing order:", error);
            alert("❌ حدث خطأ أثناء إرسال الطلب");
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-100 py-10" dir="rtl">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">سلة التسوق</h1>

            <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md">
                {Array.isArray(cart) && cart.length === 0 ? (
                    <p className="text-center text-gray-600 text-xl">سلتك فارغة.</p>
                ) : (
                    cart
                        .filter((item) => item)
                        .map((item) => (
                            <div key={item?.id || Math.random()} className="flex justify-between items-center border-b py-4">
                                <div className="flex items-center space-x-4">
                                    {item?.images?.length > 0 ? (
                                        <Image
                                            src={item.images[0]}
                                            alt={item?.name || "منتج"}
                                            width={80}
                                            height={80}
                                            className="rounded-lg"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 bg-gray-300 rounded-lg flex items-center justify-center">
                                            <span className="text-gray-500">لا توجد صورة</span>
                                        </div>
                                    )}
                                    <div>
                                        <h2 className="text-xl font-bold">{item?.name || "منتج بدون اسم"}</h2>
                                        <p className="text-gray-600">الكمية: {item?.quantity || 1}</p>
                                        <p className="text-gray-800 font-semibold">
                                            السعر: ${(item?.price || 0) * (item?.quantity || 1)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 space-x-reverse">
                                    <button
                                        onClick={() => handleDecrease(item?.id, item?.quantity)}
                                        className="bg-gray-300 text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-400"
                                    >
                                        -
                                    </button>
                                    <span className="text-xl">{item?.quantity || 1}</span>
                                    <button
                                        onClick={() => handleIncrease(item?.id)}
                                        className="bg-gray-300 text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-400"
                                    >
                                        +
                                    </button>
                                    <button
                                        onClick={() => handleRemove(item?.id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                                    >
                                        إزالة
                                    </button>
                                </div>
                            </div>
                        ))
                )}
                <Link href="/orders">Order summary</Link>
            </div>

            {cart.length > 0 && !showForm && (
                <div className="max-w-4xl mx-auto text-center mt-6">
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-xl font-semibold"
                    >
                        المتابعة للدفع
                    </button>
                </div>
            )}

            {showForm && (
                <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md mt-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">تفاصيل الطلب</h2>
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="الاسم"
                            className="w-full px-4 py-2 border rounded-lg"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="العنوان"
                            className="w-full px-4 py-2 border rounded-lg"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="رقم الهاتف"
                            className="w-full px-4 py-2 border rounded-lg"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                        <p className="text-xl font-semibold">الإجمالي: ${totalPrice.toFixed(2)}</p>
                        <button
                            onClick={handleSubmitOrder}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold"
                        >
                            تأكيد الطلب
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
