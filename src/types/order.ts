export interface OrderItem {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
  price: number;
  productName: string;
  size: string;
  color: string;
  image: string;
}

export interface OrderTimeline {
  id: string;
  status: string;
  message: string;
  createdAt: string;
}

export interface Refund {
  id: string;
  amount: number;
  reason: string;
  status: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string | null;
  guestEmail: string | null;
  guestName: string | null;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode: string | null;
  shippingCost: number;
  tax: number;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  shippingAddress: {
    fullName: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  trackingNumber: string | null;
  trackingUrl: string | null;
  estimatedDelivery: string | null;
  notes: string | null;
  adminNotes: string | null;
  timeline: OrderTimeline[];
  refunds: Refund[];
  createdAt: string;
  updatedAt: string;
  user?: { id: string; name: string | null; email: string } | null;
}
