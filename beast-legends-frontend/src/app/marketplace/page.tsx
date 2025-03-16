"use client";
import { useState } from "react";
import Navigation from "../components/landing-page/Navigation";
import NFTGrid from "../components/marketplace/NFTGrid";
import FilterSection from "../components/marketplace/FilterSection";

export default function MarketplacePage() {
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 10 },
    rarity: [] as string[],
    attributes: {} as Record<string, string[]>,
    sortBy: "price_low_to_high",
  });

  return (
    <main className="min-h-screen bg-black">
      <Navigation />
      <div className="pt-24 px-12 pb-24">
        <h1 className="text-5xl font-bold text-white mb-12 font-dark-mystic">Marketplace</h1>
        <div className="flex gap-8">
          <FilterSection filters={filters} setFilters={setFilters} />
          <NFTGrid filters={filters} />
        </div>
      </div>
    </main>
  );
}