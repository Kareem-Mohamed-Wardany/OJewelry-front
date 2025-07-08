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
        {cartItems?.items?.length > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white text-xs font-bold">
            {cartItems.items.length}
          </span>
        )}
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
