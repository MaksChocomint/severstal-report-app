// app/reports/page.tsx
"use client";
import Link from "next/link";
import {
  Search,
  PlusCircle,
  FileText,
  Calendar,
  Filter as FilterIcon,
} from "lucide-react"; // Renamed Filter to FilterIcon
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import React from "react";

// Assuming these are shadcn/ui components or similar, styled with Tailwind:
// If not, you'll need to create/style these components yourself.
// For demonstration, I'm using placeholder components with appropriate classNames.

// Placeholder for shadcn/ui Button (or your custom Button component)
const Button = ({
  variant,
  size,
  disabled,
  className,
  children,
  asChild,
  ...props
}: any) => {
  const baseStyle =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  let variantStyle = "";
  switch (variant) {
    case "outline":
      variantStyle =
        "border border-input hover:bg-accent hover:text-accent-foreground";
      break;
    case "ghost":
      variantStyle = "hover:bg-accent hover:text-accent-foreground";
      break;
    default: // primary / default
      variantStyle = "bg-primary text-primary-foreground hover:bg-primary/90";
  }
  const sizeStyle = size === "sm" ? "h-9 px-3" : "h-10 py-2 px-4";

  if (asChild)
    return React.cloneElement(children, {
      className: `${baseStyle} ${variantStyle} ${sizeStyle} ${className || ""}`,
      ...props,
    });
  return (
    <button
      className={`${baseStyle} ${variantStyle} ${sizeStyle} ${className || ""}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// Placeholders for shadcn/ui Table Components
const Table = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableElement>) => (
  <div className="w-full overflow-auto">
    <table
      className={`w-full caption-bottom text-sm ${className}`}
      {...props}
    />
  </div>
);
const TableHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={`[&_tr]:border-b ${className}`} {...props} />
);
const TableRow = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr
    className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${className}`}
    {...props}
  />
);
const TableHead = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableCellElement>) => (
  <th
    className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className}`}
    {...props}
  />
);
const TableBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={`[&_tr:last-child]:border-0 ${className}`} {...props} />
);
const TableCell = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableCellElement>) => (
  <td
    className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}
    {...props}
  />
);

// Placeholders for shadcn/ui DropdownMenu
const DropdownMenu = ({ children }: { children: React.ReactNode }) => (
  <div className="relative inline-block text-left">{children}</div>
);
const DropdownMenuTrigger = ({
  children,
  asChild,
}: {
  children: React.ReactNode;
  asChild?: boolean;
}) => (asChild ? children : <div>{children}</div>); // Simplified
const DropdownMenuContent = ({ children }: { children: React.ReactNode }) => (
  <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 p-1">
    {children}
  </div>
); // Basic styling
const DropdownMenuItem = ({ children }: { children: React.ReactNode }) => (
  <a
    href="#"
    className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
  >
    {children}
  </a>
); // Basic styling

// Placeholder for shadcn/ui Input
const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
});
Input.displayName = "Input";

interface Report {
  id: number;
  ladlePassportNumber: string;
  meltDetails: string;
  arrivalDate: Date;
  pouringHandoverDateTime: Date;
  operatorName: string;
}

const mockReports: Report[] = [
  {
    id: 1,
    ladlePassportNumber: "№ 29 - 27 Тн",
    meltDetails:
      "на плавку № 153210 УНРС: 3 начало: 30/05/25 05:05 Стойкость ПК 4",
    arrivalDate: new Date("2025-05-28T09:21:00"),
    pouringHandoverDateTime: new Date("2025-05-29T21:30:00"),
    operatorName: "Ефремов М.Б.",
  },
  {
    id: 2,
    ladlePassportNumber: "№ 30 - 28 Тн",
    meltDetails:
      "на плавку № 153211 УНРС: 2 начало: 30/05/25 08:15 Стойкость ПК 3",
    arrivalDate: new Date("2025-05-28T11:45:00"),
    pouringHandoverDateTime: new Date("2025-05-30T01:20:00"),
    operatorName: "Комилов А.С.",
  },
  {
    id: 3,
    ladlePassportNumber: "№ 31 - 29 Тн",
    meltDetails:
      "на плавку № 153212 УНРС: 1 начало: 30/05/25 12:30 Стойкость ПК 5",
    arrivalDate: new Date("2025-05-29T08:10:00"),
    pouringHandoverDateTime: new Date("2025-05-30T15:45:00"),
    operatorName: "Матюшев П.Д.",
  },
];

export default function ReportsPage() {
  const formatDate = (date: Date) =>
    format(date, "dd.MM.yyyy HH:mm", { locale: ru });

  // Define Tailwind classes for elements used by shadcn/ui-like components
  const primaryButtonClasses = "bg-blue-600 text-white hover:bg-blue-700";
  const outlineButtonClasses =
    "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50";
  const ghostButtonClasses =
    "text-slate-700 hover:bg-slate-100 hover:text-slate-800";
  const inputClasses =
    "bg-white border-slate-300 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500";
  const tableHeadClasses =
    "text-xs font-semibold uppercase text-slate-500 bg-slate-50";
  const tableCellClasses = "py-3 px-4 text-sm text-slate-600";

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-slate-800">
          Отчеты по промковшам
        </h1>
        <Link
          href="/reports/new"
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all text-sm ${primaryButtonClasses}`}
        >
          <PlusCircle className="h-5 w-5" />
          Новый отчет
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center p-4 bg-white rounded-lg shadow">
        <div className="relative flex-grow w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Поиск по номеру промковша или плавки..."
            className={`pl-10 pr-3 py-2 w-full ${inputClasses}`}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={`w-full md:w-auto ${outlineButtonClasses}`}
            >
              <FilterIcon className="h-4 w-4 mr-2" />
              Фильтры
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {" "}
            {/* Styled by placeholder component */}
            <DropdownMenuItem>За сегодня</DropdownMenuItem>
            <DropdownMenuItem>За неделю</DropdownMenuItem>
            <DropdownMenuItem>За месяц</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-xl shadow-xl overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b-slate-200">
              <TableHead className={tableHeadClasses}>№ Промковша</TableHead>
              <TableHead className={tableHeadClasses}>Детали плавки</TableHead>
              <TableHead className={`hidden md:table-cell ${tableHeadClasses}`}>
                <div className="flex items-center gap-1.5">
                  {" "}
                  <Calendar className="h-4 w-4" /> Прибытие{" "}
                </div>
              </TableHead>
              <TableHead className={`hidden lg:table-cell ${tableHeadClasses}`}>
                <div className="flex items-center gap-1.5">
                  {" "}
                  <Calendar className="h-4 w-4" /> Разливка{" "}
                </div>
              </TableHead>
              <TableHead className={`hidden sm:table-cell ${tableHeadClasses}`}>
                Оператор
              </TableHead>
              <TableHead className={`text-right ${tableHeadClasses}`}>
                Действия
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockReports.map((report) => (
              <TableRow
                key={report.id}
                className="hover:bg-slate-50 transition-colors"
              >
                <TableCell
                  className={`font-medium text-slate-700 ${tableCellClasses}`}
                >
                  {report.ladlePassportNumber}
                </TableCell>
                <TableCell className={`max-w-xs truncate ${tableCellClasses}`}>
                  {report.meltDetails}
                </TableCell>
                <TableCell
                  className={`hidden md:table-cell ${tableCellClasses}`}
                >
                  {formatDate(report.arrivalDate)}
                </TableCell>
                <TableCell
                  className={`hidden lg:table-cell ${tableCellClasses}`}
                >
                  {formatDate(report.pouringHandoverDateTime)}
                </TableCell>
                <TableCell
                  className={`hidden sm:table-cell ${tableCellClasses}`}
                >
                  {report.operatorName}
                </TableCell>
                <TableCell className={`text-right ${tableCellClasses}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className={`${ghostButtonClasses} !px-2 !py-1`}
                  >
                    <Link
                      href={`/reports/${report.id}`}
                      className="flex items-center gap-1.5"
                    >
                      <FileText className="h-4 w-4" />
                      <span className="hidden sm:inline">Просмотр</span>
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end gap-4 pt-4">
        <Button
          variant="outline"
          size="sm"
          disabled
          className={outlineButtonClasses}
        >
          Назад
        </Button>
        <Button variant="outline" size="sm" className={outlineButtonClasses}>
          Вперед
        </Button>
      </div>
    </div>
  );
}
