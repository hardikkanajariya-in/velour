'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { AddressForm } from '@/components/store/checkout/address-form';
import { CheckoutForm } from '@/components/store/checkout/checkout-form';
import { OrderSummary } from '@/components/store/checkout/order-summary';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useCartStore } from '@/store/cart.store';
import { formatPrice } from '@/lib/utils';
import { getShippingCost } from '@/lib/site';
import { GST_RATE } from '@/lib/constants';
import toast from 'react-hot-toast';

interface SavedAddress {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, subtotal: getSubtotal } = useCartStore();
  const [step, setStep] = useState(1);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);

  const subtotal = getSubtotal();
  const shipping = getShippingCost(subtotal, 'standard');
  const tax = Math.round((subtotal - couponDiscount) * GST_RATE);
  const total = subtotal - couponDiscount + shipping + tax;

  useEffect(() => {
    if (items.length === 0) {
      router.replace('/cart');
    }
  }, [items, router]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/checkout');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchAddresses();
    }
  }, [session]);

  async function fetchAddresses() {
    setLoadingAddresses(true);
    try {
      const res = await fetch('/api/user/addresses');
      if (res.ok) {
        const data = await res.json();
        setAddresses(data);
        const defaultAddr = data.find((a: SavedAddress) => a.isDefault);
        if (defaultAddr) setSelectedAddressId(defaultAddr.id);
      }
    } catch {
      // Addresses not available
    } finally {
      setLoadingAddresses(false);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function handleNewAddress(data: any) {
    try {
      const res = await fetch('/api/user/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const addr = await res.json();
        setAddresses((prev) => [...prev, addr]);
        setSelectedAddressId(addr.id);
        setShowNewAddress(false);
        toast.success('Address saved');
      }
    } catch {
      toast.error('Failed to save address');
    }
  }

  async function handleApplyCoupon() {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, subtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        setCouponDiscount(data.discount);
        toast.success(`Coupon applied! You save ${formatPrice(data.discount)}`);
      } else {
        toast.error(data.message ?? 'Invalid coupon');
      }
    } catch {
      toast.error('Failed to validate coupon');
    } finally {
      setCouponLoading(false);
    }
  }

  if (status === 'loading' || items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-6">
      <Breadcrumb items={[{ label: 'Cart', href: '/cart' }, { label: 'Checkout' }]} />

      <h1 className="text-2xl md:text-3xl font-heading font-bold mt-4 mb-8">Checkout</h1>

      {/* Steps */}
      <div className="flex items-center gap-4 mb-8">
        {['Address', 'Payment'].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step > i + 1
                  ? 'bg-green-500 text-white'
                  : step === i + 1
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {step > i + 1 ? '✓' : i + 1}
            </div>
            <span className={`text-sm font-medium ${step >= i + 1 ? '' : 'text-muted-foreground'}`}>
              {label}
            </span>
            {i < 1 && <div className="w-12 h-px bg-border" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Step 1: Address */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg font-heading font-bold">Shipping Address</h2>

              {loadingAddresses ? (
                <Spinner />
              ) : (
                <>
                  {addresses.length > 0 && !showNewAddress && (
                    <div className="space-y-3">
                      {addresses.map((addr) => (
                        <label
                          key={addr.id}
                          className={`block p-4 border rounded-card cursor-pointer transition-colors ${
                            selectedAddressId === addr.id
                              ? 'border-accent bg-accent/5'
                              : 'border-border hover:border-accent/50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="address"
                            value={addr.id}
                            checked={selectedAddressId === addr.id}
                            onChange={() => setSelectedAddressId(addr.id)}
                            className="sr-only"
                          />
                          <p className="font-medium">{addr.fullName}</p>
                          <p className="text-sm text-muted-foreground">
                            {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {addr.city}, {addr.state} - {addr.pincode}
                          </p>
                          <p className="text-sm text-muted-foreground">{addr.phone}</p>
                        </label>
                      ))}

                      <button
                        onClick={() => setShowNewAddress(true)}
                        className="text-sm text-accent hover:underline"
                      >
                        + Add new address
                      </button>
                    </div>
                  )}

                  {(addresses.length === 0 || showNewAddress) && (
                    <div>
                      {showNewAddress && (
                        <button
                          onClick={() => setShowNewAddress(false)}
                          className="text-sm text-muted-foreground hover:underline mb-4"
                        >
                          ← Back to saved addresses
                        </button>
                      )}
                      <AddressForm
                        onSubmit={handleNewAddress}
                        submitLabel="Save & Continue"
                      />
                    </div>
                  )}
                </>
              )}

              {selectedAddressId && !showNewAddress && (
                <Button onClick={() => setStep(2)} className="mt-4">
                  Continue to Payment
                </Button>
              )}
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="space-y-6">
              <button
                onClick={() => setStep(1)}
                className="text-sm text-muted-foreground hover:underline"
              >
                ← Change address
              </button>
              <CheckoutForm
                addressId={selectedAddressId}
                total={total}
              />
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div>
          <OrderSummary couponDiscount={couponDiscount} couponCode={couponCode || undefined} />

          {/* Coupon Input */}
          <div className="mt-4 p-4 bg-surface rounded-card">
            <h3 className="text-sm font-medium mb-2">Have a coupon?</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Enter code"
                className="flex-1 px-3 py-2 border border-border rounded-lg text-sm"
              />
              <Button
                variant="secondary"
                onClick={handleApplyCoupon}
                disabled={couponLoading}
              >
                {couponLoading ? <Spinner size="sm" /> : 'Apply'}
              </Button>
            </div>
            {couponDiscount > 0 && (
              <p className="text-sm text-green-600 mt-2">
                You save {formatPrice(couponDiscount)}!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
