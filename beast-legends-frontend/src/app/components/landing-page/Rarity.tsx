import { Reveal } from "../reveal";
import Image from "next/image";
import data from "../../data/landing-page.json";

export default function Rarity() {
  return (
    <section className="bg-[#0E0E0C]">
      <div className="flex flex-row max-w-[1920px] mx-auto">
        <div className="relative w-[550px] flex-shrink-0">
          <Image
            src="/landing-page/nft-rarity.png"
            alt="NFT Rarity"
            width={550}
            height={789}
            className="h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto flex flex-col gap-6 py-20 px-6 w-full">
          <Reveal width="100%" direction="right" className="text-right">
            <div className="text-6xl text-white">{data.rarity.title}</div>
          </Reveal>
          <Reveal width="100%" direction="right" className="text-right">
            <div className="flex flex-row items-center justify-end">
              <Image
                src="/landing-page/diamond-right.svg"
                alt="line"
                width={10}
                height={10}
              />
              <hr className="w-[200px] md:w-[300px] xl:w-[500px] h-[2px] bg-white" />
              <Image
                src="/landing-page/diamond-left.svg"
                alt="line"
                width={10}
                height={10}
              />
            </div>
          </Reveal>

          {/* Rarity Table */}
          <div className="mt-8 w-full font-inter">
            <div className="rounded-lg overflow-hidden border border-white/20">
              {/* Table Header */}
              <div className="grid grid-cols-3 text-2xl font-bold bg-white/5">
                <div className="p-6 border-r border-white/20">Rarity Tier</div>
                <div className="p-6 border-r border-white/20">Trait Included</div>
                <div className="p-6">Drop Rate</div>
              </div>

              {/* Table Rows */}
              {data.rarity.tiers.map((row, index) => (
                <div
                  key={row.tier}
                  className={`grid grid-cols-3 text-xl ${
                    index % 2 === 0 ? "bg-white/[0.02]" : "bg-transparent"
                  }`}
                >
                  <div className="p-6 border-r border-white/20">{row.tier}</div>
                  <div className="p-6 border-r border-white/20">{row.traits}</div>
                  <div className="p-6">{row.rate}</div>
                </div>
              ))}
            </div>

            {/* Table Caption */}
            <div className="mt-4 text-white/80 text-lg">
              From Common to Mythic—discover the traits that define your Kaizer.{" "}
              <a
                href="#"
                className="text-blue-400 hover:text-blue-300 inline-flex items-center"
              >
                Learn more about rarity
                <svg
                  className="w-5 h-5 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 