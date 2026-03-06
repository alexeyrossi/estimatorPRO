import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "GetMuveo — Smart Moving Estimator",
  description: "Get an instant, accurate moving estimate with Muveo's AI-powered calculator. Plan your move easily and securely.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-[100dvh] bg-[#FAFAFA] text-gray-900 antialiased overscroll-none">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
