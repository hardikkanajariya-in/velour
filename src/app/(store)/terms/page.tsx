import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/layout/breadcrumb';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and conditions for using VELOUR.',
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-8 py-6">
      <Breadcrumb items={[{ label: 'Terms & Conditions' }]} />

      <h1 className="text-3xl font-heading font-bold mt-6 mb-8">Terms & Conditions</h1>

      <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
        <p>Last updated: {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>

        <section>
          <h2 className="text-lg font-heading font-bold text-foreground">1. General</h2>
          <p>By using the VELOUR website, you agree to these terms and conditions. If you do not agree, please do not use our website or services.</p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-foreground">2. Products & Pricing</h2>
          <p>All prices are listed in Indian Rupees (INR) and include applicable taxes unless stated otherwise. We reserve the right to modify prices without prior notice.</p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-foreground">3. Orders</h2>
          <p>By placing an order, you confirm that the information provided is accurate. We reserve the right to cancel orders due to pricing errors, stock issues, or suspected fraud.</p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-foreground">4. Shipping</h2>
          <p>We ship across India. Delivery times are estimates and may vary. Free shipping is available on orders above ₹1,999.</p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-foreground">5. Returns & Refunds</h2>
          <p>We accept returns within 15 days of delivery. Items must be unworn, unwashed, and in original condition with tags attached. Refunds are processed within 7-10 business days.</p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-foreground">6. Intellectual Property</h2>
          <p>All content on this website is the property of VELOUR and is protected by copyright laws. Unauthorized use is prohibited.</p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-foreground">7. Limitation of Liability</h2>
          <p>VELOUR shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or products.</p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-foreground">8. Contact</h2>
          <p>For questions regarding these terms, contact us at hello@velour.in.</p>
        </section>
      </div>
    </div>
  );
}
