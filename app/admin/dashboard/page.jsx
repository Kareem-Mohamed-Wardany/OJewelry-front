"use client";
import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import {
  deleteFeatureImage,
  getAllFeatureImages,
  updateFeatureImage,
} from "@/store/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trash2, ShieldCheck } from "lucide-react";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [deleting, setDeleting] = useState(false); // State for tracking deletion
  const [updating, setUpdating] = useState(false); // State for tracking deletion
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);

  // Uploads image to the server
  async function uploadImageToCloudinary(file) {
    if (!file) return;
    setImageLoadingState(true);
    const data = new FormData();
    data.append("img", file);

    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/common/hero/add",
        {
          method: "POST",
          body: data,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      const result = await response.json();
      setUploadedImageUrl(result?.url || "");
      setImageFile(null);
      dispatch(getAllFeatureImages());
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setImageLoadingState(false);
    }
  }

  function handleUploadFeatureImage() {
    uploadImageToCloudinary(imageFile);
  }

  // Delete Feature Image
  async function handleDeleteFeatureImage(publicId) {
    setDeleting(true); // Set deleting state to true
    try {
      await dispatch(deleteFeatureImage(publicId));
      dispatch(getAllFeatureImages()); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting image:", error);
    } finally {
      setDeleting(false); // Set deleting state to false once complete
    }
  }

  async function handleUpdateFeatureImage(id) {
    setUpdating(true); // Set deleting state to true
    try {
      await dispatch(updateFeatureImage(id));
      dispatch(getAllFeatureImages()); // Refresh the list after deletion
    } catch (error) {
      console.error("Error updating image:", error);
    } finally {
      setDeleting(false); // Set deleting state to false once complete
    }
  }

  useEffect(() => {
    dispatch(getAllFeatureImages());
  }, [dispatch]);

  return (
    <div>
      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        isCustomStyling={true}
      />
      <Button onClick={handleUploadFeatureImage} className="mt-5 w-full">
        Upload
      </Button>
      <div className="flex flex-col gap-4 mt-5">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((featureImgItem) => (
              <div className="relative" key={featureImgItem._id}>
                <img
                  src={featureImgItem.image}
                  className="w-full h-[300px] object-cover rounded-t-lg"
                />
                <button
                  onClick={() =>
                    handleDeleteFeatureImage(featureImgItem.public_id)
                  }
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full flex items-center justify-center"
                  disabled={deleting} // Disable button while deleting
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleUpdateFeatureImage(featureImgItem._id)}
                  className={`absolute top-2 right-14 ${
                    featureImgItem.active
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-gray-500 hover:bg-gray-600"
                  } text-white px-3 py-1 rounded-full flex items-center justify-center`}
                  disabled={deleting} // Disable button while deleting
                >
                  <ShieldCheck className="w-4 h-4" />
                </button>
              </div>
            ))
          : null}
      </div>
    </div>
  );
}

export default AdminDashboard;
