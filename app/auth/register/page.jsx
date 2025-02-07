"use client";
import CommonForm from "@/components/common/form";
import { toast } from "react-toastify";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useRouter();

  function onSubmit(event) {
    event.preventDefault();
    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast.success(data?.payload?.msg);
        navigate.push("/auth/login");
      } else {
        toast.error(data?.payload?.msg);
      }
    });
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md space-y-8 p-6 bg-white shadow-lg rounded-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-800">
            Create new account
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?
            <Link
              className="ml-2 font-medium text-primary hover:underline"
              href="/auth/login"
            >
              Login
            </Link>
          </p>
        </div>
        <CommonForm
          formControls={registerFormControls}
          buttonText={"Sign Up"}
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}

export default AuthRegister;
