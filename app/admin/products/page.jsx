"use client";
import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { toast } from "react-toastify";
import { addProductFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { Fragment, useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

const initialFormData = {
  image: null,
  title: "",
  category: "",
  material: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // You can adjust this value as per your requirement

  const { productList, pagination } = useSelector(
    (state) => state.adminProducts
  );
  const dispatch = useDispatch();

  const isFormValid = useCallback(() => {
    return Object.keys(formData)
      .filter(
        (currentKey) =>
          currentKey !== "averageReview" || currentKey !== "salePrice"
      )
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }, [formData]);

  const handleDelete = useCallback(
    (getCurrentProductId) => {
      setLoading(true);
      dispatch(deleteProduct(getCurrentProductId)).then((data) => {
        if (data.payload.success) {
          dispatch(fetchAllProducts(currentPage, pageSize)); // Fetch products with pagination
          toast.success("Product deleted successfully");
        }
        setLoading(false);
      });
    },
    [dispatch, currentPage, pageSize]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (imageFile) {
      setImageLoadingState(true);
    }
    const data = new FormData();
    data.append("img", imageFile);
    data.append("title", formData.title);
    data.append("category", formData.category);
    data.append("material", formData.material);
    data.append("price", formData.price);
    data.append("salePrice", formData.salePrice);
    data.append("totalStock", formData.totalStock);
    data.append("averageReview", formData.averageReview);

    const actionResult =
      currentEditedId !== null
        ? await dispatch(editProduct({ id: currentEditedId, formData }))
        : await dispatch(addNewProduct(data));

    console.log(actionResult);

    if (actionResult.payload.success) {
      console.log("ex");
      dispatch(fetchAllProducts(currentPage));
      setFormData(initialFormData);
      setOpenCreateProductsDialog(false);
      setImageFile("");
      setCurrentEditedId(null);
      const msg = currentEditedId
        ? "Product updated successfully"
        : "Product added successfully";
      toast.success(msg);
    } else toast.error(actionResult.payload.msg);
    setLoading(false);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    dispatch(fetchAllProducts(newPage)); // Fetch products with pagination
  };

  useEffect(() => {
    dispatch(fetchAllProducts(currentPage)); // Fetch products initially
  }, [dispatch, currentPage]);

  return (
    <Fragment>
      <div className="my-6 w-full flex justify-center">
        <Button
          onClick={() => setOpenCreateProductsDialog(true)}
          disabled={loading} // Disable button while loading
          className={`px-6 py-3 rounded-lg transition-colors ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {loading ? "Processing..." : "Add New Product"}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0 ? (
          productList.map((productItem) => (
            <AdminProductTile
              key={productItem._id}
              setFormData={setFormData}
              setOpenCreateProductsDialog={setOpenCreateProductsDialog}
              setCurrentEditedId={setCurrentEditedId}
              product={productItem}
              handleDelete={handleDelete}
              className="transition-transform transform hover:scale-105"
            />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No products available
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg mr-4 disabled:opacity-50 hover:bg-gray-800 transition-colors"
          >
            Previous
          </Button>
          <span className="text-lg text-gray-700 mx-4">
            Page {currentPage} of {pagination.totalPages}
          </span>
          <Button
            disabled={currentPage === pagination.totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 hover:bg-gray-800 transition-colors"
          >
            Next
          </Button>
        </div>
      )}

      {/* Product Dialog */}
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
        }}
      >
        <SheetContent
          side="right"
          className="overflow-auto bg-white shadow-lg rounded-lg p-6 w-full max-w-md"
        >
          <SheetHeader>
            <SheetTitle className="text-2xl font-semibold text-gray-800">
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>

          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />
          <div className="py-6">
            <CommonForm
              onSubmit={handleSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              formControls={addProductFormElements}
              isBtnDisabled={!isFormValid() || loading}
              className="flex flex-col space-y-4"
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
