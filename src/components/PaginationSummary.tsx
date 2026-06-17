import React from "react";
interface PaginationSummaryProps {
  currentPage: number; // 0-indexed
  pageSize: number;
  totalElements: number;
  itemCount: number;
  itemLabel?: string;
  className?: string;
}
export default function PaginationSummary({
  currentPage,
  pageSize,
  totalElements,
  itemCount,
  itemLabel = "items",
  className = "",
}: PaginationSummaryProps) {
  if (itemCount === 0) return null;
  const start = Math.min(currentPage * pageSize + 1, totalElements);
  const end = Math.min((currentPage + 1) * pageSize, totalElements);
  return (
    <div className={`text-sm text-muted-foreground ${className}`}>
      Showing {start} - {end} of {totalElements} {itemLabel}
    </div>
  );
}
