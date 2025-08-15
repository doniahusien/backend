"use client"
import React from 'react'
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import CartPage from '@/components/CartPage'
const cartPage = () => {
          const user = useAuth();
        const router = useRouter();
          useEffect(() => {
            if (!user) {
              router.push("/login");
            }
          }, [user, router]);
        
          if (!user) return null;
    return (
        <div>
            <CartPage />
        </div>
    )
}

export default cartPage