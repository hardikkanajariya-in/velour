export interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image: string;
  mobileImage: string | null;
  link: string | null;
  position: 'HERO' | 'PROMO' | 'STRIP' | 'SIDEBAR';
  order: number;
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
}
