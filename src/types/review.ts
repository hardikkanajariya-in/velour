export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title: string | null;
  body: string;
  images: string[];
  isVerified: boolean;
  isApproved: boolean;
  isHelpful: number;
  adminReply: string | null;
  createdAt: string;
  user?: {
    id: string;
    name: string | null;
    avatar: string | null;
  };
}

export interface RatingBreakdown {
  average: number;
  total: number;
  distribution: Record<number, number>;
}
