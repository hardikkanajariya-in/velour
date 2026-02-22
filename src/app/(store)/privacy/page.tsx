import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/breadcrumb";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy of VELOUR — how we collect, use, and protect your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-8 py-6">
      <Breadcrumb items={[{ label: "Privacy Policy" }]} />

      <h1 className="text-2xl sm:text-3xl font-heading font-bold mt-4 sm:mt-6 mb-6 sm:mb-8">
        Privacy Policy
      </h1>

      <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
        <p>
          Last updated:{" "}
          {new Date().toLocaleDateString("en-IN", {
            month: "long",
            year: "numeric",
          })}
        </p>

        <section>
          <h2 className="text-lg font-heading font-bold text-foreground">
            1. Information We Collect
          </h2>
          <p>
            We collect information you provide directly to us, including your
            name, email address, phone number, shipping address, and payment
            information when you make a purchase.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-foreground">
            2. How We Use Your Information
          </h2>
          <p>
            We use the information we collect to process your orders,
            communicate with you about your purchases, send promotional
            materials (with your consent), and improve our services.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-foreground">
            3. Information Sharing
          </h2>
          <p>
            We do not sell your personal information. We share information only
            with service providers who help us operate our business (payment
            processors, shipping carriers, etc.).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-foreground">
            4. Data Security
          </h2>
          <p>
            We implement industry-standard security measures to protect your
            personal information. All payment transactions are processed through
            secure, encrypted channels.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-foreground">
            5. Cookies
          </h2>
          <p>
            We use cookies and similar technologies to enhance your browsing
            experience, analyze site traffic, and personalize content.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-foreground">
            6. Your Rights
          </h2>
          <p>
            You have the right to access, correct, or delete your personal
            information. Contact us at{" "}
            <a
              href="mailto:hardik@hardikkanajariya.in"
              className="text-brand-primary underline"
            >
              hardik@hardikkanajariya.in
            </a>{" "}
            for any privacy-related requests.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-foreground">
            7. Intellectual Property & License
          </h2>
          <p>
            This website and all its source code, design, and content are the
            exclusive property of{" "}
            <a
              href="https://www.hardikkanajariya.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-primary underline"
            >
              Hardik Kanajariya
            </a>
            . The code is source-available for demonstration purposes only.
            Commercial use without written authorization is prohibited. See
            our{" "}
            <a href="/terms" className="text-brand-primary underline">
              Terms & Conditions
            </a>{" "}
            for full details.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-foreground">
            8. Contact
          </h2>
          <p>
            For questions about this policy, contact:
          </p>
          <ul className="mt-2 space-y-1">
            <li>
              <strong>Hardik Kanajariya</strong>
            </li>
            <li>
              Email:{" "}
              <a
                href="mailto:hardik@hardikkanajariya.in"
                className="text-brand-primary underline"
              >
                hardik@hardikkanajariya.in
              </a>
            </li>
            <li>
              Web:{" "}
              <a
                href="https://www.hardikkanajariya.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-primary underline"
              >
                hardikkanajariya.in
              </a>
            </li>
            <li>Phone: +91 6353485415</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
