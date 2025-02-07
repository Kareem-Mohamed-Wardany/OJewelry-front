import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { toast } from "react-toastify";
import MoneyFormat from "@/utils/MoneyFormat";
import { setProducts } from "@/store/shop/products-slice";

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);

  const dispatch = useDispatch();

  function handleUpdateQuantity(getCartItem, typeOfAction) {
    let updatedQuantity = getCartItem?.quantity;

    if (typeOfAction === "plus") {
      updatedQuantity += 1;
      const productIndex = productList.findIndex(
        (product) => product._id === getCartItem.productId._id
      );
      const productStock = productList[productIndex]?.totalStock;

      if (updatedQuantity > productStock) {
        toast.error(`Only ${productStock} items are available in stock.`);
        return;
      }
    } else if (typeOfAction === "minus" && updatedQuantity > 1) {
      updatedQuantity -= 1;
    }

    // Only dispatch if quantity is updated.
    if (updatedQuantity !== getCartItem?.quantity) {
      dispatch(
        updateCartQuantity({
          userId: user?.id,
          productId: getCartItem.productId._id,
          quantity: updatedQuantity,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          toast.success("Cart item updated successfully.");
        }
      });
    }
  }

  function handleCartItemDelete(getCartItem) {
    dispatch(deleteCartItem({ productId: getCartItem.productId._id })).then(
      (data) => {
        if (data?.payload?.success) {
          toast.success("Cart item deleted successfully.");
        }
      }
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <img
        src={cartItem.productId.image}
        alt={cartItem.productId.title}
        className="w-20 h-20 rounded object-cover"
      />
      <div className="flex-1">
        <h3 className="font-extrabold">{cartItem.productId.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            disabled={cartItem?.quantity === 1}
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
          >
            <Minus className="w-4 h-4" />
            <span className="sr-only">Decrease</span>
          </Button>
          <span className="font-semibold">{cartItem?.quantity}</span>
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
          >
            <Plus className="w-4 h-4" />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="font-semibold">
          EGP{" "}
          {MoneyFormat(
            (cartItem.productId.salePrice > 0
              ? cartItem.productId.salePrice
              : cartItem.productId.price) * cartItem?.quantity
          )}
        </p>
        <Trash
          onClick={() => handleCartItemDelete(cartItem)}
          className="cursor-pointer mt-1"
          size={20}
        />
      </div>
    </div>
  );
}

export default UserCartItemsContent;
