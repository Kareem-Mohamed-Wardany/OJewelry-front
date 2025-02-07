"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductFilter from "@/components/shopping-view/filter";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "react-toastify";
import { sortOptions } from "@/config";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
  clearProducts,
} from "@/store/shop/products-slice";
import { ArrowUpDownIcon } from "lucide-react";

function ShoppingListing() {
  const dispatch = useDispatch();
  const { productList, productDetails, isLoading, hasMore } = useSelector(
    (state) => state.shopProducts
  );
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1); // Track the current page
  const [firstTime, setFirstTime] = useState(true); // Track the current page
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const containerRef = useRef(); // Reference for the product list container

  const handleSort = (value) => {
    dispatch(clearProducts());
    setSort(value);
    setPage(1); // Reset pagination when sorting changes
  };

  const handleFilter = (getSectionId, getCurrentOption) => {
    let cpyFilters = { ...filters };
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption],
      };
    } else {
      const indexOfCurrentOption =
        cpyFilters[getSectionId].indexOf(getCurrentOption);
      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
    setPage(1); // Reset pagination when filters change
    dispatch(clearProducts());
  };

  const handleGetProductDetails = (getCurrentProductId) => {
    dispatch(fetchProductDetails(getCurrentProductId));
  };

  const handleAddtoCart = (getCurrentProductId, getTotalStock) => {
    let getCartItems = cartItems.items || [];
    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast.warning(
            `Only ${getQuantity} quantity can be added for this item`
          );
          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast.success("Product is added to cart");
      }
    });
  };

  // Only call this once when the component is first mounted
  useEffect(() => {
    if (firstTime) {
      dispatch(clearProducts());
      setFirstTime(false);
    }
  }, [firstTime, dispatch]);

  // Initialize sort and filters on first render
  useEffect(() => {
    const initialFilters = JSON.parse(sessionStorage.getItem("filters")) || {};
    setSort("price-lowtohigh");
    setFilters(initialFilters);
  }, []);

  // Trigger the API call for fetching products when sort, filters, or page changes
  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: filters,
        sortParams: sort,
        page,
      })
    );
  }, [dispatch, sort, filters, page]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  // Scroll event handler for pagination
  const handleScroll = useCallback(() => {
    if (!containerRef.current || isLoading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

    // If user scrolls to the bottom of the container, load more products
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isLoading, hasMore]);

  // Attach scroll event listener
  useEffect(() => {
    const currentContainer = containerRef.current;
    if (currentContainer) {
      currentContainer.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (currentContainer) {
        currentContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
      <ProductFilter filters={filters} handleFilter={handleFilter} />
      <div>
        <div className="flex items-center gap-3 justify-between">
          <h2 className="text-lg font-extrabold">All Products</h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              {productList?.length} Products
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="p-4 border-b flex items-center justify-between"></div>
        <div
          className="bg-background w-full rounded-lg shadow-sm overflow-y-auto scrollbar-hide"
          style={{ maxHeight: "80vh" }}
          ref={containerRef}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 p-4">
            {productList && productList.length > 0 ? (
              productList.map((productItem) => (
                <ShoppingProductTile
                  key={productItem._id + productItem.title}
                  handleGetProductDetails={handleGetProductDetails}
                  product={productItem}
                  handleAddtoCart={handleAddtoCart}
                />
              ))
            ) : (
              <p className="text-2xl">
                {!isLoading && "No products available."}
              </p>
            )}
          </div>
          {isLoading && (
            <p className="text-2xl text-center">Loading more products...</p>
          )}
        </div>
      </div>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingListing;
