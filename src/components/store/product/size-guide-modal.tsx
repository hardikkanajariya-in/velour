"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Ruler, X } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { PRODUCT_SIZES } from "@/lib/constants";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  gender?: "MEN" | "WOMEN" | "KIDS" | "UNISEX";
}

const menSizeChart = [
  { size: "XS", chest: "34-36", waist: "28-30", hip: "34-36" },
  { size: "S", chest: "36-38", waist: "30-32", hip: "36-38" },
  { size: "M", chest: "38-40", waist: "32-34", hip: "38-40" },
  { size: "L", chest: "40-42", waist: "34-36", hip: "40-42" },
  { size: "XL", chest: "42-44", waist: "36-38", hip: "42-44" },
  { size: "2XL", chest: "44-46", waist: "38-40", hip: "44-46" },
  { size: "3XL", chest: "46-48", waist: "40-42", hip: "46-48" },
];

const womenSizeChart = [
  { size: "XS", bust: "32-34", waist: "24-26", hip: "34-36" },
  { size: "S", bust: "34-36", waist: "26-28", hip: "36-38" },
  { size: "M", bust: "36-38", waist: "28-30", hip: "38-40" },
  { size: "L", bust: "38-40", waist: "30-32", hip: "40-42" },
  { size: "XL", bust: "40-42", waist: "32-34", hip: "42-44" },
  { size: "2XL", bust: "42-44", waist: "34-36", hip: "44-46" },
];

export function SizeGuideModal({
  isOpen,
  onClose,
  gender = "UNISEX",
}: SizeGuideModalProps) {
  const chart = gender === "WOMEN" ? womenSizeChart : menSizeChart;
  const headers =
    gender === "WOMEN"
      ? ["Size", "Bust (in)", "Waist (in)", "Hip (in)"]
      : ["Size", "Chest (in)", "Waist (in)", "Hip (in)"];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Size Guide">
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Ruler className="h-4 w-4" />
          <span>All measurements are in inches</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                {headers.map((h) => (
                  <th
                    key={h}
                    className="py-2.5 px-3 text-left font-semibold text-xs uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chart.map((row) => (
                <tr
                  key={row.size}
                  className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                >
                  <td className="py-2.5 px-3 font-medium">{row.size}</td>
                  <td className="py-2.5 px-3 text-muted-foreground">
                    {"chest" in row ? row.chest : "bust" in row ? row.bust : ""}
                  </td>
                  <td className="py-2.5 px-3 text-muted-foreground">
                    {row.waist}
                  </td>
                  <td className="py-2.5 px-3 text-muted-foreground">
                    {row.hip}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-surface rounded-card p-4 space-y-2">
          <h4 className="text-sm font-semibold">How to Measure</h4>
          <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-4">
            <li>
              <strong>Chest/Bust:</strong> Measure around the fullest part of
              your chest
            </li>
            <li>
              <strong>Waist:</strong> Measure around natural waistline, keeping
              tape comfortably loose
            </li>
            <li>
              <strong>Hip:</strong> Measure around the fullest part of your hips
            </li>
          </ul>
        </div>

        <div className="flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
