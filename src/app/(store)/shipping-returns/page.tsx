import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/breadcrumb";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description: "Shipping information and return policy for VELOUR orders.",
};

export default function ShippingReturnsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-8 py-6">
      <Breadcrumb items={[{ label: "Shipping & Returns" }]} />

      <h1 className="text-2xl sm:text-3xl font-heading font-bold mt-4 sm:mt-6 mb-6 sm:mb-8">
        Shipping & Returns
      </h1>

      <div className="space-y-8 sm:space-y-10">
        {/* Shipping */}
        <section>
          <h2 className="text-lg sm:text-xl font-heading font-bold mb-3 sm:mb-4">
            Shipping Policy
          </h2>
          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="p-4 bg-surface rounded-card">
              <h3 className="font-medium text-foreground mb-2">
                Free Shipping
              </h3>
              <p>
                Enjoy free shipping on all orders above ₹1,999 across India.
              </p>
            </div>
            <div className="p-4 bg-surface rounded-card">
              <h3 className="font-medium text-foreground mb-2">
                Standard Shipping
              </h3>
              <p>
                ₹99 flat rate for orders under ₹1,999. Estimated delivery: 5-7
                business days.
              </p>
            </div>
            <div className="p-4 bg-surface rounded-card">
              <h3 className="font-medium text-foreground mb-2">
                Express Shipping
              </h3>
              <p>
                ₹199 for express delivery. Estimated delivery: 2-3 business
                days.
              </p>
            </div>
            <p>
              Delivery times may vary based on location and availability. You
              will receive a tracking number via email once your order is
              shipped.
            </p>
          </div>
        </section>

        {/* Returns */}
        <section>
          <h2 className="text-lg sm:text-xl font-heading font-bold mb-3 sm:mb-4">
            Return Policy
          </h2>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              We want you to love every purchase. If you&apos;re not completely
              satisfied, we offer easy returns within 15 days of delivery.
            </p>

            <div className="p-4 bg-surface rounded-card">
              <h3 className="font-medium text-foreground mb-2">Eligibility</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Items must be unworn, unwashed, and in original condition
                </li>
                <li>All original tags and packaging must be attached</li>
                <li>Return request within 15 days of delivery</li>
                <li>Innerwear, swimwear, and accessories are non-returnable</li>
              </ul>
            </div>

            <div className="p-4 bg-surface rounded-card">
              <h3 className="font-medium text-foreground mb-2">Process</h3>
              <ol className="list-decimal list-inside space-y-1">
                <li>Go to My Orders and select the item to return</li>
                <li>Choose your reason and submit the request</li>
                <li>We will arrange pickup within 2-3 business days</li>
                <li>Refund will be processed within 7-10 business days</li>
              </ol>
            </div>

            <div className="p-4 bg-surface rounded-card">
              <h3 className="font-medium text-foreground mb-2">Refund</h3>
              <p>
                Refunds are credited to your original payment method. For COD
                orders, refunds are processed via bank transfer.
              </p>
            </div>
          </div>
        </section>

        {/* Exchange */}
        <section>
          <h2 className="text-lg sm:text-xl font-heading font-bold mb-3 sm:mb-4">
            Exchange Policy
          </h2>
          <div className="text-sm text-muted-foreground">
            <p>
              We currently do not offer direct exchanges. Please return the item
              and place a new order for the desired size/color.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
