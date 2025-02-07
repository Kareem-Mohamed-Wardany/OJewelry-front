import { useEffect, useState } from "react";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  editaAddress,
  fetchAllAddresses,
} from "@/store/shop/address-slice";
import AddressCard from "./address-card";
import { toast } from "react-toastify";

const initialAddressFormData = {
  address: "",
  city: "",
  phone: "",
  postcode: "",
  notes: "",
};

function Address({ setCurrentSelectedAddress, selectedId }) {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);

  const resetForm = () => {
    setFormData(initialAddressFormData);
    setCurrentEditedId(null);
  };

  const handleManageAddress = async (event) => {
    event.preventDefault();

    if (addressList.length === 1 && currentEditedId === null) {
      resetForm();
      toast.info("You can add only one address");
      return;
    }

    const action = currentEditedId
      ? editaAddress({ userId: user?.id, addressId: currentEditedId, formData })
      : addNewAddress({ ...formData, userId: user.id });

    const { payload } = await dispatch(action);

    if (payload?.success) {
      dispatch(fetchAllAddresses(user?.id));
      resetForm();
      toast.success(
        currentEditedId
          ? "Address updated successfully"
          : "Address added successfully"
      );
    }
  };

  const handleDeleteAddress = async (address) => {
    const { payload } = await dispatch(
      deleteAddress({ userId: user?.id, addressId: address._id })
    );

    if (payload?.success) {
      dispatch(fetchAllAddresses());
      toast.success("Address deleted successfully");
    }
  };

  const handleEditAddress = (address) => {
    setCurrentEditedId(address._id);
    setFormData({
      address: address.address,
      city: address.city,
      phone: address.phone,
      postcode: address.postcode,
      notes: address.notes,
    });
  };

  const isFormValid = () =>
    Object.values(formData).every((value) => value.trim() !== "");

  useEffect(() => {
    dispatch(fetchAllAddresses());
  }, [dispatch]);

  return (
    <Card>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {addressList.map((address) => (
          <AddressCard
            key={address._id}
            selectedId={selectedId}
            handleDeleteAddress={handleDeleteAddress}
            addressInfo={address}
            handleEditAddress={handleEditAddress}
            setCurrentSelectedAddress={setCurrentSelectedAddress}
          />
        ))}
      </div>
      {currentEditedId !== null || addressList.length === 0 ? (
        <>
          <CardHeader>
            <CardTitle>
              {currentEditedId ? "Edit Address" : "Add New Address"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <CommonForm
              formControls={addressFormControls}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId ? "Edit" : "Add"}
              onSubmit={handleManageAddress}
              isBtnDisabled={!isFormValid()}
            />
          </CardContent>
        </>
      ) : null}
    </Card>
  );
}

export default Address;
