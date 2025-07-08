"use client";
import { LogOut, Menu, UserCog } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { setLogOut } from "@/store/auth-slice";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";
import Image from "next/image";
import { setUser } from "@/store/auth-slice/index"; // Add this import if applicable
import { toast } from "react-toastify";
import CartHeader from "./CartHeader";
import UserHeader from "./UserHeader";

function ShoppingHeader() {
  const { user, isAdmin } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const dispatch = useDispatch();
  const navigate = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    const expiryDate = localStorage.getItem("expiryDate");

    if (
      storedUser &&
      token &&
      expiryDate &&
      new Date(expiryDate) > new Date()
    ) {
      dispatch(setUser({ user: storedUser, token, expiryDate }));
    } else {
      dispatch(setLogOut());
    }
  }, [dispatch]);

  useEffect(() => {
    if (user) dispatch(fetchCartItems(user.id));
  }, [dispatch, user]);

  const handleNavigate = (menuItem) => {
    sessionStorage.removeItem("filters");
    const currentFilter = ["home", "products", "search"].includes(menuItem.id)
      ? null
      : { category: [menuItem.id] };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    location.pathname.includes("products") && currentFilter !== null
      ? setSearchParams(new URLSearchParams(`?category=${menuItem.id}`))
      : navigate.push(menuItem.path);
  };

  const handleLogout = () => {
    dispatch(setLogOut());
    toast.success("Logged out successfully!");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-primary">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="font-bold text-secondary hover:text-blue-600 transition-colors">
            Jewellery Store
          </span>
        </Link>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs">
            <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
              {shoppingViewHeaderMenuItems.map((menuItem) => (
                <Label
                  onClick={() => handleNavigate(menuItem)}
                  className="text-sm font-medium cursor-pointer hover:text-blue-600 hover:border-b-2 border-blue-600 transition-all"
                  key={menuItem.id}
                >
                  {menuItem.label}
                </Label>
              ))}
            </nav>
            {user && (
              <div className="flex lg:items-center lg:flex-row flex-col gap-4">
                {!isAdmin && (
                  <CartHeader
                    cartItems={cartItems}
                    setOpenCartSheet={setOpenCartSheet}
                    openCartSheet={openCartSheet}
                  />
                )}

                <UserHeader
                  user={user}
                  isAdmin={isAdmin}
                  navigate={navigate}
                  handleLogout={handleLogout}
                />
              </div>
            )}
          </SheetContent>
        </Sheet>

        {/* Desktop Menu */}
        <div className="hidden lg:flex lg:items-center gap-6 bg-primary">
          <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
            {shoppingViewHeaderMenuItems.map((menuItem) => (
              <Label
                onClick={() => handleNavigate(menuItem)}
                className="text-lg font-bold cursor-pointer text-secondary hover:text-blue-600 hover:border-b-2 border-blue-600 transition-all"
                key={menuItem.id}
              >
                {menuItem.label}
              </Label>
            ))}
          </nav>
          {user && (
            <div className="flex lg:items-center lg:flex-row flex-col gap-4">
              {!isAdmin && (
                <CartHeader
                  cartItems={cartItems}
                  setOpenCartSheet={setOpenCartSheet}
                  openCartSheet={openCartSheet}
                />
              )}
              <UserHeader
                user={user}
                isAdmin={isAdmin}
                navigate={navigate}
                handleLogout={handleLogout}
              />
            </div>
          )}
          {!user && (
            <Link
              href="/auth/login"
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300"
            >
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
