import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "react-toastify";
import { setProductDetails } from "@/store/shop/products-slice";
import { addReview, getReviews } from "@/store/shop/review-slice";
import Image from "next/image";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { Avatar, AvatarFallback } from "../ui/avatar";

function ProductDetailsModal({ open, setOpen, productDetails }) {
  if (!open) return null;

  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews, pagination } = useSelector((state) => state.shopReview);

  const reviewContainerRef = useRef(null);

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast.error(
            `Only ${getQuantity} quantity can be added for this item`
          );
          return;
        }
      }
    }
    dispatch(
      addToCart({
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast.success("Product is added to cart");
      }
    });
  }

  function handleModalClose() {
    document.body.style.overflow = "auto";
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  }

  function handleAddReview() {
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data.payload.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews({ id: productDetails?._id, page: 1 }));
        toast.success("Review added successfully!");
      } else {
        toast.info(data.payload.msg);
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) {
      dispatch(getReviews({ id: productDetails?._id, page }));
    }
  }, [productDetails, page, dispatch]);

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } =
      reviewContainerRef.current;
    if (
      scrollTop + clientHeight >= scrollHeight - 10 &&
      page < pagination.totalPages
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
  }, []);

  return (
    <div
      className={`${
        open ? "block" : "hidden"
      } fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center transition-opacity`}
      style={{
        transition: "opacity 0.3s ease-in-out",
        pointerEvents: open ? "auto" : "none",
      }}
    >
      {/* Background blocking the content */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleModalClose} // Close modal if background is clicked
      ></div>

      <div
        className="bg-white rounded-lg p-4 sm:p-8 md:p-12 w-full sm:max-w-[80vw] lg:max-w-[70vw] overflow-hidden relative max-h-[90vh] overflow-y-auto z-10"
        role="dialog"
      >
        {/* Close Button (X) */}
        <button
          onClick={handleModalClose}
          className="absolute top-0 right-0 text-3xl md:top-4 md:right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Close modal"
        >
          &times;
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="relative overflow-hidden">
            <Image
              src={productDetails?.image}
              // src={"https://placehold.co/356x356/webp"}
              alt={productDetails?.title}
              width={356}
              height={356}
            />
          </div>
          <div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold">
                {productDetails?.title}
              </h1>
              <p className="text-muted-foreground text-xl sm:text-2xl mb-5 mt-4">
                {productDetails?.description}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p
                className={`text-2xl sm:text-3xl font-bold text-primary ${
                  productDetails?.salePrice > 0 ? "line-through" : ""
                }`}
              >
                EGP{productDetails?.price}
              </p>
              {productDetails?.salePrice > 0 ? (
                <p className="text-xl sm:text-2xl font-bold text-muted-foreground">
                  EGP{productDetails?.salePrice}
                </p>
              ) : null}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-0.5">
                <StarRatingComponent
                  rating={averageReview}
                  key={productDetails._id}
                />
              </div>
              <span className="text-muted-foreground">
                ({averageReview.toFixed(2)})
              </span>
            </div>
            <div className="mt-5 mb-5">
              {user !== null && (
                <>
                  {productDetails?.totalStock === 0 ? (
                    <Button className="w-full opacity-60 cursor-not-allowed">
                      Out of Stock
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() =>
                        handleAddToCart(
                          productDetails?._id,
                          productDetails?.totalStock
                        )
                      }
                    >
                      Add to Cart
                    </Button>
                  )}
                </>
              )}
            </div>
            <Separator />
            <div
              className="max-h-[300px] overflow-auto"
              ref={reviewContainerRef}
              onScroll={handleScroll}
            >
              <h2 className="text-xl font-bold mb-4">Reviews</h2>
              <div className="grid gap-6">
                {reviews && reviews.length > 0 ? (
                  reviews.map((reviewItem, index) => (
                    <div
                      className="flex gap-4 items-center"
                      key={reviewItem._id || index}
                    >
                      <Avatar className="w-10 h-10 border">
                        <AvatarFallback>
                          {reviewItem?.userId?.userName?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid gap-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold">{reviewItem?.userName}</h3>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <StarRatingComponent
                            rating={reviewItem?.reviewValue}
                          />
                        </div>
                        <p className="text-muted-foreground">
                          {reviewItem.reviewMessage}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <h1>No Reviews</h1>
                )}
              </div>
            </div>
            {user !== null && (
              <>
                <div className="mt-10 flex-col flex gap-2">
                  <Label>Write a review</Label>
                  <div className="flex gap-1">
                    <StarRatingComponent
                      rating={rating}
                      handleRatingChange={handleRatingChange}
                    />
                  </div>
                  <Input
                    name="reviewMsg"
                    value={reviewMsg}
                    onChange={(event) => setReviewMsg(event.target.value)}
                    placeholder="Write a review..."
                  />
                  <Button
                    onClick={handleAddReview}
                    className="mt-4"
                    disabled={rating === 0 || !reviewMsg}
                  >
                    Submit Review
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsModal;
