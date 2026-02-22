export interface Coupon {
  id: string;
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  minOrderValue: number | null;
  maxDiscount: number | null;
  usageLimit: number | null;
  usedCount: number;
  perUserLimit: number | null;
  isActive: boolean;
  validFrom: string;
  validUntil: string;
  applicableGender: string | null;
  firstOrderOnly: boolean;
}
