'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch('https://backend-chi-sepia.vercel.app/api/orders');
                const data = await res.json();

                console.log('Fetched orders:', data);
                setOrders(data);
            } catch (err) {
                console.error('Failed to fetch orders:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);



    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const res = await fetch(`https://backend-chi-sepia.vercel.app/api/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                setOrders((prev) =>
                    prev.map((order) =>
                        order.id === orderId ? { ...order, status: newStatus } : order
                    )
                );
            } else {
                console.error('Failed to update status');
            }
        } catch (err) {
            console.error('Error updating status:', err);
        }
    };

    if (loading) return <div className="p-4">Loading orders...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">إدارة الطلبات</h1>
            <table className="w-full border text-sm">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="border p-2">رقم الطلب</th>
                        <th className="border p-2">المستخدم</th>
                        <th className="border p-2">العناصر</th>
                        <th className="border p-2">المجموع</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id} className="border-b">
                            <td className="border p-2">{order.id}</td>
                            <td className="border p-2">{order.name || 'غير معروف'}</td>
                            <td className="border p-2">
                                {Array.isArray(order.items) && order.items.length > 0 ? (
                                    <ul className="list-disc pl-4">
                                        {order.items.map((item, i) => (
                                            <li key={i}>
                                                <div className="flex items-center justify-between gap-2">
                                                    {item.name} × {item.quantity}
                                                    <Image
                                                        src={item.images[0] || '/no-image.png'} 
                                                        alt={item.name}
                                                        width={48}
                                                        height={48}
                                                        className="w-28 h-28 object-cover border rounded"
                                                    />
                                                </div>

                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <span>لا يوجد عناصر</span>
                                )}
                            </td>
                            <td className="border p-2">{order.total || 0} ج</td>
                          
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
