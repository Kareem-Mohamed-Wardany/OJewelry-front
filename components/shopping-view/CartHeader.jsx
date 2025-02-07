import React from "react";
import { Sheet } from "../ui/sheet";
import { Button } from "../ui/button";
import UserCartWrapper from "./cart-wrapper";
import { ShoppingCart } from "lucide-react";
const CartHeader = ({ cartItems, setOpenCartSheet, openCartSheet }) => {
  return (
    <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
      <Button
        onClick={() => setOpenCartSheet(true)}
        variant="outline"
        size="icon"
        className="relative"
        aria-label="Toggle cart sheet"
      >
        <ShoppingCart className="w-6 h-6" />
        <span className="absolute top-[-2px] right-[2px] font-bold text-sm">
          {cartItems?.items?.length || 0}
        </span>
      </Button>
      {cartItems && (
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={cartItems.items}
        />
      )}
    </Sheet>
  );
};

export default CartHeader;
