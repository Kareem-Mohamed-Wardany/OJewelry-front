import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import MoneyFormat from "@/utils/MoneyFormat";
import Link from "next/link";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

  return (
    <DialogContent className="sm:max-w-[600px]">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex mt-6 items-center justify-between">
            <p className="font-medium">Order ID</p>
            <Label>{orderDetails?.orderId}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Date</p>
            <Label>{orderDetails?.createdAt.split("T")[0]}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Price</p>
            <Label>EGP {MoneyFormat(orderDetails?.totalAmount)}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Status</p>
            <Label>
              <Badge
                className={`py-1 px-3 ${
                  orderDetails?.orderStatus === "Accepted"
                    ? "bg-green-500"
                    : orderDetails?.orderStatus === "Declined"
                    ? "bg-red-600"
                    : orderDetails?.orderStatus === "Shipping"
                    ? "bg-blue-500"
                    : orderDetails?.orderStatus === "Delivered"
                    ? "bg-gray-500"
                    : "bg-yellow-500"
                }`}
              >
                {orderDetails?.orderStatus}
              </Badge>
            </Label>
          </div>
        </div>
        {orderDetails?.orderStatus === "Pending" && (
          <>
            <Separator />
            <div className=" flex justify-center">
              <Link
                href={orderDetails.paymentURL}
                target="_blank"
                className="inline-block bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Pay Now
              </Link>
            </div>
          </>
        )}
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Details</div>
            <ul className="grid gap-3">
              {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                ? orderDetails?.cartItems.map((item) => (
                    <li
                      className="flex items-center justify-between"
                      key={item._id}
                    >
                      <span>Product: {item.productId.title}</span>
                      <span>Quantity: {item.quantity}</span>
                      <span>
                        Price: EGP{" "}
                        {MoneyFormat(
                          item.productId.salePrice || item.productId.price
                        )}
                      </span>
                    </li>
                  ))
                : null}
            </ul>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Info</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>Name: {user.userName}</span>
              <span>Address: {orderDetails?.addressInfo?.address}</span>
              <span>City: {orderDetails?.addressInfo?.city}</span>
              <span>Post Code: {orderDetails?.addressInfo?.postcode}</span>
              <span>Phone number: {orderDetails?.addressInfo?.phone}</span>
              <span>Extra Notes: {orderDetails?.addressInfo?.notes}</span>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;
