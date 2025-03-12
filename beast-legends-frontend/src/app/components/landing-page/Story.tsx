import { Reveal } from "../reveal";
import Image from "next/image";
import data from "../../data/landing-page.json";

export default function Story() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="mx-auto flex flex-col gap-6">
        <Reveal direction="left" width="100%">
          <div className="max-w-7xl mx-auto text-6xl text-black w-full">
            {data.story.title}
          </div>
        </Reveal>
        <Reveal direction="left" width="100%">
          <div className="max-w-7xl mx-auto flex flex-row items-center text-black w-full">
            <Image
              src="/landing-page/diamond-right.svg"
              alt="line"
              width={10}
              height={10}
              className="invert"
            />
            <hr className="lg:w-[200px] xl:w-[500px] h-[2px] bg-black" />
            <Image
              src="/landing-page/diamond-left.svg"
              alt="line"
              width={10}
              height={10}
              className="invert"
            />
          </div>
        </Reveal>
        <div className="max-w-7xl mx-auto relative w-full overflow-visible">
          <div className="pl-3 flex flex-row items-center gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide overflow-visible h-[450px]">
            {Array.from({ length: data.story.episodes }, (_, i) => i + 1).map(
              (num) => (
                <div
                  key={num}
                  className="flex-shrink-0 flex items-end p-5 w-[calc(100vw-40px)] md:w-[300px] h-[400px] snap-center rounded-2xl cursor-pointer hover:scale-105 hover:translate-y-[-10px] transition-all duration-300 relative"
                  style={{
                    backgroundImage: `url('/landing-page/story${num}.png')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent rounded-2xl"></div>
                  <div className="text-white text-4xl z-10">EP.{num}</div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
} 