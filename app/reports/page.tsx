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
  ArrowUpNarrowWide,
  ArrowDownWideNarrow,
} from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSession } from "next-auth/react"; // Import useSession

// --- Re-using your existing UI components ---
// Button, Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
// DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, Input
// (Assuming these are defined correctly above or imported from elsewhere)
// For brevity, I'm omitting their full definitions here, but they should be present in your file.

// --- Helper UI Components (from your code) ---
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
    default:
      variantStyle = "bg-blue-600 text-white hover:bg-blue-700";
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
      {" "}
      {children}{" "}
    </button>
  );
};

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
      {React.Children.map(children, (child) => {
        if (
          React.isValidElement(child) &&
          (child.type as any).displayName === "DropdownMenuTrigger"
        ) {
          return React.cloneElement(child, {
            onClick: () => setIsOpen(!isOpen),
            ref: triggerRef,
          } as React.HTMLProps<HTMLElement>);
        }
        return null;
      })}
      {isOpen && (
        <div
          ref={contentRef}
          className="origin-top-right absolute right-0 mt-2 w-58 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 p-1"
        >
          {React.Children.map(children, (child) => {
            if (
              React.isValidElement(child) &&
              (child.type as any).displayName === "DropdownMenuContent"
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

const DropdownMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  { children: React.ReactNode; asChild?: boolean; onClick?: () => void }
>(({ children, asChild, onClick, ...props }, ref) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...(onClick ? { onClick } : {}),
      ...props,
      ...(ref ? { ref } : {}),
    });
  }
  return (
    <button ref={ref} onClick={onClick} {...props}>
      {" "}
      {children}{" "}
    </button>
  );
});
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

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
            onClick: () => {
              (child.props as any).onClick?.();
              onClose?.();
            },
          } as React.HTMLProps<HTMLElement>)
        : child
    )}
  </div>
);
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = ({
  children,
  onClick,
  className,
  ...props
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) => (
  <button
    onClick={onClick}
    className={`block w-full text-left px-2 py-2 text-sm text-gray-700 border-b rounded-b-none last:border-0 hover:bg-gray-100 rounded-md cursor-pointer ${className}`}
    {...props}
  >
    {children}
  </button>
);
DropdownMenuItem.displayName = "DropdownMenuItem";

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

// --- Report Interface ---
interface Report {
  id: number;
  ladlePassportNumber: string;
  arrivalDate: string;
  pouringHandoverDateTime: string;
  operatorName: string;
  meltNumber: string;
  meltUnrs: string;
  meltStartDateTime: string;
  meltLadleStability: number;
}

// --- Main ReportsPage Component ---
export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "today" | "week" | "month">(
    "all"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalReportsCount, setTotalReportsCount] = useState(0);
  const [sortBy, setSortBy] = useState<keyof Report>("arrivalDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const itemsPerPage = 5;

  // Use useSession to get user's session data, including the role
  const { data: session, status } = useSession();

  // Helper to determine if the user is a REPORTER
  const isReporter =
    status === "authenticated" && (session?.user as any)?.role === "REPORTER";

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    return format(date, "dd.MM.yyyy HH:mm", { locale: ru });
  };

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const offset = (currentPage - 1) * itemsPerPage;
      const response = await axios.get("/api/reports", {
        params: {
          limit: itemsPerPage,
          offset: offset,
          search: searchTerm,
          filter: filter,
          sortBy: sortBy,
          sortOrder: sortOrder,
        },
      });

      const fetchedReports: Report[] = response.data.reports.map(
        (report: any) => ({
          id: report.id,
          ladlePassportNumber: report.ladlePassportNumber,
          arrivalDate: report.arrivalDate,
          pouringHandoverDateTime: report.pouringHandoverDateTime,
          operatorName: report.operatorName,
          meltNumber: report.meltNumber,
          meltUnrs: report.meltUnrs,
          meltStartDateTime: report.meltStartDateTime,
          meltLadleStability: report.meltLadleStability,
        })
      );

      setReports(fetchedReports);
      setTotalReportsCount(response.data.totalReports);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
      setError("Не удалось загрузить отчеты. Попробуйте еще раз.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchTerm, filter, sortBy, sortOrder]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const totalPages = Math.ceil(totalReportsCount / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleFilterChange = (
    newFilter: "all" | "today" | "week" | "month"
  ) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handleSortChange = (field: keyof Report) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setCurrentPage(1);
  };

  const getFilterLabel = (currentFilter: typeof filter) => {
    switch (currentFilter) {
      case "today":
        return "За сегодня";
      case "week":
        return "За неделю";
      case "month":
        return "За месяц";
      default:
        return "Все отчеты";
    }
  };

  const getSortLabel = (currentSortBy: keyof Report) => {
    switch (currentSortBy) {
      case "ladlePassportNumber":
        return "№ Промковша";
      case "meltNumber":
        return "№ Плавка";
      case "operatorName":
        return "Оператор";
      case "arrivalDate":
      default:
        return "Дата прибытия";
    }
  };

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
        {/* Conditional rendering of the "Новый отчет" button */}
        {isReporter && (
          <Link
            href="/reports/new"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all text-sm ${primaryButtonClasses}`}
          >
            <PlusCircle className="h-5 w-5" />
            Новый отчет
          </Link>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center p-4 bg-white rounded-lg shadow">
        <div className="relative flex-grow w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Поиск по номеру промковша или плавки..."
            className={`pl-10 pr-3 py-2 w-full ${inputClasses}`}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={`w-full md:w-auto ${outlineButtonClasses}`}
            >
              <FilterIcon className="h-4 w-4 mr-2" />
              {getFilterLabel(filter)} {/* Display current filter */}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => handleFilterChange("all")}
              className={filter === "all" ? "bg-gray-100 font-semibold" : ""}
            >
              Все отчеты
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleFilterChange("today")}
              className={filter === "today" ? "bg-gray-100 font-semibold" : ""}
            >
              За сегодня
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleFilterChange("week")}
              className={filter === "week" ? "bg-gray-100 font-semibold" : ""}
            >
              За неделю
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleFilterChange("month")}
              className={filter === "month" ? "bg-gray-100 font-semibold" : ""}
            >
              За месяц
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={`w-full md:w-auto ${outlineButtonClasses}`}
            >
              {sortOrder === "desc" ? (
                <ArrowDownWideNarrow className="h-4 w-4 mr-2" />
              ) : (
                <ArrowUpNarrowWide className="h-4 w-4 mr-2" />
              )}
              {getSortLabel(sortBy)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => handleSortChange("arrivalDate")}
              className={
                sortBy === "arrivalDate" ? "bg-gray-100 font-semibold" : ""
              }
            >
              Дата прибытия{" "}
              {sortBy === "arrivalDate" &&
                (sortOrder === "asc" ? (
                  <ArrowUpNarrowWide className="ml-2 h-4 w-4 inline" />
                ) : (
                  <ArrowDownWideNarrow className="ml-2 h-4 w-4 inline" />
                ))}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleSortChange("ladlePassportNumber")}
              className={
                sortBy === "ladlePassportNumber"
                  ? "bg-gray-100 font-semibold"
                  : ""
              }
            >
              № Промковша{" "}
              {sortBy === "ladlePassportNumber" &&
                (sortOrder === "asc" ? (
                  <ArrowUpNarrowWide className="ml-2 h-4 w-4 inline" />
                ) : (
                  <ArrowDownWideNarrow className="ml-2 h-4 w-4 inline" />
                ))}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleSortChange("meltNumber")}
              className={
                sortBy === "meltNumber" ? "bg-gray-100 font-semibold" : ""
              }
            >
              № Плавка{" "}
              {sortBy === "meltNumber" &&
                (sortOrder === "asc" ? (
                  <ArrowUpNarrowWide className="ml-2 h-4 w-4 inline" />
                ) : (
                  <ArrowDownWideNarrow className="ml-2 h-4 w-4 inline" />
                ))}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleSortChange("operatorName")}
              className={
                sortBy === "operatorName" ? "bg-gray-100 font-semibold" : ""
              }
            >
              Оператор{" "}
              {sortBy === "operatorName" &&
                (sortOrder === "asc" ? (
                  <ArrowUpNarrowWide className="ml-2 h-4 w-4 inline" />
                ) : (
                  <ArrowDownWideNarrow className="ml-2 h-4 w-4 inline" />
                ))}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

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
                  <Calendar className="h-4 w-4" /> Прибытие{" "}
                </div>
              </TableHead>
              <TableHead className={`hidden lg:table-cell ${tableHeadClasses}`}>
                <div className="flex items-center gap-1.5">
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Загрузка отчетов...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-red-500"
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : reports.length > 0 ? (
              reports.map((report) => (
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
                    {`Плавка № ${report.meltNumber} УНРС: ${
                      report.meltUnrs
                    } начало: ${formatDate(
                      report.meltStartDateTime
                    )} Стойкость ПК ${report.meltLadleStability}`}
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

      <div className="flex items-center justify-end gap-4 pt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
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
          disabled={currentPage === totalPages || totalPages === 0 || loading}
          className={outlineButtonClasses}
        >
          Вперед
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
