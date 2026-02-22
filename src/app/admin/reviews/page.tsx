"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { Spinner } from "@/components/ui/spinner";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

interface ReviewItem {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  isApproved: boolean;
  createdAt: string;
  user: { name: string | null; email: string } | null;
  product: { name: string } | null;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    try {
      const res = await fetch("/api/admin/reviews");
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews ?? []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function toggleApproval(id: string, approved: boolean) {
    try {
      await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isApproved: !approved }),
      });
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, isApproved: !approved } : r)),
      );
      toast.success("Updated");
    } catch {
      toast.error("Failed");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl sm:text-2xl font-heading font-bold">Reviews</h1>

      <DataTable
        columns={[
          {
            key: "product",
            label: "Product",
            render: (item) =>
              (item.product as { name: string } | null)?.name ?? "N/A",
          },
          {
            key: "user",
            label: "Customer",
            render: (item) =>
              (item.user as { name: string | null } | null)?.name ??
              "Anonymous",
          },
          {
            key: "rating",
            label: "Rating",
            render: (item) => (
              <Rating value={item.rating as number} size="sm" />
            ),
          },
          {
            key: "body",
            label: "Review",
            render: (item) => (
              <p className="text-sm max-w-xs truncate">{item.body as string}</p>
            ),
          },
          {
            key: "isApproved",
            label: "Status",
            render: (item) => (
              <button
                onClick={() =>
                  toggleApproval(item.id as string, item.isApproved as boolean)
                }
              >
                <Badge variant={item.isApproved ? "success" : "warning"}>
                  {item.isApproved ? "Approved" : "Pending"}
                </Badge>
              </button>
            ),
          },
          {
            key: "createdAt",
            label: "Date",
            render: (item) => formatDate(item.createdAt as string),
          },
        ]}
        data={reviews as unknown as Record<string, unknown>[]}
        emptyMessage="No reviews yet"
      />
    </div>
  );
}
