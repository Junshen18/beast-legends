import Image from "next/image";
import data from "../../data/landing-page.json";

export default function Hero() {
  return (
    <section className="min-h-screen bg-[url('/landing-page/mk-hero-bg.png')] bg-cover bg-center flex items-end pb-16 relative">
      <div className="px-28 w-full h-1/2 flex flex-col items-center justify-center">
        <Image
          src="/landing-page/name.svg"
          alt="Mystic Kaizer Logo"
          width={980}
          height={168}
        />
        <div className="flex flex-row items-center justify-center gap-6">
          <div className="flex flex-row items-center">
            <Image
              src="/landing-page/diamond-right.svg"
              alt="line"
              width={12}
              height={12}
            />
            <hr className="lg:w-[200px] xl:w-[300px] h-[1.5px] bg-white" />
          </div>
          <div className="text-3xl xl:text-4xl font-light opacity-80 text-center">
            {data.hero.subtitle}
          </div>
          <div className="flex flex-row items-center">
            <hr className="lg:w-[200px] xl:w-[300px] h-[1.5px] bg-white" />
            <Image
              src="/landing-page/diamond-left.svg"
              alt="line"
              width={12}
              height={12}
            />
          </div>
        </div>
      </div>
      <Image
        src="/landing-page/border.svg"
        alt="border"
        width={100}
        height={876}
        className="absolute top-20 left-12 h-[calc(100vh-20vh)]"
      />
      <Image
        src="/landing-page/border.svg"
        alt="border"
        width={100}
        height={876}
        className="absolute top-20 right-12 h-[calc(100vh-20vh)]"
      />
    </section>
  );
} 