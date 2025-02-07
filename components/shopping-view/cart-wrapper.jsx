"use client";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";
import MoneyFormat from "@/utils/MoneyFormat";
import { useRouter } from "next/navigation";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const router = useRouter();
  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem.productId.salePrice > 0
              ? currentItem.productId.salePrice
              : currentItem.productId.price) *
              currentItem.quantity,
          0
        )
      : 0;

  return (
    <SheetContent className="sm:max-w-md">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
      </SheetHeader>
      <div className="mt-8 space-y-4">
        {cartItems && cartItems.length > 0
          ? cartItems.map((item) => (
              <UserCartItemsContent cartItem={item} key={item.productId._id} />
            ))
          : null}
      </div>
      <div className="mt-8 space-y-4">
        <div className="flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold">EGP {MoneyFormat(totalCartAmount)}</span>
        </div>
      </div>
      <Button
        onClick={() => {
          setOpenCartSheet(false);
          router.push("/shop/checkout");
        }}
        className="w-full mt-6"
      >
        Checkout
      </Button>
    </SheetContent>
  );
}

export default UserCartWrapper;
