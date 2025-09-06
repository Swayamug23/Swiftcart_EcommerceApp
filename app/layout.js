import { Geist, Geist_Mono } from "next/font/google";

import Navbar from "@/components/Navbar";
import PageWrapper from "@/components/PageWrapper";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";
import { CartProvider } from "@/context/cartContext";
import Script from "next/script";
import { Poppins } from 'next/font/google'
import { Inter } from 'next/font/google'
import Page from "./Categories/page";

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // choose what you need
})



export const metadata = {
  title: {
    default: "SwiftKart Shop",
    template: "%s | SwiftKart Shop", // each page title will be inserted here
  },
  description: "A modern ecommerce website built with Next.js.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={inter.className + " min-h-screen"}>
        {/* Fixed background that covers the whole viewport */}
        <div className="fixed inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d5c5ff,transparent)]"></div>
        </div>
        
        <CartProvider>
          <SessionWrapper>
            <div className="w-[80vw] mx-auto">
              <Navbar />
              <PageWrapper>
              {children}
              </PageWrapper>
            </div>
          </SessionWrapper>
        </CartProvider>
        
      </body>
    </html>
  );
}