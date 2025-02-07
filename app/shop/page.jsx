"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFeaturedProducts,
  fetchProductDetails,
  clearProducts,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";
import Image from "next/image";
import { toast } from "react-toastify";
import { categoryOptionsMap } from "@/config";
import { useRouter } from "next/navigation";
import { CategorySection } from "@/components/memo/CategorySection";

const categoriesWithIcon = Object.entries(categoryOptionsMap).reduce(
  (acc, [key, value]) => {
    acc[key] = {
      id: key, // Use the key as the id
      label: value, // Keep the label as the value from the map
      image: "https://placehold.co/360x480/webp", // Use the placeholder image (or replace with actual logic)
    };
    return acc;
  },
  {}
);
function ShoppingHome() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    router.push(`/shop/products`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
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

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 15000);

    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(clearProducts());
  }, []);

  useEffect(() => {
    dispatch(
      fetchFeaturedProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
        page: 1,
        limit: 4,
      })
    );
  }, []);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[100px] md:h-[220px] lg:h-[250px] xl:h-[500px] overflow-hidden">
        {featureImageList && featureImageList.length > 0 ? (
          featureImageList.map((slide, index) => (
            <div
              key={slide._id}
              className={`${
                index === currentSlide ? "opacity-100" : "opacity-0"
              } absolute top-0 left-0 w-full h-full transition-opacity duration-1000`}
            >
              <Image
                src={slide?.image}
                // src={"https://placehold.co/1920x500/webp"}
                alt={`Slide ${index}`}
                layout="fill"
                // width={1920}
                // height={500}
                objectFit="cover"
                loading="eager" // Eager load for LCP image
                priority // Priority loading for LCP image
                unoptimized
              />
            </div>
          ))
        ) : (
          <Image
            src={"https://placehold.co/1920x500/webp"}
            alt="Placeholder"
            layout="fill"
            // width={1920}
            // height={500}
            objectFit="cover"
            loading="eager" // Eager load for LCP image
            priority // Priority loading for LCP image
          />
        )}

        {featureImageList.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setCurrentSlide(
                  (prevSlide) =>
                    (prevSlide - 1 + featureImageList.length) %
                    featureImageList.length
                )
              }
              className="absolute top-1/2 left-4 transform -translate-y-1/2  bg-primary/80"
            >
              <ChevronLeftIcon className="w-4 h-4 text-secondary" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setCurrentSlide(
                  (prevSlide) => (prevSlide + 1) % featureImageList.length
                )
              }
              className="absolute top-1/2 right-4 transform -translate-y-1/2  bg-primary/80"
            >
              <ChevronRightIcon className="w-4 h-4 text-secondary" />
            </Button>
          </>
        )}
      </div>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by category
          </h2>
          <CategorySection
            categoriesWithIcon={categoriesWithIcon}
            handleNavigateToListingPage={handleNavigateToListingPage}
          />
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Feature Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <ShoppingProductTile
                    key={productItem._id}
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                    user={user}
                  />
                ))
              : null}
          </div>
        </div>
      </section>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
        user={user}
      />
    </div>
  );
}

export default ShoppingHome;
