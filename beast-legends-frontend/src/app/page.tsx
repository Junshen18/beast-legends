import Navigation from "./components/landing-page/Navigation";
import Hero from "./components/landing-page/Hero";
import About from "./components/landing-page/About";
import Story from "./components/landing-page/Story";
import Collections from "./components/landing-page/Collections";
import Rarity from "./components/landing-page/Rarity";
import Community from "./components/landing-page/Community";
import Roadmap from "./components/landing-page/Roadmap";
import Footer from "./components/landing-page/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#111] text-white font-dark-mystic">
      <Navigation />
      <Hero />
      <About />
      <Story />
      <Collections />
      <Rarity />
      <Roadmap />
      <Community />
      <Footer />
    </div>
  );
}
