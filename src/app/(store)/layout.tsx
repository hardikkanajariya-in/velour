import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/store/cart/cart-drawer";
import { BackToTop } from "@/components/ui/back-to-top";
import { StoreHydration } from "@/components/store/store-hydration";

export const dynamic = "force-dynamic";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StoreHydration />
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <CartDrawer />
      <BackToTop />
    </>
  );
}
