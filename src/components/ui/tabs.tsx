"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Tab {
  label: string;
  value: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultValue?: string;
  className?: string;
  onChange?: (value: string) => void;
}

export function Tabs({ tabs, defaultValue, className, onChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue || tabs[0]?.value);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onChange?.(value);
  };

  return (
    <div className={className}>
      <div className="flex border-b border-neutral-200 overflow-x-auto scrollbar-none -mx-4 sm:mx-0 px-4 sm:px-0">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabChange(tab.value)}
            className={cn(
              "px-4 sm:px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors min-h-[48px]",
              "border-b-2 -mb-px",
              activeTab === tab.value
                ? "border-brand-accent text-brand-primary"
                : "border-transparent text-neutral-500 hover:text-brand-primary hover:border-neutral-300",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="pt-5 sm:pt-6">
        {tabs.find((t) => t.value === activeTab)?.content}
      </div>
    </div>
  );
}
