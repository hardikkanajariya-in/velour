import Link from "next/link";
import { FooterNewsletterForm } from "./footer-newsletter-form";
import {
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  Globe,
  CreditCard,
  Smartphone,
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";
import { siteConfig } from "@/lib/site";

const trustBadges = [
  { icon: ShieldCheck, label: "Secure Payments" },
  { icon: Truck, label: "Free Shipping" },
  { icon: RotateCcw, label: "Easy Returns" },
  { icon: Star, label: "Premium Quality" },
  { icon: Globe, label: "Pan-India Delivery" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Careers", href: "/about" },
  { label: "Press", href: "/about" },
  { label: "Sustainability", href: "/about" },
];

const helpLinks = [
  { label: "FAQ", href: "/contact" },
  { label: "Shipping", href: "/shipping-policy" },
  { label: "Returns", href: "/return-policy" },
  { label: "Size Guide", href: "/size-guide" },
  { label: "Contact Us", href: "/contact" },
  { label: "Track Order", href: "/account/orders" },
];

const categoryLinks = [
  { label: "Men", href: "/category/men" },
  { label: "Women", href: "/category/women" },
  { label: "Kids", href: "/category/kids" },
  { label: "Accessories", href: "/category/accessories" },
  { label: "Sale", href: "/category/sale" },
  { label: "New Arrivals", href: "/products?filter=new" },
];

export function Footer() {
  return (
    <footer className="bg-brand-primary text-white">
      {/* Trust Badges */}
      <div className="border-b border-white/10">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 sm:gap-6">
            {trustBadges.map((badge) => (
              <div
                key={badge.label}
                className="flex flex-col items-center text-center gap-1.5 sm:gap-2"
              >
                <badge.icon className="h-5 w-5 sm:h-6 sm:w-6 text-brand-accent" />
                <span className="text-[10px] sm:text-xs font-medium text-white/80">
                  {badge.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link
              href="/"
              className="font-heading italic text-2xl font-bold text-brand-accent"
            >
              {siteConfig.brand.name}
            </Link>
            <p className="mt-3 text-sm text-white/60 leading-relaxed max-w-xs">
              {siteConfig.brand.description}
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-white/10 rounded-md transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-white/10 rounded-md transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-white/10 rounded-md transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-white/10 rounded-md transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-white/90">
              Company
            </h3>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-brand-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-white/90">Help</h3>
            <ul className="space-y-2.5">
              {helpLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-brand-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-white/90">
              Categories
            </h3>
            <ul className="space-y-2.5">
              {categoryLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-brand-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-white/90">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-white/60">
                <Phone className="h-4 w-4 mt-0.5 shrink-0" />
                {siteConfig.brand.phone}
              </li>
              <li className="flex items-start gap-2 text-sm text-white/60">
                <Mail className="h-4 w-4 mt-0.5 shrink-0" />
                {siteConfig.brand.email}
              </li>
              <li className="flex items-start gap-2 text-sm text-white/60">
                <Clock className="h-4 w-4 mt-0.5 shrink-0" />
                Mon-Sat: 10AM - 8PM
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-base sm:text-lg font-semibold mb-1">
                Get 10% off your first order
              </h3>
              <p className="text-sm text-white/60">
                No spam. Unsubscribe anytime.
              </p>
            </div>
            <FooterNewsletterForm />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 text-xs text-white/50 text-center md:text-left">
            <p>
              &copy; {new Date().getFullYear()} {siteConfig.brand.name}. All
              rights reserved. {siteConfig.footer.credit.text}{" "}
              <a
                href={siteConfig.footer.credit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-accent hover:underline"
              >
                {siteConfig.footer.credit.companyName}
              </a>
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/privacy-policy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-white transition-colors"
              >
                Terms & Conditions
              </Link>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <Smartphone className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
