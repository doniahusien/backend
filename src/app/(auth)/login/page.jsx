"use client"
import React from 'react'
import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/LoginForm'
const loginPage = () => {
          const user = useAuth();
    const router = useRouter();
      useEffect(() => {
        if (user) {
          router.push("/");
        }
      }, [user, router]);
    
    return (
        <div>
            <LoginForm />
        </div>
    )
}

export default loginPage