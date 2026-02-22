import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/breadcrumb";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for using VELOUR.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-8 py-6">
      <Breadcrumb items={[{ label: "Terms & Conditions" }]} />

      <h1 className="text-2xl sm:text-3xl font-heading font-bold mt-4 sm:mt-6 mb-6 sm:mb-8">
        Terms & Conditions
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
            1. General
          </h2>
          <p>
            By using the VELOUR website, you agree to these terms and
            conditions. If you do not agree, please do not use our website or
            services.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-foreground">
            2. Products & Pricing
          </h2>
          <p>
            All prices are listed in Indian Rupees (INR) and include applicable
            taxes unless stated otherwise. We reserve the right to modify prices
            without prior notice.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-foreground">
            3. Orders
          </h2>
          <p>
            By placing an order, you confirm that the information provided is
            accurate. We reserve the right to cancel orders due to pricing
            errors, stock issues, or suspected fraud.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-foreground">
            4. Shipping
          </h2>
          <p>
            We ship across India. Delivery times are estimates and may vary.
            Free shipping is available on orders above ₹1,999.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-foreground">
            5. Returns & Refunds
          </h2>
          <p>
            We accept returns within 15 days of delivery. Items must be unworn,
            unwashed, and in original condition with tags attached. Refunds are
            processed within 7-10 business days.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-foreground">
            6. Intellectual Property
          </h2>
          <p>
            All content on this website — including but not limited to source
            code, design, images, text, logos, and brand assets — is the
            exclusive property of{" "}
            <a
              href="https://www.hardikkanajariya.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-primary underline"
            >
              Hardik Kanajariya
            </a>{" "}
            and is protected under applicable copyright and intellectual
            property laws.
          </p>
          <p className="mt-2">
            This project is <strong>source-available for demonstration
            purposes only</strong>. You may view the code and run it locally
            for personal evaluation, but you may not use, copy, modify,
            distribute, deploy, or sell this software or any part of it
            without prior written authorization from the owner.
          </p>
          <p className="mt-2">
            Using this code for commercial purposes or deploying it without
            express permission constitutes a violation of this license and
            applicable law. For licensing inquiries, contact{" "}
            <a
              href="mailto:hardik@hardikkanajariya.in"
              className="text-brand-primary underline"
            >
              hardik@hardikkanajariya.in
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-foreground">
            7. Limitation of Liability
          </h2>
          <p>
            VELOUR and its owner shall not be liable for any indirect,
            incidental, or consequential damages arising from the use of
            our website, products, or source code.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-foreground">
            8. Governing Law
          </h2>
          <p>
            These terms shall be governed by the laws of India. Any disputes
            arising under these terms shall be subject to the exclusive
            jurisdiction of the courts in Gujarat, India.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-foreground">
            9. Contact
          </h2>
          <p>
            For questions regarding these terms or licensing inquiries:
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
