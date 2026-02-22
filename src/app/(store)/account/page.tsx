"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice, formatDate, getInitials } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingBag, Heart, MapPin, Package } from "lucide-react";
import type { Order } from "@/types/order";

export default function AccountPage() {
  const { data: session } = useSession();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/orders?limit=3");
        if (res.ok) {
          const data = await res.json();
          setRecentOrders(data.orders ?? []);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const user = session?.user;

  return (
    <div className="space-y-8">
      {/* Profile Card */}
      <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-surface rounded-card">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-accent/20 flex items-center justify-center text-accent font-heading font-bold text-lg sm:text-xl">
          {user?.image ? (
            <Image
              src={user.image}
              alt=""
              width={64}
              height={64}
              className="rounded-full"
            />
          ) : (
            getInitials(user?.name ?? "User")
          )}
        </div>
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-heading font-bold truncate">
            {user?.name ?? "Welcome"}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground truncate">
            {user?.email}
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {[
          { href: "/account/orders", icon: ShoppingBag, label: "My Orders" },
          { href: "/account/wishlist", icon: Heart, label: "Wishlist" },
          { href: "/account/addresses", icon: MapPin, label: "Addresses" },
          { href: "/products", icon: Package, label: "Shop Now" },
        ].map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 border border-border rounded-card hover:border-accent transition-colors min-h-[80px] justify-center"
          >
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
            <span className="text-xs sm:text-sm font-medium text-center">
              {label}
            </span>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading font-bold">Recent Orders</h3>
          <Link
            href="/account/orders"
            className="text-sm text-accent hover:underline"
          >
            View All
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-card" />
            ))}
          </div>
        ) : recentOrders.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            No orders yet
          </p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="flex items-center justify-between p-4 border border-border rounded-card hover:border-accent transition-colors"
              >
                <div>
                  <p className="font-medium text-sm">#{order.orderNumber}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">
                    {formatPrice(order.total)}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {order.status.toLowerCase()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
