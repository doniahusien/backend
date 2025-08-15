import React from 'react'
import Link from 'next/link'

const Footer = () => {
    return (
        <footer className="bg-red-600 text-white py-8" dir="rtl">
            <div className="max-w-6xl mx-auto text-center">
                <p>&copy; 2025 متجر الأطفال. جميع الحقوق محفوظة.</p>
                <div className="mt-4">
                    <Link href="/about" className="text-black hover:underline mx-2">
                        من نحن
                    </Link>
                    <Link href="/contact" className="text-black hover:underline mx-2">
                        تواصل معنا
                    </Link>
                    <Link href="/privacy-policy" className="text-black hover:underline mx-2">
                        سياسة الخصوصية
                    </Link>
                </div>
            </div>
        </footer>
    )
}

export default Footer
