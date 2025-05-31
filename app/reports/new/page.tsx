// app/reports/new/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ReportForm from "@/components/ReportForm";

import BackArrow from "@/components/UI/BackArrow";

const NewReportPage = () => {
  const router = useRouter();

  const handleSubmitSuccess = (reportId: number) => {
    router.push(`/reports/${reportId}`);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-slate-800">
          Создание нового отчета
        </h1>
        <BackArrow />
      </div>

      <ReportForm onSuccess={handleSubmitSuccess} />
    </div>
  );
};

export default NewReportPage;
