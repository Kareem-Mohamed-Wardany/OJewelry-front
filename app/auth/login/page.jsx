"use client";
import CommonForm from "@/components/common/form";
import { toast } from "react-toastify";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useDispatch } from "react-redux";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useRouter();

  function onSubmit(event) {
    event.preventDefault();

    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        if (data?.payload?.data.user.role === "user") navigate.push("/shop");
        if (data?.payload?.data.user.role === "admin") navigate.push("/admin");
      } else {
        toast.error(data?.payload?.msg);
      }
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-8 p-6 bg-white shadow-lg rounded-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-800">
            Sign in to your account
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Don't have an account?
            <Link
              className="ml-2 font-medium text-primary hover:underline"
              href="/auth/register"
            >
              Register
            </Link>
          </p>
        </div>
        <CommonForm
          formControls={loginFormControls}
          buttonText={"Sign In"}
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}

export default AuthLogin;
