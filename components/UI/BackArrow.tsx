"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const BackArrow = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/reports")}
      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-300 transition-colors text-sm"
    >
      <ArrowLeft className="h-4 w-4" />
      Назад к списку
    </button>
  );
};

export default BackArrow;
