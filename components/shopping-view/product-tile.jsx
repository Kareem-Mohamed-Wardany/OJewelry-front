import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import Image from "next/image";
import MoneyFormat from "@/utils/MoneyFormat";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
  user,
}) {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <div
        onClick={() => handleGetProductDetails(product?._id)}
        className="cursor-pointer"
      >
        <div className="relative">
          {/* Image container with aspect ratio */}
          <div className="aspect-w-1 aspect-h-1">
            <Image
              src={product?.image || "https://placehold.co/100x100"}
              // src={"https://placehold.co/356x356/webp"}
              alt={product?.title || "Product image"}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
              loading="lazy"
            />
          </div>

          {/* Conditional Badges */}
          {product?.totalStock === 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white">
              Out Of Stock
            </Badge>
          )}
          {product?.totalStock > 0 && product?.totalStock < 10 && (
            <Badge className="absolute top-2 left-2 bg-orange-500 hover:bg-orange-600 text-white">
              {`Only ${product?.totalStock} left`}
            </Badge>
          )}
          {product?.salePrice > 0 && (
            <>
              <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600 text-white">
                Sale
              </Badge>
              <Badge className="absolute top-10 right-2 bg-red-500 hover:bg-red-600 text-white">
                {`${Math.round(
                  ((product?.price - product?.salePrice) / product?.price) * 100
                )}% OFF`}
              </Badge>
            </>
          )}
        </div>

        <CardContent className="p-4">
          <h2 className="text-lg font-bold mb-2">{product?.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[16px] text-muted-foreground">
              {categoryOptionsMap[product?.category]}
            </span>
            <span className="text-[16px] text-muted-foreground">
              {brandOptionsMap[product?.brand]}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through" : ""
              } text-lg font-semibold text-primary`}
            >
              EGP {MoneyFormat(product?.price)}
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg font-semibold text-primary">
                EGP {MoneyFormat(product?.salePrice)}
              </span>
            ) : null}
          </div>
        </CardContent>
      </div>
      <CardFooter>
        {user !== null && (
          <>
            {product?.totalStock === 0 ? (
              <Button className="w-full opacity-60 cursor-not-allowed">
                Out Of Stock
              </Button>
            ) : (
              <Button
                onClick={() =>
                  handleAddtoCart(product?._id, product?.totalStock)
                }
                className="w-full"
              >
                Add to cart
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
