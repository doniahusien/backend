"use client"
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export function useAuth() {
  const user = useSelector((state) => state.auth.user);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login"); 
    }
    
  }, [user, router]);

  return user;
}
