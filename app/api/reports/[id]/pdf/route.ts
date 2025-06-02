// app/api/reports/[id]/pdf/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import puppeteer from 'puppeteer';
import { format } from "date-fns";
import { ru } from "date-fns/locale";

const isProduction = process.env.NODE_ENV === 'production';
const executablePath = isProduction
  ? '/usr/bin/google-chrome-stable'
  : puppeteer.executablePath();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } } // `params` is already resolved here by Next.js
) {
  const reportId = parseInt(params.id, 10); // Accessing params.id directly is fine here.

  if (isNaN(reportId)) {
    return NextResponse.json({ error: 'Invalid Report ID' }, { status: 400 });
  }

  try {
    const report = await prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    const formatDate = (date: Date | string) => {
      const d = typeof date === "string" ? new Date(date) : date;
      return format(d, "dd.MM.yy HH:mm", { locale: ru });
    };

    const formatDateOnly = (date: Date | string) => {
      const d = typeof date === "string" ? new Date(date) : date;
      return format(d, "dd.MM.yyyy", { locale: ru });
    };

    // --- MANUALLY CONSTRUCTING HTML HERE ---
    const htmlContent = `
      <div class="font-sans text-sm p-2 bg-white">
        <div class="text-center mb-6">
          <h1 class="text-xl font-bold uppercase">
            Паспорт промковша ${report.ladlePassportNumber}
          </h1>
          ${report.meltNumber ? `
            <p class="text-sm mt-2">
              на плавку № ${report.meltNumber} УНРС: ${report.meltUnrs} начало:
              ${format(new Date(report.meltStartDateTime), "dd/MM/yy HH:mm", { locale: ru })}
              Стойкость ПК ${report.meltLadleStability}
            </p>
          ` : ''}
        </div>

        <p class="mb-3">
          <span class="font-medium">Прибытие на участок:</span>
          ${formatDate(report.arrivalDate)}
        </p>

        <div class="">
          <h2 class="text-base font-bold uppercase mb-3 border-b-2 border-black pb-1 tracking-wide">
            ТОРКРЕТИРОВАНИЕ И СБОРКА ПК
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <h3 class="font-semibold uppercase mb-2 text-sm">
                ТОРКРЕТИРОВАНИЕ
              </h3>
              <div class="space-y-1 text-xs">
                <p>
                  <span class="font-medium">Дата:</span>
                  ${formatDateOnly(report.torcretingDate)}
                </p>
                <p>
                  <span class="font-medium">Смеси(наимен,партия):</span>
                  ${report.mixtures}
                </p>
                <p>
                  <span class="font-medium">Отдано на сборку:</span>
                  ${formatDateOnly(report.assemblyHandoverDate)}
                </p>
                <h4 class="font-semibold uppercase pt-2 pb-1 text-sm">
                  РАСПОЛОЖЕНИЕ ТЕРМОБЛОКОВ
                </h4>
                <p>
                  <span class="font-medium">Расстояние от днища(мм):</span>
                  ${report.thermalBlockDistance}
                </p>
                <p>
                  <span class="font-medium">Длина выступ.части(мм):</span>
                  ${report.thermalBlockProtrusion}
                </p>
                <p>
                  <span class="font-medium">Состояние термоблока:</span>
                  ${report.thermalBlockCondition || "нет данных"}
                </p>
              </div>
            </div>

            <div>
              <h3 class="font-semibold uppercase mb-2 text-sm">СБОРКА</h3>
              <div class="space-y-1 text-xs">
                <p>
                  <span class="font-medium">Стаканы-дозаторы:</span>
                  ${report.doserCupType}
                </p>
                <p>
                  <span class="font-medium">Установщик стаканов:</span>
                  ${report.doserCupInstaller}
                </p>
                <p>
                  <span class="font-medium">Стопор-моноблок:</span>
                  ${report.stopperMonoblockType}
                </p>
                <p>
                  <span class="font-medium">Установщик стопора:</span>
                  ${report.stopperMonoblockInstaller}
                </p>
                <p>
                  <span class="font-medium">Затвор №1:</span> ${report.valve1}
                </p>
                <p>
                  <span class="font-medium">Затвор №2:</span> ${report.valve2}
                </p>
                ${report.turbostop ? `
                  <p>
                    <span class="font-medium">Турбостоп:</span>
                    ${report.turbostop}
                  </p>
                ` : ''}
              </div>
            </div>
          </div>
        </div>

        <div class="">
          <h2 class="text-base font-bold uppercase mb-2 border-b-2 border-black pb-1 tracking-wide">
            РАЗЛИВКА
          </h2>
          <p class="mb-3 text-xs">
            <span class="font-medium">Отдано на разливку:</span>
            ${format(new Date(report.pouringHandoverDateTime), "dd/MM/yy HH:mm", { locale: ru })}
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <h3 class="font-semibold uppercase mb-2 text-sm">
                ПОДГОТОВКА К РАЗЛИВКЕ
              </h3>
              <div class="space-y-1 text-xs">
                <p>
                  <span class="font-medium">Постановка на разогрев:</span>
                  ${formatDate(report.heatingStartDateTime)}
                </p>
                <p>
                  <span class="font-medium">Длительность разогрева:</span>
                  ${report.heatingDuration}
                </p>
                <p>
                  <span class="font-medium">Оператор ГПУ:</span>
                  ${report.operatorName}
                </p>
              </div>
            </div>

            <div>
              <h3 class="font-semibold uppercase mb-2 mt-4 text-sm">
                РАЗЛИВКА (Начало)
              </h3>
              <div class="space-y-3 text-xs">
                <div class="border-l-2 border-gray-400 pl-2 py-1">
                  <p>
                    <span class="font-medium">
                      Плавка № ${report.pour1MeltNumber}
                    </span>
                    УНРС: ${report.pour1Unrs}
                  </p>
                  <p>
                    <span class="font-medium">Начало:</span>
                    ${format(new Date(report.pour1StartDateTime), "dd/MM/yy HH:mm", { locale: ru })}
                  </p>
                  <p>
                    <span class="font-medium">Окончание:</span>
                    ${format(new Date(report.pour1EndDateTime), "dd/MM/yy HH:mm", { locale: ru })}
                  </p>
                  <p>
                    <span class="font-medium">№ пл.в серии:</span>
                    ${report.pour1SeriesPosition}
                  </p>
                  <p>
                    <span class="font-medium">Стойкость ПК:</span>
                    ${report.pour1LadleStability}
                  </p>
                </div>
              </div>

              <h3 class="font-semibold uppercase mb-2 mt-4 text-sm">
                РАЗЛИВКА (Окончание)
              </h3>
              <div class="space-y-3 text-xs">
                <div class="border-l-2 border-gray-400 pl-2 py-1">
                  <p>
                    <span class="font-medium">
                      Плавка № ${report.pour2MeltNumber}
                    </span>
                  </p>
                  <p>
                    <span class="font-medium">Разлито (Начало):</span>
                    ${format(new Date(report.pour2StartDateTime), "dd/MM/yy HH:mm", { locale: ru })}
                  </p>
                  <p>
                    <span class="font-medium">Окончание:</span>
                    ${format(new Date(report.pour2EndDateTime), "dd/MM/yy HH:mm", { locale: ru })}
                  </p>
                  <p>
                    <span class="font-medium">Стойкость ПК:</span>
                    ${report.pour2LadleStability}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="border-t-2 border-black pt-3">
          <h2 class="text-base font-bold uppercase mb-2 tracking-wide">
            ЗАМЕЧАНИЯ
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 text-xs">
            <p>
              <span class="font-medium">По торкретированию:</span>
              ${report.torcretingRemarks || "нет"}
            </p>
            <p>
              <span class="font-medium">По сборке:</span>
              ${report.assemblyRemarks || "нет"}
            </p>
            <p>
              <span class="font-medium">По разогреву:</span>
              ${report.heatingRemarks || "нет"}
            </p>
            <p>
              <span class="font-medium">По разливке:</span>
              ${report.pouringRemarks || "нет"}
            </p>
          </div>
        </div>
      </div>
    `;
    // --- END OF MANUALLY CONSTRUCTED HTML ---

    const fullHtml = `
      <!DOCTYPE html>
      <html lang="ru">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Отчет по промковшу № ${report.ladlePassportNumber}</title>
          <style>
              /* You NEED to manually copy all necessary Tailwind CSS classes here,
                 or link a CDN for Tailwind CSS if you want it to look consistent. */
              body { font-family: 'Arial', sans-serif; margin-left: 20px; font-size: 14px; }
              .text-center { text-align: center; }
              .mb-6 { margin-bottom: 1.5rem; }
              .text-xl { font-size: 1.25rem; }
              .font-bold { font-weight: 700; }
              .uppercase { text-transform: uppercase; }
              .text-sm { font-size: 0.875rem; }
              .mt-2 { margin-top: 0.5rem; }
              .mb-3 { margin-bottom: 0.75rem; }
              .font-medium { font-weight: 500; }
              .text-base { font-size: 1rem; }
              .border-b-2 { border-bottom-width: 2px; }
              .border-black { border-color: #000; }
              .pb-1 { padding-bottom: 0.25rem; }
              .tracking-wide { letter-spacing: 0.025em; }
              .grid { display: grid; }
              .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
              .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
              .gap-x-6 { column-gap: 1.5rem; }
              .gap-y-4 { row-gap: 1rem; }
              .font-semibold { font-weight: 600; }
              .mb-2 { margin-bottom: 0.5rem; }
              .text-xs { font-size: 0.75rem; }
              .space-y-1 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.25rem; }
              .pt-2 { padding-top: 0.5rem; }
              .pb-1 { padding-bottom: 0.25rem; }
              .border-l-2 { border-left-width: 2px; }
              .border-gray-400 { border-color: #9ca3af; }
              .pl-2 { padding-left: 0.5rem; }
              .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
              .space-y-3 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.75rem; }
              .mt-4 { margin-top: 1rem; }
              .border-t-2 { border-top-width: 2px; }
              .pt-3 { padding-top: 0.75rem; }
          </style>
      </head>
      <body>
          ${htmlContent}
      </body>
      </html>
    `;

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: executablePath,
    });
    const page = await browser.newPage();

    await page.setContent(fullHtml, {
      waitUntil: 'networkidle0',
    });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm',
      },
    });

    await browser.close();

    // --- ENHANCED FILENAME SANITIZATION ---
    // Remove any character that is not a basic Latin letter, number, hyphen, or underscore
    // Also, specifically replace '№' with 'N' if it wasn't caught by the general regex.
    const cleanedLadlePassportNumber = report.ladlePassportNumber
      .replace(/[^a-zA-Z0-9\-_]/g, '') // Keep only alphanumeric, hyphen, and underscore
      .replace(/№/g, 'N'); // Explicitly replace '№' if it somehow sneaks through or if preferred over the general regex

    const filename = `report-${cleanedLadlePassportNumber}.pdf`;

    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        // Ensure the filename is ASCII-safe for Content-Disposition
        'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF. Check server logs.' },
      { status: 500 }
    );
  }
}