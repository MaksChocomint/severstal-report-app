// components/PDFDownloadButton.tsx
"use client";
import React from "react";

interface PDFDownloadButtonProps {
  reportId: number;
}

const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({ reportId }) => {
  const downloadPDF = async () => {
    try {
      console.log("Downloading PDF for reportId:", reportId);
    } catch (error) {
      console.error("Failed to download PDF:", error);
    }
  };

  return (
    <button
      onClick={downloadPDF}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center"
    >
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
      Скачать PDF
    </button>
  );
};

export default PDFDownloadButton;
