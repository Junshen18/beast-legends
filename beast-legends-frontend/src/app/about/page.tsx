import GridMotion from "../components/GridMotion/GridMotion";
import Navigation from "../components/landing-page/Navigation";

export default function AboutPage() {
  const items = [
    "Item 1",
    <div key="jsx-item-1">Custom JSX Content</div>,
    "https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Item 2",
    <div key="jsx-item-2">Custom JSX Content</div>,
    "Item 4",
    <div key="jsx-item-2">Custom JSX Content</div>,
    "https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Item 5",
    <div key="jsx-item-2">Custom JSX Content</div>,
    "Item 7",
    <div key="jsx-item-2">Custom JSX Content</div>,
    "https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Item 8",
    <div key="jsx-item-2">Custom JSX Content</div>,
    "Item 10",
    <div key="jsx-item-3">Custom JSX Content</div>,
    "https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Item 11",
    <div key="jsx-item-2">Custom JSX Content</div>,
    "Item 13",
    <div key="jsx-item-4">Custom JSX Content</div>,
    "https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Item 14",
    // Add more items as needed
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
