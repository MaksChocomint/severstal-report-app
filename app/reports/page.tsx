// app/reports/page.tsx
"use client";
import Link from "next/link";
import {
  Search,
  PlusCircle,
  FileText,
  Calendar,
  Filter as FilterIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"; // Renamed Filter to FilterIcon
import { format, isToday, isThisWeek, isThisMonth } from "date-fns"; // Added date-fns functions
import { ru } from "date-fns/locale";
import React, { useState, useMemo } from "react"; // Added useState, useMemo

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
      variantStyle = "bg-blue-600 text-white hover:bg-blue-700"; // Adjusted for clarity
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
  colSpan,
  ...props
}: React.HTMLAttributes<HTMLTableCellElement> & { colSpan?: number }) => (
  <td
    className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}
    colSpan={colSpan}
    {...props}
  />
);

// Placeholders for shadcn/ui DropdownMenu (with state for open/close)
const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        contentRef.current &&
        !contentRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left">
      {/* Trigger */}
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === DropdownMenuTrigger) {
          return React.cloneElement(child, {
            onClick: () => setIsOpen(!isOpen),
            ref: triggerRef, // Attach ref to trigger
          } as React.HTMLProps<HTMLElement>);
        }
        return null;
      })}

      {/* Content */}
      {isOpen && (
        <div
          ref={contentRef}
          className="origin-top-right absolute right-0 mt-2 w-58 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 p-1"
        >
          {React.Children.map(children, (child) => {
            if (
              React.isValidElement(child) &&
              child.type === DropdownMenuContent
            ) {
              return React.cloneElement(child, {
                onClose: () => setIsOpen(false),
              } as React.HTMLProps<HTMLElement>);
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};

const DropdownMenuTrigger = ({
  children,
  asChild,
  onClick,
  ...props
}: {
  children: React.ReactNode;
  asChild?: boolean;
  onClick?: () => void;
}) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...(onClick ? { onClick } : {}),
      ...props,
    });
  }
  return (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  );
};

const DropdownMenuContent = ({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose?: () => void;
}) => (
  <div className="w-56 rounded-md shadow-lg">
    {React.Children.map(children, (child) =>
      React.isValidElement(child)
        ? React.cloneElement(child, {
            onClick: onClose,
          } as React.HTMLProps<HTMLElement>)
        : child
    )}
  </div>
);

const DropdownMenuItem = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="block w-full text-left px-2 py-2 text-sm text-gray-700 border-b rounded-b-none last:border-0 hover:bg-gray-100 rounded-md cursor-pointer"
  >
    {children}
  </button>
);

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

// Updated Report interface to reflect the new structure (remove meltDetails)
interface Report {
  id: number;
  ladlePassportNumber: string;
  // Removed meltDetails as it's no longer a direct property
  arrivalDate: Date;
  pouringHandoverDateTime: Date;
  operatorName: string;
  // Add these fields to match your new Prisma schema for display purposes
  pour1MeltNumber: string;
  pour1Unrs: string;
  pour1StartDateTime: Date;
  pour1LadleStability: number;
}

const mockReports: Report[] = [
  {
    id: 1,
    ladlePassportNumber: "№ 29 - 27 Тн",
    pour1MeltNumber: "153210",
    pour1Unrs: "3",
    pour1StartDateTime: new Date("2025-05-30T05:05:00"),
    pour1LadleStability: 4,
    arrivalDate: new Date("2025-05-28T09:21:00"),
    pouringHandoverDateTime: new Date("2025-05-29T21:30:00"),
    operatorName: "Ефремов М.Б.",
  },
  {
    id: 2,
    ladlePassportNumber: "№ 30 - 28 Тн",
    pour1MeltNumber: "153211",
    pour1Unrs: "2",
    pour1StartDateTime: new Date("2025-05-30T08:15:00"),
    pour1LadleStability: 3,
    arrivalDate: new Date("2025-05-28T11:45:00"),
    pouringHandoverDateTime: new Date("2025-05-30T01:20:00"),
    operatorName: "Комилов А.С.",
  },
  {
    id: 3,
    ladlePassportNumber: "№ 31 - 29 Тн",
    pour1MeltNumber: "153212",
    pour1Unrs: "1",
    pour1StartDateTime: new Date("2025-05-30T12:30:00"),
    pour1LadleStability: 5,
    arrivalDate: new Date("2025-05-29T08:10:00"),
    pouringHandoverDateTime: new Date("2025-05-30T15:45:00"),
    operatorName: "Матюшев П.Д.",
  },
  {
    id: 4,
    ladlePassportNumber: "№ 32 - 30 Тн",
    pour1MeltNumber: "153213",
    pour1Unrs: "4",
    pour1StartDateTime: new Date("2025-05-31T01:00:00"), // Today
    pour1LadleStability: 2,
    arrivalDate: new Date("2025-05-30T10:00:00"),
    pouringHandoverDateTime: new Date("2025-05-31T03:00:00"),
    operatorName: "Иванов И.И.",
  },
  {
    id: 5,
    ladlePassportNumber: "№ 33 - 31 Тн",
    pour1MeltNumber: "153214",
    pour1Unrs: "5",
    pour1StartDateTime: new Date("2025-05-27T10:00:00"), // Last week (depends on current week)
    pour1LadleStability: 6,
    arrivalDate: new Date("2025-05-26T09:00:00"),
    pouringHandoverDateTime: new Date("2025-05-27T12:00:00"),
    operatorName: "Петров П.П.",
  },
  {
    id: 6,
    ladlePassportNumber: "№ 34 - 32 Тн",
    pour1MeltNumber: "153215",
    pour1Unrs: "6",
    pour1StartDateTime: new Date("2025-04-15T10:00:00"), // Last month (depends on current month)
    pour1LadleStability: 7,
    arrivalDate: new Date("2025-04-14T09:00:00"),
    pouringHandoverDateTime: new Date("2025-04-15T12:00:00"),
    operatorName: "Сидоров С.С.",
  },
];

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "today" | "week" | "month">(
    "all"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of reports per page

  const formatDate = (date: Date) =>
    format(date, "dd.MM.yyyy HH:mm", { locale: ru });

  // Filtered and Paginated Reports
  const filteredReports = useMemo(() => {
    let tempReports = mockReports;

    // Apply search filter
    if (searchTerm) {
      tempReports = tempReports.filter(
        (report) =>
          report.ladlePassportNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          report.pour1MeltNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Apply date filter
    if (filter === "today") {
      tempReports = tempReports.filter((report) =>
        isToday(report.pouringHandoverDateTime)
      );
    } else if (filter === "week") {
      tempReports = tempReports.filter((report) =>
        isThisWeek(report.pouringHandoverDateTime, { weekStartsOn: 1 })
      ); // Monday as start of week
    } else if (filter === "month") {
      tempReports = tempReports.filter((report) =>
        isThisMonth(report.pouringHandoverDateTime)
      );
    }

    return tempReports;
  }, [searchTerm, filter]);

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const paginatedReports = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredReports.slice(startIndex, endIndex);
  }, [filteredReports, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
            <DropdownMenuItem onClick={() => setFilter("all")}>
              Все отчеты
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("today")}>
              За сегодня
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("week")}>
              За неделю
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("month")}>
              За месяц
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-xl shadow-xl overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b-slate-200">
              <TableHead className={tableHeadClasses}>№ Промковша</TableHead>
              <TableHead className={tableHeadClasses}>
                Детали первой разливки
              </TableHead>
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
            {paginatedReports.length > 0 ? (
              paginatedReports.map((report) => (
                <TableRow
                  key={report.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <TableCell
                    className={`font-medium text-slate-700 ${tableCellClasses}`}
                  >
                    {report.ladlePassportNumber}
                  </TableCell>
                  <TableCell
                    className={`max-w-xs truncate ${tableCellClasses}`}
                  >
                    {`Плавка № ${report.pour1MeltNumber} УНРС: ${
                      report.pour1Unrs
                    } начало: ${formatDate(
                      report.pour1StartDateTime
                    )} Стойкость ПК ${report.pour1LadleStability}`}
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
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-slate-500"
                >
                  Нет отчетов, соответствующих вашим критериям.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end gap-4 pt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={outlineButtonClasses}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Назад
        </Button>
        <span className="text-sm text-slate-700">
          Страница {currentPage} из {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className={outlineButtonClasses}
        >
          Вперед
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
