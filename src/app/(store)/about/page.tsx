import type { Metadata } from "next";
import Image from "next/image";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Heart, Leaf, Award, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about VELOUR — our story, our values, and our commitment to premium fashion.",
};

const values = [
  {
    icon: Heart,
    title: "Craftsmanship",
    description:
      "Every piece is crafted with meticulous attention to detail and premium materials.",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    description:
      "We are committed to ethical sourcing and eco-friendly production practices.",
  },
  {
    icon: Award,
    title: "Quality",
    description:
      "We never compromise on quality. Each garment passes rigorous quality checks.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "We believe in building a community that celebrates individuality and self-expression.",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-6">
      <Breadcrumb items={[{ label: "About Us" }]} />

      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto py-10 sm:py-16">
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-heading font-bold mb-4 sm:mb-6">
          Our Story
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Born from a passion for timeless elegance and modern design, VELOUR is
          more than a fashion brand — it&apos;s a movement. We believe that what
          you wear tells a story, and every piece in our collection is designed
          to help you tell yours.
        </p>
      </div>

      {/* Image */}
      <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-card overflow-hidden mb-10 sm:mb-16 bg-muted">
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          <p className="text-sm">Brand Image</p>
        </div>
      </div>

      {/* Values */}
      <div className="mb-10 sm:mb-16">
        <h2 className="text-xl sm:text-2xl font-heading font-bold text-center mb-6 sm:mb-10">
          Our Values
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {values.map(({ icon: Icon, title, description }) => (
            <div key={title} className="text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
              </div>
              <h3 className="font-heading font-bold text-sm sm:text-base mb-1 sm:mb-2">
                {title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission */}
      <div className="bg-surface rounded-card p-5 sm:p-8 md:p-12 text-center mb-10 sm:mb-16">
        <h2 className="text-xl sm:text-2xl font-heading font-bold mb-3 sm:mb-4">
          Our Mission
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          To make premium fashion accessible, sustainable, and personal. We
          curate collections that blend timeless craftsmanship with contemporary
          design, ensuring every piece feels like it was made just for you.
        </p>
      </div>

      {/* Numbers */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 py-8 sm:py-12">
        {[
          { number: "50K+", label: "Happy Customers" },
          { number: "1000+", label: "Products" },
          { number: "100+", label: "Cities Delivered" },
          { number: "4.8", label: "Average Rating" },
        ].map(({ number, label }) => (
          <div key={label} className="text-center">
            <p className="text-2xl sm:text-3xl font-heading font-bold text-accent">
              {number}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
