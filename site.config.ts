export const siteConfig = {
  brand: {
    name: "VELOUR",
    tagline: "Wear the Story",
    logo: "/images/logo.svg",
    description:
      "Premium branded clothing for men, women, and kids. Discover curated fashion that tells your story.",
    founded: "2024",
    email: "hello@velour.in",
    phone: "+91 98765 43210",
    address: "123 Fashion Street, Mumbai, Maharashtra 400001, India",
  },
  seo: {
    titleTemplate: "%s | VELOUR — Wear the Story",
    defaultDescription:
      "Shop premium fashion for men, women, and kids at VELOUR. Curated collections from top brands with free shipping above ₹1,999.",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    ogImage: "/images/og-default.jpg",
  },
  social: {
    instagram: "https://instagram.com/velour.style",
    facebook: "https://facebook.com/velour.style",
    pinterest: "https://pinterest.com/velour_style",
    youtube: "https://youtube.com/@velour.style",
    twitter: "https://twitter.com/velour_style",
  },
  navigation: {
    header: [
      {
        labelKey: "Shop",
        href: "/products",
        children: [
          {
            labelKey: "Men",
            href: "/category/men",
            children: [
              { labelKey: "T-Shirts", href: "/category/t-shirts-men" },
              { labelKey: "Shirts", href: "/category/shirts-men" },
              { labelKey: "Trousers", href: "/category/trousers-men" },
              { labelKey: "Jeans", href: "/category/jeans-men" },
              { labelKey: "Jackets", href: "/category/jackets-men" },
              { labelKey: "Suits", href: "/category/suits-men" },
              { labelKey: "Ethnic Wear", href: "/category/ethnic-wear-men" },
              { labelKey: "Activewear", href: "/category/activewear-men" },
            ],
          },
          {
            labelKey: "Women",
            href: "/category/women",
            children: [
              { labelKey: "Tops", href: "/category/tops-women" },
              { labelKey: "Dresses", href: "/category/dresses-women" },
              { labelKey: "Sarees", href: "/category/sarees-women" },
              { labelKey: "Kurtas", href: "/category/kurtas-women" },
              { labelKey: "Jeans", href: "/category/jeans-women" },
              { labelKey: "Trousers", href: "/category/trousers-women" },
              { labelKey: "Jackets", href: "/category/jackets-women" },
              { labelKey: "Ethnic Wear", href: "/category/ethnic-wear-women" },
              { labelKey: "Activewear", href: "/category/activewear-women" },
            ],
          },
          {
            labelKey: "Kids",
            href: "/category/kids",
            children: [
              { labelKey: "Boys (2-8y)", href: "/category/boys-2-8" },
              { labelKey: "Boys (9-14y)", href: "/category/boys-9-14" },
              { labelKey: "Girls (2-8y)", href: "/category/girls-2-8" },
              { labelKey: "Girls (9-14y)", href: "/category/girls-9-14" },
              { labelKey: "Infant (0-2y)", href: "/category/infant" },
            ],
          },
          {
            labelKey: "Accessories",
            href: "/category/accessories",
            children: [
              { labelKey: "Bags", href: "/category/bags" },
              { labelKey: "Belts", href: "/category/belts" },
              { labelKey: "Wallets", href: "/category/wallets" },
              { labelKey: "Scarves", href: "/category/scarves" },
              { labelKey: "Sunglasses", href: "/category/sunglasses" },
              { labelKey: "Hats", href: "/category/hats" },
              { labelKey: "Jewelry", href: "/category/jewelry" },
            ],
          },
        ],
      },
      { labelKey: "Brands", href: "/brands" },
      { labelKey: "Blog", href: "/blog" },
      { labelKey: "About", href: "/about" },
      { labelKey: "Sale", href: "/category/sale", isSale: true },
    ],
  },
  features: {
    showBlog: true,
    showWishlist: true,
    showReviews: true,
    showLoyaltyPoints: true,
    showRecentlyViewed: true,
    showSizeGuide: true,
    showGiftCards: true,
  },
  owner: {
    name: "Hardik Kanajariya",
    title: "Full Stack Developer & Digital Solutions Expert",
    website: "https://www.hardikkanajariya.in",
    email: "hardik@hardikkanajariya.in",
    phone: "+91 6353485415",
    github: "https://github.com/hardik-kanajariya",
    linkedin: "https://www.linkedin.com/in/hardik-kanajariya/",
    twitter: "https://x.com/hardik_web",
    instagram: "https://www.instagram.com/kanajariyahardik/",
  },
  footer: {
    credit: {
      text: "Designed & Developed by",
      url: "https://www.hardikkanajariya.in",
      companyName: "hardikkanajariya.in",
    },
  },
  shipping: {
    freeShippingThreshold: 1999,
    expressRate: 199,
    standardRate: 99,
    sameDayRate: 499,
  },
  currency: {
    code: "INR" as const,
    symbol: "₹",
    locale: "en-IN",
  },
} as const;

export type SiteConfig = typeof siteConfig;
