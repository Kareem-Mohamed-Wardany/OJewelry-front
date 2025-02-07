"use client";
import { AlignJustify, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { setLogOut } from "@/store/auth-slice";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

function AdminHeader({ setOpen }) {
  const router = useRouter();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(setLogOut());
    toast.success("Logged out successfully!");
    router.push("/shop");
  }

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
      <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
        <AlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex flex-1 justify-end">
        <Button
          onClick={handleLogout}
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
        >
          <LogOut />
          Logout
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;
