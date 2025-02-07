import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import MoneyFormat from "@/utils/MoneyFormat";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
}) {
  return (
    <Card className="w-full max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105">
      <div className="relative">
        {/* Product Image */}
        <img
          src={product?.image}
          alt={product?.title}
          className="w-full h-[300px] object-cover"
        />
        {/* Sale Badge */}
        {product?.salePrice > 0 && (
          <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
            {`-${Math.round(
              ((product?.price - product?.salePrice) / product?.price) * 100
            )}% OFF`}
          </div>
        )}
      </div>

      {/* Card Content */}
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold text-secondary mb-2">
          {product?.title}
        </h2>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <span
              className={`${
                product?.salePrice > 0
                  ? "line-through text-gray-500"
                  : "text-primary"
              } text-lg font-semibold`}
            >
              EGP {MoneyFormat(product?.price)}
            </span>
            {product?.salePrice > 0 && (
              <span className="ml-2 text-lg font-bold text-red-600">
                EGP {MoneyFormat(product?.salePrice)}
              </span>
            )}
          </div>
        </div>
      </CardContent>

      {/* Card Footer */}
      <CardFooter className="p-4 flex justify-between items-center bg-gray-100 rounded-b-lg">
        <Button
          onClick={() => {
            setOpenCreateProductsDialog(true);
            setCurrentEditedId(product?._id);
            setFormData(product);
          }}
          className="bg-blue-600 text-white hover:bg-blue-700 transition-colors rounded-lg px-4 py-2"
        >
          Edit
        </Button>
        <Button
          onClick={() => handleDelete(product?._id)}
          className="bg-red-600 text-white hover:bg-red-700 transition-colors rounded-lg px-4 py-2"
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AdminProductTile;
