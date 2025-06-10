// components/PDFDownloadButton.tsx
"use client";
import React, { useState } from "react";
import { Loader2 } from "lucide-react";

interface PDFDownloadButtonProps {
  reportId: number;
}

const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({ reportId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadPDF = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const response = await fetch(`${apiUrl}/api/reports/${reportId}/pdf`, {
        method: "GET",
        headers: {
          "Content-Type": "application/pdf",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to download PDF: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report-${reportId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      console.log("PDF downloaded successfully for reportId:", reportId);
    } catch (err: any) {
      console.error("Failed to download PDF:", err);
      setError(err.message || "Не удалось скачать PDF.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={downloadPDF}
      className={`bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center justify-center transition-colors ${
        isLoading ? "opacity-70 cursor-not-allowed" : ""
      }`}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      )}
      {isLoading ? "Загрузка..." : "Скачать PDF"}
      {error && <span className="ml-2 text-red-200">{error}</span>}
    </button>
  );
};

export default PDFDownloadButton;
