import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Ruler } from "lucide-react";

export const metadata: Metadata = {
  title: "Size Guide",
  description:
    "Find your perfect fit with our comprehensive size guide for tops, bottoms, dresses, and more.",
};

interface SizeGuide {
  id: string;
  category: string;
  tableData: {
    headers: string[];
    rows: string[][];
  };
  tips: string | null;
}

export default async function SizeGuidePage() {
  let guides: SizeGuide[] = [];

  try {
    const raw = await prisma.sizeGuide.findMany({
      orderBy: { category: "asc" },
    });
    guides = raw as unknown as SizeGuide[];
  } catch {
    // Database error
  }

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-8 py-6">
      <Breadcrumb items={[{ label: "Size Guide" }]} />

      <div className="text-center py-8 sm:py-12">
        <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
          <Ruler className="w-6 h-6 text-accent" />
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold mb-3 sm:mb-4">
          Size Guide
        </h1>
        <p className="text-muted-foreground">
          Find your perfect fit. All measurements are in inches.
        </p>
      </div>

      {guides.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">
            Size guide information is not available at the moment.
          </p>
        </div>
      ) : (
        <div className="space-y-8 sm:space-y-12">
          {guides.map((guide) => (
            <section key={guide.id}>
              <h2 className="text-lg sm:text-xl font-heading font-bold mb-3 sm:mb-4 capitalize">
                {guide.category}
              </h2>

              {/* Size Table */}
              <div className="overflow-x-auto rounded-card border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-surface">
                      {guide.tableData.headers.map((header) => (
                        <th
                          key={header}
                          className="px-4 py-3 text-left font-medium text-foreground whitespace-nowrap"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {guide.tableData.rows.map((row, rowIdx) => (
                      <tr
                        key={rowIdx}
                        className="border-t border-border hover:bg-surface/50 transition-colors"
                      >
                        {row.map((cell, cellIdx) => (
                          <td
                            key={cellIdx}
                            className={`px-4 py-3 whitespace-nowrap ${
                              cellIdx === 0
                                ? "font-medium text-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tips */}
              {guide.tips && (
                <div className="mt-3 p-4 bg-surface rounded-card text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">💡 Tip: </span>
                  {guide.tips}
                </div>
              )}
            </section>
          ))}

          {/* How to Measure */}
          <section className="bg-surface rounded-card p-5 sm:p-8">
            <h2 className="text-lg sm:text-xl font-heading font-bold mb-3 sm:mb-4">
              How to Measure
            </h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div>
                <h3 className="font-medium text-foreground mb-1">Chest</h3>
                <p>
                  Measure around the fullest part of your chest, keeping the
                  tape horizontal.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-1">Waist</h3>
                <p>
                  Measure around your natural waistline, at the narrowest point
                  of your torso.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-1">Hip</h3>
                <p>
                  Stand with your feet together and measure around the widest
                  part of your hips.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-1">Inseam</h3>
                <p>
                  Measure from the crotch seam to the bottom of the leg on a
                  pair of well-fitting trousers.
                </p>
              </div>
            </div>
          </section>

          {/* Help */}
          <div className="text-center py-4 text-sm text-muted-foreground">
            <p>
              Still unsure about your size? Contact us at{" "}
              <a href="mailto:hello@velour.in" className="text-accent hover:underline">
                hello@velour.in
              </a>{" "}
              and we&apos;ll help you find the perfect fit.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
