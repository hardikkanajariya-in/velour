import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Accordion } from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about VELOUR — orders, shipping, returns and more.",
};

const faqSections = [
  {
    title: "Orders",
    items: [
      {
        title: "How do I place an order?",
        content:
          "Browse our collection, select your size and color, add items to your cart, and proceed to checkout. You can pay via Razorpay (UPI, cards, net banking) or Cash on Delivery.",
      },
      {
        title: "Can I cancel my order?",
        content:
          "Orders can be cancelled within 2 hours of placing them, provided they haven't been shipped yet. Contact us at hello@velour.in for cancellation requests.",
      },
      {
        title: "How do I track my order?",
        content:
          "Once your order is shipped, you'll receive a tracking number via email. You can also track your order from the My Orders section in your account.",
      },
    ],
  },
  {
    title: "Shipping",
    items: [
      {
        title: "How long does delivery take?",
        content:
          "Standard delivery takes 5-7 business days. Express delivery takes 2-3 business days. Delivery times may vary based on your location.",
      },
      {
        title: "Do you offer free shipping?",
        content: "Yes! Free shipping is available on all orders above ₹1,999.",
      },
      {
        title: "Do you ship internationally?",
        content:
          "Currently, we only ship within India. International shipping will be available soon.",
      },
    ],
  },
  {
    title: "Returns & Refunds",
    items: [
      {
        title: "What is your return policy?",
        content:
          "We accept returns within 15 days of delivery. Items must be unworn, unwashed, and in original condition with all tags attached.",
      },
      {
        title: "How long do refunds take?",
        content:
          "Refunds are processed within 7-10 business days after we receive the returned item. The amount is credited to your original payment method.",
      },
      {
        title: "Can I exchange an item?",
        content:
          "We don't offer direct exchanges. Please return the item and place a new order for the desired size or color.",
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Do I need an account to shop?",
        content:
          "You can browse without an account, but you need to sign in to complete a purchase, track orders, and manage your wishlist.",
      },
      {
        title: "How do I reset my password?",
        content:
          'Click "Forgot Password" on the login page and enter your email address. We\'ll send you a link to reset your password.',
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-8 py-6">
      <Breadcrumb items={[{ label: "FAQ" }]} />

      <div className="text-center py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold mb-3 sm:mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-muted-foreground">
          Find answers to common questions about VELOUR.
        </p>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {faqSections.map((section) => (
          <div key={section.title}>
            <h2 className="text-base sm:text-lg font-heading font-bold mb-3 sm:mb-4">
              {section.title}
            </h2>
            <Accordion items={section.items} />
          </div>
        ))}
      </div>

      <div className="text-center py-8 sm:py-12 mt-6 sm:mt-8 border-t border-border">
        <p className="text-muted-foreground mb-2">Still have questions?</p>
        <a href="/contact" className="text-accent hover:underline font-medium">
          Contact Us →
        </a>
      </div>
    </div>
  );
}
