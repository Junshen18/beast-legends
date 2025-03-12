import { Reveal } from "../reveal";
import Image from "next/image";
import data from "../../data/landing-page.json";

export default function Community() {
  return (
    <section className="bg-[url('/landing-page/community.png')] bg-cover bg-center pt-20 px-6">
      <div className="mx-auto flex flex-col gap-6 justify-center items-center relative">
        <Reveal width="100%">
          <div className="text-6xl text-white w-full text-center mt-16">
            {data.community.title}
          </div>
        </Reveal>
        <Reveal width="100%">
          <div className="flex flex-row items-center justify-center">
            <Image
              src="/landing-page/diamond-right.svg"
              alt="line"
              width={10}
              height={10}
            />
            <hr className="lg:w-[200px] xl:w-[500px] h-[2px] bg-white" />
            <Image
              src="/landing-page/diamond-left.svg"
              alt="line"
              width={10}
              height={10}
            />
          </div>
        </Reveal>
        <div className="text-2xl text-white border border-white px-10 py-2 rounded-full cursor-pointer hover:bg-white hover:text-black transition-all duration-300">
          {data.community.buttonText}
        </div>
        <div className="w-full h-fit flex relative">
          <Image
            src="/landing-page/map.svg"
            alt="map"
            width={1000}
            height={1000}
            className="w-full h-full"
          />
          {data.community.locations.map((location, index) => (
            <div
              key={location.name}
              className="absolute w-[4vw]"
              style={{ top: location.top, left: location.left }}
            >
              <Reveal direction="bottom" width="100%" delay={1.2 + index * 0.2}>
                <Image
                  src={`/landing-page/${location.name}.svg`}
                  alt={location.name}
                  width={80}
                  height={100}
                />
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 