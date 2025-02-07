"use client";
import Address from "@/components/shopping-view/address";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { toast } from "react-toastify";
import MoneyFormat from "@/utils/MoneyFormat";
import { useRouter } from "next/navigation";
import { resetCartItems } from "@/store/shop/cart-slice";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymemntStart] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const cItems = cartItems.items;

  const totalCartAmount =
    cItems && cItems.length > 0
      ? cItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem.productId.salePrice > 0
              ? currentItem.productId.salePrice
              : currentItem.productId.price) *
              currentItem.quantity,
          0
        )
      : 0;

  function handleInitiatePaypalPayment() {
    if (cartItems.length === 0) {
      toast.warning("Your cart is empty. Please add items to proceed");

      return;
    }
    if (currentSelectedAddress === null) {
      toast.info("Please select one address to proceed.");

      return;
    }

    const orderData = {
      userId: user.id,
      cartId: cartItems._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem.productId,
        title: singleCartItem.title,
        image: singleCartItem.image,
        price:
          singleCartItem.salePrice > 0
            ? singleCartItem.salePrice
            : singleCartItem.price,
        quantity: singleCartItem.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress._id,
        address: currentSelectedAddress.address,
        city: currentSelectedAddress.city,
        postcode: currentSelectedAddress.postcode,
        phone: currentSelectedAddress.phone,
        notes: currentSelectedAddress.notes,
      },
      orderStatus: "Pending",
      totalAmount: totalCartAmount,
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      if (data.payload.success) {
        toast.success("Order created successfully!");
        window.open(data.payload.data.paymentUrl, "_blank");
        setIsPaymemntStart(true);
        dispatch(resetCartItems());
        router.push("/shop/account");
      } else {
        setIsPaymemntStart(false);
      }
    });
  }
  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        {/* <img src={img} className="h-full w-full object-cover object-center" /> */}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item) => (
                <UserCartItemsContent cartItem={item} key={item._id} />
              ))
            : null}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">
                EGP {MoneyFormat(totalCartAmount)}
              </span>
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button onClick={handleInitiatePaypalPayment} className="w-full">
              {isPaymentStart ? "Processing Paypal Payment..." : "Checkout"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
