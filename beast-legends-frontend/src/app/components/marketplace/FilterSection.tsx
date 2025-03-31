"use client";
import { Slider } from "../ui/Slider";

interface FilterSectionProps {
  filters: {
    priceRange: { min: number; max: number };
    rarity: string[];
    attributes: Record<string, string[]>;
    sortBy: string;
  };
  setFilters: (filters: any) => void;
}

export default function FilterSection({ filters, setFilters }: FilterSectionProps) {
  const rarityOptions = ["Common", "Rare", "Epic", "Mythic"];
  const attributeTypes: Record<string, string[]> = {
    // Add more attributes as needed
  };

  const sortOptions = [
    { value: "price_low_to_high", label: "Price: Low to High" },
    { value: "price_high_to_low", label: "Price: High to Low" },
    { value: "recent", label: "Recently Listed" },
  ];

  return (
    <div className="w-80 bg-white/5 backdrop-blur-md p-6 rounded-lg h-fit">
      <div className="space-y-6">
        {/* Price Range Filter */}
        <div>
          <h3 className="text-white text-xl mb-4">Price Range</h3>
          <Slider
            min={0}
            max={5}
            step={0.05}
            value={[filters.priceRange.min, filters.priceRange.max]}
            onValueChange={(value) =>
              setFilters({
                ...filters,
                priceRange: { min: value[0], max: value[1] },
              })
            }
          />
          <div className="flex justify-between mt-2 text-white">
            <span>{filters.priceRange.min} SOL</span>
            <span>{filters.priceRange.max} SOL</span>
          </div>
        </div>

        {/* Rarity Filter */}
        <div>
          <h3 className="text-white text-xl mb-4">Rarity</h3>
          <div className="space-y-2">
            {rarityOptions.map((rarity) => (
              <label
                key={rarity}
                className="flex items-center text-white cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={filters.rarity.includes(rarity)}
                  onChange={(e) => {
                    const newRarity = e.target.checked
                      ? [...filters.rarity, rarity]
                      : filters.rarity.filter((r) => r !== rarity);
                    setFilters({ ...filters, rarity: newRarity });
                  }}
                />
                {rarity}
              </label>
            ))}
          </div>
        </div>

        {/* Attributes Filter */}
        {Object.entries(attributeTypes).map(([type, options]: [string, string[]]) => (
          <div key={type}>
            <h3 className="text-white text-xl mb-4">{type}</h3>
            <div className="space-y-2">
              {options.map((option: string) => (
                <label
                  key={option}
                  className="flex items-center text-white cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={filters.attributes[type]?.includes(option)}
                    onChange={(e) => {
                      const currentTypeFilters = filters.attributes[type] || [];
                      const newTypeFilters = e.target.checked
                        ? [...currentTypeFilters, option]
                        : currentTypeFilters.filter((o) => o !== option);
                      setFilters({
                        ...filters,
                        attributes: {
                          ...filters.attributes,
                          [type]: newTypeFilters,
                        },
                      });
                    }}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}

        {/* Sort Options */}
        <div>
          <h3 className="text-white text-xl mb-4">Sort By</h3>
          <select
            className="w-full bg-white/10 text-white p-2 rounded-md"
            value={filters.sortBy}
            onChange={(e) =>
              setFilters({ ...filters, sortBy: e.target.value })
            }
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
} 