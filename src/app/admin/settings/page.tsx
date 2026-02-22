'use client';

import { siteConfig } from '@/lib/site';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="text-2xl font-heading font-bold">Settings</h1>

      {/* Store Info */}
      <div className="p-6 bg-background border border-border rounded-card space-y-4">
        <h2 className="text-lg font-heading font-bold">Store Information</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Store Name</p>
            <p className="font-medium">{siteConfig.brand.name}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Tagline</p>
            <p className="font-medium">{siteConfig.brand.tagline}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Currency</p>
            <p className="font-medium">{siteConfig.currency.code} ({siteConfig.currency.symbol})</p>
          </div>
          <div>
            <p className="text-muted-foreground">Free Shipping Threshold</p>
            <p className="font-medium">₹{siteConfig.shipping.freeShippingThreshold}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Store settings are configured in site.config.ts. Edit the file to change these values.
        </p>
      </div>

      {/* Features */}
      <div className="p-6 bg-background border border-border rounded-card space-y-4">
        <h2 className="text-lg font-heading font-bold">Features</h2>
        <div className="space-y-3">
          {Object.entries(siteConfig.features).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between text-sm">
              <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
              <span className={value ? 'text-green-600' : 'text-muted-foreground'}>
                {value ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-6 bg-background border border-border rounded-card space-y-4">
        <h2 className="text-lg font-heading font-bold">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="secondary"
            onClick={() => {
              toast.success('Cache cleared (simulated)');
            }}
          >
            Clear Cache
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              window.open('/', '_blank');
            }}
          >
            View Store
          </Button>
        </div>
      </div>
    </div>
  );
}
