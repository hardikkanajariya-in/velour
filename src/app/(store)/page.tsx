import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Truck, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/store/product/product-card';
import { Skeleton } from '@/components/ui/skeleton';
import { siteConfig } from '@/lib/site';
import { formatPrice } from '@/lib/utils';
import type { ProductListItem } from '@/types/product';

async function getHomeData() {
  const [banners, categories, featured, newArrivals, bestSellers] = await Promise.all([
    prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      take: 5,
    }),
    prisma.category.findMany({
      where: { isActive: true, parentId: null },
      orderBy: { displayOrder: 'asc' },
      take: 6,
    }),
    prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: {
        images: { orderBy: { order: 'asc' } },
        variants: true,
        category: { select: { id: true, name: true, slug: true } },
        brand: { select: { id: true, name: true, slug: true } },
      },
      take: 8,
    }),
    prisma.product.findMany({
      where: { isActive: true, isNewArrival: true },
      include: {
        images: { orderBy: { order: 'asc' } },
        variants: true,
        category: { select: { id: true, name: true, slug: true } },
        brand: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
    prisma.product.findMany({
      where: { isActive: true, isBestSeller: true },
      include: {
        images: { orderBy: { order: 'asc' } },
        variants: true,
        category: { select: { id: true, name: true, slug: true } },
        brand: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { totalSold: 'desc' },
      take: 4,
    }),
  ]);

  return { banners, categories, featured, newArrivals, bestSellers };
}

export default async function HomePage() {
  const { banners, categories, featured, newArrivals, bestSellers } = await getHomeData();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[85vh] overflow-hidden bg-brand-primary">
        {banners[0] ? (
          <>
            <Image
              src={banners[0].image}
              alt={banners[0].title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-[1280px] mx-auto px-4 lg:px-8 w-full">
                <div className="max-w-xl animate-fadeUp">
                  <p className="text-brand-accent text-sm font-medium tracking-widest uppercase mb-3">
                    {banners[0].subtitle ?? 'New Collection'}
                  </p>
                  <h1 className="text-4xl md:text-6xl font-heading font-bold text-white leading-tight mb-4">
                    {banners[0].title}
                  </h1>
                  <p className="text-white/80 text-lg mb-6">{banners[0].subtitle}</p>
                  <div className="flex gap-3">
                    <Link href={banners[0].link ?? '/products'}>
                      <Button className="bg-white text-brand-primary hover:bg-white/90" size="lg">
                        Shop Now
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white animate-fadeUp">
              <p className="text-brand-accent text-sm font-medium tracking-widest uppercase mb-3">
                {siteConfig.brand.tagline}
              </p>
              <h1 className="text-5xl md:text-7xl font-heading italic font-bold mb-4">
                {siteConfig.brand.name}
              </h1>
              <p className="text-white/70 text-lg mb-8 max-w-md mx-auto">
                Premium fashion for the modern Indian wardrobe
              </p>
              <Link href="/products">
                <Button className="bg-brand-accent text-brand-primary hover:bg-brand-accent/90" size="lg">
                  Explore Collection
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Trust Bar */}
      <section className="bg-surface border-y">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Truck, text: 'Free Shipping Over ₹1,999' },
              { icon: RotateCcw, text: '14-Day Easy Returns' },
              { icon: ShieldCheck, text: 'Secure Payments' },
              { icon: Sparkles, text: '100% Authentic' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 justify-center text-sm text-muted-foreground">
                <Icon className="h-4 w-4 text-brand-accent shrink-0" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-16">
          <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-heading font-bold">Shop by Category</h2>
              <p className="text-muted-foreground mt-2">Explore our curated collections</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((cat: { id: string; slug: string; name: string; image: string | null }) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="group relative aspect-[3/4] rounded-card overflow-hidden bg-muted"
                >
                  {cat.image && (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-semibold">{cat.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="py-16 bg-surface">
          <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-heading font-bold">Featured Products</h2>
                <p className="text-muted-foreground mt-1">Handpicked styles just for you</p>
              </div>
              <Link
                href="/products?featured=true"
                className="hidden md:flex items-center gap-1 text-sm font-medium text-brand-accent hover:underline"
              >
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {featured.map((product: ProductListItem) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center mt-8 md:hidden">
              <Link href="/products?featured=true">
                <Button variant="secondary">View All Products</Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Promo Banner */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
          <div className="relative rounded-card overflow-hidden bg-brand-primary h-64 md:h-80 flex items-center">
            <div className="relative z-10 px-8 md:px-12 max-w-lg">
              <p className="text-brand-accent text-xs font-medium tracking-widest uppercase mb-2">
                Limited Time
              </p>
              <h2 className="text-2xl md:text-4xl font-heading font-bold text-white mb-3">
                Season End Sale
              </h2>
              <p className="text-white/70 mb-5">
                Up to 50% off on selected styles. Don&apos;t miss out!
              </p>
              <Link href="/products?sort=price-asc">
                <Button className="bg-brand-accent text-brand-primary hover:bg-brand-accent/90">
                  Shop Sale <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-primary to-transparent z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-16 bg-surface">
          <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-heading font-bold">New Arrivals</h2>
                <p className="text-muted-foreground mt-1">Just dropped, just for you</p>
              </div>
              <Link
                href="/products?new=true"
                className="hidden md:flex items-center gap-1 text-sm font-medium text-brand-accent hover:underline"
              >
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {newArrivals.map((product: ProductListItem) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="py-16">
          <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-heading font-bold">Best Sellers</h2>
              <p className="text-muted-foreground mt-2">Our most loved products</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {bestSellers.map((product: ProductListItem) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-20 bg-brand-primary text-white">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl font-heading font-bold mb-3">Join the VELOUR Club</h2>
          <p className="text-white/60 max-w-md mx-auto mb-8">
            Get exclusive access to new collections, early sales, and style tips — plus 10% off your first order.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e: React.FormEvent) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-button text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
            />
            <Button className="bg-brand-accent text-brand-primary hover:bg-brand-accent/90 whitespace-nowrap">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
