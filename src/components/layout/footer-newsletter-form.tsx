"use client";

export function FooterNewsletterForm() {
  return (
    <form
      className="flex gap-2 w-full md:w-auto"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        placeholder="Enter your email"
        className="px-4 py-2.5 bg-white/10 border border-white/20 rounded-button text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 w-full md:w-64 min-h-[44px]"
      />
      <button
        type="submit"
        className="px-5 sm:px-6 py-2.5 bg-brand-accent text-brand-primary font-medium rounded-button text-sm hover:bg-brand-accent/90 transition-colors whitespace-nowrap min-h-[44px]"
      >
        Subscribe
      </button>
    </form>
  );
}
