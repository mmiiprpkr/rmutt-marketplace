"use client";

import { Navbar } from "@/components/common/navbar";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen max-w-7xl mx-auto">
      <Navbar />
      {children}
    </div>
  );
};

export default HomeLayout;