"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Pagination } from "@/components/ui/pagination";

interface UrlPaginationProps {
  currentPage: number;
  totalPages: number;
  className?: string;
}

export function UrlPagination({
  currentPage,
  totalPages,
  className,
}: UrlPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handlePageChange(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  }

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      className={className}
    />
  );
}
