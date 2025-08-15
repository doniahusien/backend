"use client"
import React from 'react'
import SignUpForm from '@/components/SignUpForm'
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
const signupPage = () => {
         const user = useAuth();
    const router = useRouter();
      useEffect(() => {
        if (user) {
          router.push("/");
        }
      }, [user, router]);
    
  return (
    <div><SignUpForm /></div>
  )
}

export default signupPage