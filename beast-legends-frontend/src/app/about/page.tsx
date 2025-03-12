import Image from "next/image";
import GridMotion from "../components/GridMotion/GridMotion";
import Navigation from "../components/landing-page/Navigation";

export default function AboutPage() {
  const items = [
    "Beast Legends",
    "Beast Legends",
    <Image key="jsx-item-1" src="/creatures/creature1.jpg" alt="creature1" fill className="object-cover" />,
    <Image key="jsx-item-1" src="/creatures/creature2.jpg" alt="creature1" fill className="object-cover" />,
    <Image key="jsx-item-1" src="/creatures/creature3.jpg" alt="creature1" fill className="object-cover" />,
    "Beast Legends",
    "Beast Legends",
    "Beast Legends",
    "Beast Legends",
    <Image key="jsx-item-1" src="/creatures/creature4.jpg" alt="creature1" fill className="object-cover" />,
    <Image key="jsx-item-1" src="/creatures/creature5.jpg" alt="creature1" fill className="object-cover" />,
    <Image key="jsx-item-1" src="/creatures/creature6.jpg" alt="creature1" fill className="object-cover" />,
    <Image key="jsx-item-1" src="/creatures/creature7.jpg" alt="creature1" fill className="object-cover" />,
    <Image key="jsx-item-1" src="/creatures/creature8.jpg" alt="creature1" fill className="object-cover" />,
    "Beast Legends",
    <Image key="jsx-item-1" src="/creatures/creature3.jpg" alt="creature1" fill className="object-cover" />,
    <Image key="jsx-item-1" src="/creatures/creature7.jpg" alt="creature1" fill className="object-cover" />,
    <Image key="jsx-item-1" src="/creatures/creature9.jpg" alt="creature1" fill className="object-cover" />,
    <Image key="jsx-item-1" src="/creatures/creature11.jpg" alt="creature1" fill className="object-cover" />,
    "Beast Legends",
    "Beast Legends",
    "Beast Legends",
    "Beast Legends",
    <Image key="jsx-item-1" src="/creatures/creature12.jpg" alt="creature1" fill className="object-cover" />,
    <Image key="jsx-item-1" src="/creatures/creature13.jpg" alt="creature1" fill className="object-cover" />,
    <Image key="jsx-item-1" src="/creatures/creature14.jpg" alt="creature1" fill className="object-cover" />,
  ];

  return (
    <main className="min-h-screen bg-black">
      <Navigation />
      <div className="flex flex-row h-screen ">
        <div className="flex flex-col justify-center items-start w-full px-12">
          <h1 className="text-5xl font-bold text-white mb-12 font-dark-mystic">
            Who Are We?
          </h1>
          <p className="text-white mb-12 font-inter text-justify">
            We are Beast Legends, a collective of builders, storytellers, and
            visionaries dedicated to pushing the boundaries between art,
            technology, and community. Our mission is to create an immersive NFT
            experience where myth meets the metaverse—empowering holders to
            shape a living, evolving world on the Solana blockchain.
            <br />
            <br />
            At the heart of Beast Legends is a belief that digital ownership
            should be more than just a collectible—it should be an adventure. We
            fuse compelling lore, dynamic NFT evolution, and real-world impact,
            giving our community not only unique Beasts but also the power to
            influence the project's future through The Beast Council (DAO).
            <br />
            <br />
            We're not just building an NFT collection—we're creating a universe
            where every holder becomes a Guardian of the Elemental Veil.
          </p>
        </div>
        <div className="flex flex-col w-1/2">
          <GridMotion items={items} />
        </div>
      </div>
    </main>
  );
}
