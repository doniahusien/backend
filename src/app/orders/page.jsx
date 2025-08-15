"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
export default function OrderSummaryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.auth.user?.id);
      const user = useAuth();
    const router = useRouter();
      useEffect(() => {
        if (!user) {
          router.push("/login");
        }
      }, [user, router]);
    
      if (!user) return null;
  useEffect(() => {
    if (!userId) return;

    const fetchOrders = async () => {
        try {
          const res = await fetch("https://backend-chi-sepia.vercel.app/api/order");
          
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
      
          const data = await res.json();
          const userOrders = data.orders.filter(order => order.userId === userId);
          setOrders(userOrders.reverse());
        } catch (err) {
          console.error("Failed to fetch orders:", err);
        } finally {
          setLoading(false);
        }
      };
      

    fetchOrders();
  }, [userId]);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-6 text-green-600">📦 ملخص الطلبات</h1>

      {loading ? (
        <p className="text-gray-500">جارٍ تحميل الطلبات...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-600">لا توجد طلبات حالياً.</p>
      ) : (
        orders.map(order => (
          <div key={order.id} className="border border-gray-300 rounded-lg p-4 mb-6 shadow-sm">
            <div className="mb-2"><strong>الاسم:</strong> {order.name}</div>
            <div className="mb-2"><strong>العنوان:</strong> {order.address}</div>
            <div className="mb-2"><strong>رقم الهاتف:</strong> {order.phone}</div>
            <div className="mb-2">
              <strong>إجمالي السعر:</strong> {order.total.toLocaleString("ar-EG")} جنيه
            </div>
            <div className="mb-4">
              <strong>تاريخ الطلب:</strong> {new Date(order.date).toLocaleString("ar-EG")}
            </div>
            <div>
              <strong>المنتجات:</strong>
              <ul className="mt-2 list-disc list-inside">
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.name} - {item.quantity} × {item.price} = {(item.quantity * item.price).toLocaleString("ar-EG")} جنيه
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
