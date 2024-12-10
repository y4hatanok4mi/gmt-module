"use client";

import Footer from "@/components/layout/footer";
import TopBar from "@/components/layout/topbar";


export default function StudentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* TopBar */}
      <TopBar />

      {/* Main Content */}
      <main className="flex-grow w-full bg-gray-100">
        {children}
      </main>

      <Footer />      
    </div>
  );
}
