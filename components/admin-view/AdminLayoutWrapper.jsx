"use client";

import React, { useEffect, useState } from "react";
import AdminSideBar from "@/components/admin-view/sidebar";
import AdminHeader from "@/components/admin-view/header";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const AdminLayoutWrapper = ({ children }) => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false); // Ensure hydration is complete
  const { isAdmin } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    setIsHydrated(true); // Mark as hydrated once the component mounts
  }, []);

  useEffect(() => {
    if (isHydrated && !isAdmin) {
      router.push("/shop");
    }
  }, [isHydrated, isAdmin, router]);

  // Show a blank state or loading spinner during hydration
  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* Admin sidebar */}
      <AdminSideBar open={openSidebar} setOpen={setOpenSidebar} />
      <div className="flex flex-1 flex-col">
        {/* Admin header */}
        <AdminHeader setOpen={setOpenSidebar} />
        <main className="flex-1 flex-col flex bg-muted/40 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayoutWrapper;
