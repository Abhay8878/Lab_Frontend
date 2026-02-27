import strings from "../language";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "../language/useLanguage";
 
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}
 
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: PaginationProps) {
  // ✅ Hook MUST be at top level (not after condition)
  const { language } = useLanguage();
  const t = strings[language];
 
  // ✅ If only 1 page, do not render
  if (totalPages <= 0) return null;
 
  /* ---------- PAGE NUMBERS LOGIC ---------- */
  const getPageNumbers = (): (number | "...")[] => {
    const pages: (number | "...")[] = [];
 
    if (totalPages <= 4) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
 
    if (currentPage <= 3) {
      pages.push(1, 2, 3);
      pages.push("...");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push("...");
      pages.push(totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1);
      pages.push("...");
      pages.push(currentPage - 1, currentPage, currentPage + 1);
      pages.push("...");
      pages.push(totalPages);
    }
 
    return pages;
  };
 
  const pageNumbers = getPageNumbers();
 
  // ✅ Safe navigation
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };
 
  return (
    <div
      className={`flex items-center justify-center w-full py-4 ${className}`}
    >
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Previous */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center gap-1 px-3 py-2 text-sm transition-colors duration-200
            ${
              currentPage === 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-500 hover:text-gray-800"
            }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline font-medium">
            {t.previous}
          </span>
        </button>
 
        {/* Page numbers */}
        <div className="flex items-center">
          {pageNumbers.map((pageNum, idx) =>
            pageNum === "..." ? (
              <span
                key={`ellipsis-${idx}`}
                className="w-10 h-10 flex items-center justify-center text-gray-400 font-bold"
              >
                ...
              </span>
            ) : (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={`w-10 h-10 flex items-center justify-center text-sm font-semibold rounded-lg transition-all
                  ${
                    pageNum === currentPage
                      ? "bg-white border border-gray-100 shadow-sm text-gray-900"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
              >
                {pageNum}
              </button>
            )
          )}
        </div>
 
        {/* Next */}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center gap-1 px-3 py-2 text-sm transition-colors duration-200
            ${
              currentPage === totalPages
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-500 hover:text-gray-800"
            }`}
        >
          <span className="hidden sm:inline font-medium">
            {t.next}
          </span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
