"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Provider } from "react-redux";
import store from "@/redux/store";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen ">
        <Provider store={store}>
          <NavBar />
          
          <main className="flex-grow">
            {children}
          </main>
          
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
