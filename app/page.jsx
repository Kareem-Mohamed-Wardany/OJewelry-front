"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const page = (children) => {
  const router = useRouter();
  useEffect(() => {
    router.push("/shop");
  }, []);
  return;
};

export default page;
