import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/layout/breadcrumb';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy of VELOUR — how we collect, use, and protect your data.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-8 py-6">
      <Breadcrumb items={[{ label: 'Privacy Policy' }]} />

      <h1 className="text-2xl sm:text-3xl font-heading font-bold mt-4 sm:mt-6 mb-6 sm:mb-8">Privacy Policy</h1>

      <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
        <p>Last updated: {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>

        <section>
          <h2 className="text-lg font-heading font-bold text-foreground">1. Information We Collect</h2>
          <p>We collect information you provide directly to us, including your name, email address, phone number, shipping address, and payment information when you make a purchase.</p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-foreground">2. How We Use Your Information</h2>
          <p>We use the information we collect to process your orders, communicate with you about your purchases, send promotional materials (with your consent), and improve our services.</p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-foreground">3. Information Sharing</h2>
          <p>We do not sell your personal information. We share information only with service providers who help us operate our business (payment processors, shipping carriers, etc.).</p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-foreground">4. Data Security</h2>
          <p>We implement industry-standard security measures to protect your personal information. All payment transactions are processed through secure, encrypted channels.</p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-foreground">5. Cookies</h2>
          <p>We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content.</p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-foreground">6. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal information. Contact us at hello@velour.in for any privacy-related requests.</p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-foreground">7. Contact</h2>
          <p>For questions about this policy, contact us at hello@velour.in.</p>
        </section>
      </div>
    </div>
  );
}
