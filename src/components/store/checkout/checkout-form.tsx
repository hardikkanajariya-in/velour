"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CreditCard, Wallet, Banknote, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart.store";
import { cn } from "@/lib/utils";
import { COD_MAX_ORDER } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

type PaymentMethod = "razorpay" | "cod";

interface CheckoutFormProps {
  addressId: string;
  total: number;
}

export function CheckoutForm({ addressId, total }: CheckoutFormProps) {
  const router = useRouter();
  const { clearCart, subtotal: getSubtotal } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("razorpay");
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = getSubtotal();
  const codAvailable = subtotal <= COD_MAX_ORDER;

  async function handlePlaceOrder() {
    if (!addressId) {
      toast.error("Please select a delivery address");
      return;
    }

    setIsProcessing(true);

    try {
      if (paymentMethod === "razorpay") {
        // Create Razorpay order
        const res = await fetch("/api/payment/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ addressId }),
        });

        if (!res.ok) throw new Error("Failed to create order");

        const data = await res.json();

        // Load Razorpay script
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        document.body.appendChild(script);

        script.onload = () => {
          const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: data.amount,
            currency: data.currency,
            name: "VELOUR",
            description: "Order Payment",
            order_id: data.razorpayOrderId,
            handler: async function (response: Record<string, string>) {
              // Verify payment
              const verifyRes = await fetch("/api/payment/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  orderId: data.orderId,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              });

              if (verifyRes.ok) {
                clearCart();
                toast.success("Order placed successfully!");
                router.push(`/account/orders/${data.orderId}`);
              } else {
                toast.error("Payment verification failed");
              }
            },
            prefill: {},
            theme: { color: "#1A1A1A" },
          };

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        };
      } else {
        // COD order
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            addressId,
            paymentMethod: "cod",
          }),
        });

        if (!res.ok) throw new Error("Failed to place order");

        const data = await res.json();
        clearCart();
        toast.success("Order placed successfully!");
        router.push(`/account/orders/${data.orderId}`);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-4">Payment Method</h3>
        <div className="space-y-2">
          <button
            onClick={() => setPaymentMethod("razorpay")}
            className={cn(
              "w-full flex items-center gap-3 p-4 border rounded-card transition-all text-left",
              paymentMethod === "razorpay"
                ? "border-brand-accent bg-brand-accent/5"
                : "border-border hover:border-brand-accent/50",
            )}
          >
            <div
              className={cn(
                "h-5 w-5 rounded-full border-2 shrink-0",
                paymentMethod === "razorpay"
                  ? "border-brand-accent bg-brand-accent"
                  : "border-border",
              )}
            />
            <CreditCard className="h-5 w-5 text-muted-foreground shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-sm">Pay Online</p>
              <p className="text-xs text-muted-foreground">
                UPI, Cards, Net Banking, Wallets
              </p>
            </div>
          </button>

          <button
            onClick={() => codAvailable && setPaymentMethod("cod")}
            disabled={!codAvailable}
            className={cn(
              "w-full flex items-center gap-3 p-4 border rounded-card transition-all text-left",
              paymentMethod === "cod"
                ? "border-brand-accent bg-brand-accent/5"
                : "border-border hover:border-brand-accent/50",
              !codAvailable && "opacity-50 cursor-not-allowed",
            )}
          >
            <div
              className={cn(
                "h-5 w-5 rounded-full border-2 shrink-0",
                paymentMethod === "cod"
                  ? "border-brand-accent bg-brand-accent"
                  : "border-border",
              )}
            />
            <Banknote className="h-5 w-5 text-muted-foreground shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-sm">Cash on Delivery</p>
              <p className="text-xs text-muted-foreground">
                {codAvailable
                  ? "Pay when you receive"
                  : `Available for orders under ${formatPrice(COD_MAX_ORDER)}`}
              </p>
            </div>
          </button>
        </div>
      </div>

      <Button
        className="w-full"
        size="lg"
        onClick={handlePlaceOrder}
        isLoading={isProcessing}
      >
        {paymentMethod === "razorpay" ? "Pay Now" : "Place Order"}
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
}
