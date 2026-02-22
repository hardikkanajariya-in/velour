import { siteConfig } from '../../site.config';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://velour.in';

export function generateWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.brand.name,
    description: siteConfig.brand.description,
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.brand.name,
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: siteConfig.brand.description,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-98765-43210',
      contactType: 'customer service',
    },
  };
}

interface ProductJsonLdParams {
  name: string;
  description: string;
  image: string[];
  slug: string;
  price: number;
  comparePrice?: number | null;
  currency?: string;
  availability?: boolean;
  brand?: string;
  rating?: number;
  reviewCount?: number;
  sku?: string;
}

export function generateProductJsonLd({
  name,
  description,
  image,
  slug,
  price,
  comparePrice,
  currency = 'INR',
  availability = true,
  brand,
  rating,
  reviewCount,
  sku,
}: ProductJsonLdParams) {
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image,
    url: `${baseUrl}/products/${slug}`,
    sku: sku || slug,
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: currency,
      availability: availability
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      ...(comparePrice && { priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }),
    },
  };

  if (brand) {
    jsonLd.brand = { '@type': 'Brand', name: brand };
  }

  if (rating && reviewCount) {
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: rating,
      reviewCount,
    };
  }

  return jsonLd;
}

export function generateBreadcrumbJsonLd(
  items: { name: string; url?: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url && { item: `${baseUrl}${item.url}` }),
    })),
  };
}
