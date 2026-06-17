import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number; // 0-indexed
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
  className?: string;
}
export default function PaginationControl({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
  className = "",
}: PaginationControlsProps) {
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];

    if (totalPages <= maxVisiblePages) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(0);
    if (currentPage > 2) pages.push("...");

    let start = Math.max(1, currentPage - 1);
    let end = Math.min(totalPages - 2, currentPage + 1);
    if (currentPage <= 2) end = Math.min(3, totalPages - 2);
    if (currentPage >= totalPages - 3) start = Math.max(1, totalPages - 4);

    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 3) pages.push("...");
    pages.push(totalPages - 1);

    return pages;
  };
  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages && newPage !== currentPage) {
      onPageChange(newPage);
    }
  };
  if (totalPages <= 1) return null;
  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-center pt-6 border-t border-gray-200 gap-4 ${className}`}
    >
      <div className="flex items-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
          aria-label="Previous page"
          className={`flex items-center justify-center w-9 h-9 rounded-md border ${
            currentPage === 0
              ? "text-gray-400 border-gray-200 cursor-not-allowed"
              : "text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
          }`}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((pageNum, index) =>
            pageNum === "..." ? (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-muted-foreground"
              >
                ...
              </span>
            ) : (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum as number)}
                aria-current={currentPage === pageNum ? "page" : undefined}
                className={`flex items-center justify-center min-w-9 h-9 px-2 rounded-md text-sm font-medium ${
                  currentPage === pageNum
                    ? "bg-primary text-white border border-primary"
                    : "text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {(pageNum as number) + 1}
              </button>
            ),
          )}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1 || totalPages === 0}
          aria-label="Next page"
          className={`flex items-center justify-center w-9 h-9 rounded-md border ${
            currentPage === totalPages - 1 || totalPages === 0
              ? "text-gray-400 border-gray-200 cursor-not-allowed"
              : "text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
          }`}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="text-sm text-muted-foreground">
        Page {currentPage + 1} of {totalPages}
      </div>
    </div>
  );
}
