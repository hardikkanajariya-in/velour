export interface User {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  avatar: string | null;
  role: 'CUSTOMER' | 'ADMIN';
  loyaltyPoints: number;
  dateOfBirth: string | null;
  gender: string | null;
  createdAt: string;
}

export interface Address {
  id: string;
  userId: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}
