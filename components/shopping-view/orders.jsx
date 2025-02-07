import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
} from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import ShoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersByUserId,
  getOrderDetails,
  resetOrderDetails,
} from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";
import MoneyFormat from "@/utils/MoneyFormat";

function ShoppingOrders() {
  const [page, setPage] = useState(1); // Current page
  const [pageSize] = useState(10); // Items per page (can be adjusted)
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);

  const orders = orderList?.orders || [];
  const pagination = orderList?.pagination || {}; // Extract pagination data
  const { currentPage, totalPages } = pagination;

  useEffect(() => {
    // Fetch orders with the current page and page size
    if (user?.id) {
      dispatch(getAllOrdersByUserId(page));
    }
  }, [dispatch, user?.id, page, pageSize]);

  const handlePageChange = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setPage((prevPage) => prevPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length > 0 ? (
          <>
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
                {orders.map((orderItem) => (
                  <TableRow key={orderItem._id}>
                    <TableCell>{orderItem.orderId}</TableCell>
                    <TableCell>{orderItem.createdAt.split("T")[0]}</TableCell>
                    <TableCell>
                      <Badge
                        className={`py-1 px-3 ${
                          orderItem.orderStatus === "Accepted"
                            ? "bg-green-500"
                            : orderItem.orderStatus === "Declined"
                            ? "bg-red-600"
                            : orderItem.orderStatus === "Shipping"
                            ? "bg-blue-500"
                            : orderItem.orderStatus === "Delivered"
                            ? "bg-gray-500"
                            : "bg-yellow-500"
                        }`}
                      >
                        {orderItem.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      EGP {MoneyFormat(orderItem.totalAmount)}
                    </TableCell>
                    <TableCell>
                      <Dialog
                        open={orderDetails?._id === orderItem._id}
                        onOpenChange={(isOpen) => {
                          if (!isOpen) {
                            dispatch(resetOrderDetails());
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            onClick={() =>
                              dispatch(getOrderDetails(orderItem._id))
                            }
                            className="bg-gray-600 text-white hover:bg-gray-700 px-4 py-2 rounded-md text-sm font-semibold"
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogTitle>
                            Order #{orderItem.orderId} Details
                          </DialogTitle>
                          <ShoppingOrderDetailsView
                            orderDetails={orderDetails}
                          />
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              <Button
                onClick={() => handlePageChange("prev")}
                disabled={currentPage === 1}
                className="bg-gray-600 text-white hover:bg-gray-700 px-4 py-2 rounded-md text-sm font-semibold"
              >
                Previous
              </Button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() => handlePageChange("next")}
                disabled={currentPage === totalPages}
                className="bg-gray-600 text-white hover:bg-gray-700 px-4 py-2 rounded-md text-sm font-semibold"
              >
                Next
              </Button>
            </div>
          </>
        ) : (
          <p>No orders yet</p>
        )}
      </CardContent>
    </Card>
  );
}

export default ShoppingOrders;
