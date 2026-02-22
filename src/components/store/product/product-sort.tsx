"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { SORT_OPTIONS } from "@/lib/constants";

export function ProductSort() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") ?? "";

  function handleSort(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="sort"
        className="text-sm text-muted-foreground whitespace-nowrap"
      >
        Sort by:
      </label>
      <select
        id="sort"
        value={currentSort}
        onChange={(e) => handleSort(e.target.value)}
        className="text-sm border border-border rounded-button px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/50 min-h-[44px]"
      >
        <option value="">Relevance</option>
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
