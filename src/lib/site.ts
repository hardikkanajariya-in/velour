import { siteConfig } from "../../site.config";

export { siteConfig };

export function getSiteUrl(): string {
  return siteConfig.seo.siteUrl;
}

export function getPageTitle(title?: string): string {
  if (!title) return `${siteConfig.brand.name} — ${siteConfig.brand.tagline}`;
  return siteConfig.seo.titleTemplate.replace("%s", title);
}

export function getShippingCost(
  subtotal: number,
  method: "standard" | "express" | "sameday",
): number {
  if (method === "standard") {
    return subtotal >= siteConfig.shipping.freeShippingThreshold
      ? 0
      : siteConfig.shipping.standardRate;
  }
  if (method === "express") return siteConfig.shipping.expressRate;
  return siteConfig.shipping.sameDayRate;
}

export function getRemainingForFreeShipping(subtotal: number): number {
  const diff = siteConfig.shipping.freeShippingThreshold - subtotal;
  return diff > 0 ? diff : 0;
}
