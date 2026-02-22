import { Star, ThumbsUp, User } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { Rating } from '@/components/ui/rating';
import type { Review } from '@/types/review';

interface ReviewListProps {
  reviews: Review[];
  averageRating?: number;
  totalReviews?: number;
}

export function ReviewList({ reviews, averageRating = 0, totalReviews = 0 }: ReviewListProps) {
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percentage: totalReviews > 0
      ? (reviews.filter((r) => r.rating === star).length / totalReviews) * 100
      : 0,
  }));

  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="text-center md:text-left">
          <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
          <div className="mt-1">
            <Rating value={averageRating} />
          </div>
          <p className="text-sm text-muted-foreground mt-1">{totalReviews} review{totalReviews !== 1 ? 's' : ''}</p>
        </div>

        <div className="flex-1 space-y-1.5 min-w-[200px]">
          {distribution.map((d) => (
            <div key={d.star} className="flex items-center gap-2">
              <span className="text-sm w-6 text-right">{d.star}</span>
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all"
                  style={{ width: `${d.percentage}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-8">{d.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="divide-y">
        {reviews.map((review) => (
          <div key={review.id} className="py-5 first:pt-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">{review.user?.name ?? 'Anonymous'}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</p>
                </div>
              </div>
              <Rating value={review.rating} size="sm" />
            </div>

            {review.title && (
              <h4 className="font-medium mt-3">{review.title}</h4>
            )}
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              {review.body}
            </p>

            {review.isVerified && (
              <span className="inline-flex items-center gap-1 text-xs text-green-600 mt-2">
                ✓ Verified Purchase
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
