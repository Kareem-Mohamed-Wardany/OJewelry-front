"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogTitle } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";
import MoneyFormat from "@/utils/MoneyFormat";

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();

  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const orders = orderList?.orders || [];
  console.log(orders);
  const pagination = orderList?.pagination || {}; // Extract pagination data
  const { currentPage = 1, totalPages = 1 } = pagination;

  // Fetch all orders when the component mounts or the page changes
  useEffect(() => {
    dispatch(getAllOrdersForAdmin(currentPage));
  }, [dispatch, currentPage]);

  // Open details dialog when order details are loaded
  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  const handleFetchOrderDetails = (getId) => {
    dispatch(getOrderDetailsForAdmin(getId));
  };

  const handlePageChange = (direction) => {
    const nextPage = direction === "prev" ? currentPage - 1 : currentPage + 1;
    if (nextPage > 0 && nextPage <= totalPages) {
      dispatch(getAllOrdersForAdmin(nextPage));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders && orders.length > 0 ? (
              orders.map((orderItem) => (
                <TableRow key={orderItem._id}>
                  <TableCell>{orderItem?.orderId}</TableCell>
                  <TableCell>{orderItem?.createdAt.split("T")[0]}</TableCell>
                  <TableCell>
                    <Badge
                      className={`py-1 px-3 ${
                        orderItem?.orderStatus === "Accepted"
                          ? "bg-green-500"
                          : orderItem?.orderStatus === "Declined"
                          ? "bg-red-600"
                          : orderItem?.orderStatus === "Shipping"
                          ? "bg-blue-500"
                          : orderItem?.orderStatus === "Delivered"
                          ? "bg-gray-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {orderItem?.orderStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    EGP {MoneyFormat(orderItem?.totalAmount)}
                  </TableCell>
                  <TableCell>
                    <Dialog
                      open={openDetailsDialog}
                      onOpenChange={() => {
                        setOpenDetailsDialog(false);
                        dispatch(resetOrderDetails());
                      }}
                    >
                      <DialogTitle className="text-sm">
                        Order #{orderItem.orderId}
                      </DialogTitle>
                      <Button
                        onClick={() => handleFetchOrderDetails(orderItem?._id)}
                      >
                        View Details
                      </Button>
                      <AdminOrderDetailsView orderDetails={orderDetails} />
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex justify-between items-center mt-4">
          <Button
            onClick={() => handlePageChange("prev")}
            disabled={currentPage <= 1}
            className="bg-gray-600 text-white hover:bg-gray-700 px-4 py-2 rounded-md text-sm font-semibold disabled:opacity-50"
          >
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => handlePageChange("next")}
            disabled={currentPage >= totalPages}
            className="bg-gray-600 text-white hover:bg-gray-700 px-4 py-2 rounded-md text-sm font-semibold disabled:opacity-50"
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default AdminOrdersView;
