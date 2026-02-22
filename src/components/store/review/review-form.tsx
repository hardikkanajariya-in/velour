'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

interface ReviewFormProps {
  productId: string;
  onSuccess?: () => void;
}

export function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, rating, title, comment }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Failed to submit review');
      }

      toast.success('Review submitted successfully!');
      setRating(0);
      setTitle('');
      setComment('');
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-0.5"
            >
              <Star
                className={cn(
                  'h-6 w-6 transition-colors',
                  (hoverRating || rating) >= star
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-border'
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="review-title" className="block text-sm font-medium mb-1.5">
          Title
        </label>
        <input
          id="review-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your experience"
          className="w-full px-3 py-2.5 text-sm border rounded-button focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
          required
        />
      </div>

      <div>
        <label htmlFor="review-comment" className="block text-sm font-medium mb-1.5">
          Review
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tell us more about your experience"
          rows={4}
          className="w-full px-3 py-2.5 text-sm border rounded-button focus:outline-none focus:ring-2 focus:ring-brand-accent/50 resize-none"
          required
        />
      </div>

      <Button type="submit" isLoading={isSubmitting}>
        Submit Review
      </Button>
    </form>
  );
}
