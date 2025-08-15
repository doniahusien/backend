"use client"
import React from 'react';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
export default function AboutPage() {

    
    return (
        <div className="min-h-screen bg-red-50 p-8" dir="rtl">
            <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-10">
                <h1 className="text-4xl font-extrabold text-red-600 mb-6">من نحن</h1>
                <p className="text-gray-800 text-lg leading-relaxed">
                    مرحبًا بكم في متجر الأطفال الخاص بنا! نحن شغوفون بتوفير تجربة تسوق ممتعة ومميزة للعائلات. هدفنا هو تقديم منتجات عالية الجودة تجلب الفرح والراحة والإبداع لأطفالكم الصغار.
                </p>
                <p className="text-gray-800 text-lg leading-relaxed mt-6">
                    سواء كنتم تبحثون عن ملابس عصرية، ألعاب تعليمية، أو مستلزمات يومية، نحن هنا لتلبية احتياجاتكم. مجموعاتنا مختارة بعناية لضمان أعلى معايير السلامة والأناقة والمتانة.
                </p>
                <p className="text-gray-800 text-lg leading-relaxed mt-6">
                    شكرًا لاختياركم لنا كشريك في رحلة عائلتكم. نتطلع إلى مساعدتكم في صنع لحظات لا تُنسى مع أطفالكم.
                </p>
                <div className="mt-10 bg-red-100 p-6 rounded-lg">
                    <h2 className="text-2xl font-bold text-red-600">قيمنا الأساسية</h2>
                    <ul className="mt-4 space-y-2 text-gray-800 text-lg list-inside list-disc">
                        <li>✨ <strong>الجودة:</strong> تقديم الأفضل لأطفالكم.</li>
                        <li>🚀 <strong>الابتكار:</strong> تحويل الأفكار الجديدة إلى واقع.</li>
                        <li>🤝 <strong>رضا العملاء:</strong> رضاكم هو أولويتنا.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
