import { useState } from "react";
import CommonForm from "../common/form";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { toast } from "react-toastify";
import MoneyFormat from "@/utils/MoneyFormat";

const initialFormData = {
  status: "",
};

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;

    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast.info(data?.payload?.message);
      }
    });
  }

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
            <Label>${orderDetails?.totalAmount}</Label>
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
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Details</div>
            <ul className="grid gap-3">
              {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                ? orderDetails?.cartItems.map((item) => (
                    <li
                      className="flex items-center justify-between"
                      key={item.productId._id}
                    >
                      <span>Title: {item.productId.title}</span>
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
              <span>Name: {orderDetails?.customerId.userName}</span>
              <span>Address: {orderDetails?.addressInfo?.address}</span>
              <span>City: {orderDetails?.addressInfo?.city}</span>
              <span>Post Code: {orderDetails?.addressInfo?.postcode}</span>
              <span>Phone number: {orderDetails?.addressInfo?.phone}</span>
              <span>Extra Notes: {orderDetails?.addressInfo?.notes}</span>
            </div>
          </div>
        </div>
        {orderDetails?.orderStatus === "Accepted" ||
        orderDetails?.orderStatus === "Shipping" ? (
          <div>
            <CommonForm
              formControls={[
                {
                  label: "Order Status",
                  name: "status",
                  componentType: "select",
                  options: [
                    { id: "Shipping", label: "Shipping" },
                    { id: "Delivered", label: "Delivered" },
                  ],
                },
              ]}
              formData={formData}
              setFormData={setFormData}
              buttonText={"Update Order Status"}
              onSubmit={handleUpdateStatus}
            />
          </div>
        ) : null}
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;
