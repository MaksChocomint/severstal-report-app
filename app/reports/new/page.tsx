// app/reports/new/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ReportForm from "@/components/ReportForm"; // Your existing ReportForm
import { ArrowLeft } from "lucide-react";

const NewReportPage = () => {
  const router = useRouter();

  const handleSubmitSuccess = (reportId: number) => {
    router.push(`/reports/${reportId}`);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-slate-800 cursor-pointer">
          Создание нового отчета
        </h1>
        <button
          onClick={() => router.push("/reports")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-300 transition-colors text-sm"
        >
          <ArrowLeft className="h-4 w-4 cursor-pointer" />
          Назад к списку
        </button>
      </div>

      <ReportForm onSuccess={handleSubmitSuccess} />
    </div>
  );
};

export default NewReportPage;
