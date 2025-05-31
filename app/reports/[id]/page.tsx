// app/reports/[id]/page.tsx

import prisma from "@/lib/prisma";
import ReportView from "@/components/ReportView";
import PDFDownloadButton from "@/components/PDFDownloadButton";

export default async function ReportPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const report = await prisma.report.findUnique({
    where: { id: parseInt(id) },
  });

  if (!report) {
    return <div>Отчет не найден</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Паспорт промковша</h1>
        <PDFDownloadButton reportId={report.id} />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <ReportView report={report} />
      </div>
    </div>
  );
}
