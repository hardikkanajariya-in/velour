export interface AnalyticsOverview {
  totalRevenue: number;
  totalOrders: number;
  newCustomers: number;
  pendingOrders: number;
  revenueGrowth: number;
  ordersGrowth: number;
  customersGrowth: number;
  averageOrderValue: number;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  id: string;
  name: string;
  image: string;
  unitsSold: number;
  revenue: number;
}

export interface OrderStatusBreakdown {
  status: string;
  count: number;
}
