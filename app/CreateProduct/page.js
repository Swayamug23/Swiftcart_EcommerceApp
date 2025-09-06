"use client"; // Make the entire page a client component

import React from "react";
import { Suspense } from "react";
import CreateProductForm from "@/components/CreateProductForm";


export default function CreateProductPage() {
  return <Suspense fallback={<div>Loading...</div>}>
      <CreateProductForm />
    </Suspense>;
}
