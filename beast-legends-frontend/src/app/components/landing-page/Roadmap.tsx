import { Reveal } from "../reveal";
import Image from "next/image";
import data from "../../data/landing-page.json";

export default function Roadmap() {
  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-6 justify-center items-center relative">
        <div className="absolute top-0">
          <Image
            src="/landing-page/footer-title.png"
            alt="title"
            width={700}
            height={133}
          />
        </div>

        <Reveal width="100%">
          <div className="text-6xl text-black w-full text-center mt-16">
            RoadMap
          </div>
        </Reveal>
        <Reveal width="100%">
          <div className="flex flex-row items-center justify-center">
            <Image
              src="/landing-page/diamond-right.svg"
              alt="line"
              width={10}
              height={10}
              className="invert"
            />
            <hr className="lg:w-[100px] xl:w-[300px] h-[2px] bg-black" />
            <Image
              src="/landing-page/diamond-left.svg"
              alt="line"
              width={10}
              height={10}
              className="invert"
            />
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full text-black">
          {data.roadmap.phases.map((phase, index) => (
            <Reveal
              key={phase.number}
              direction="bottom"
              width="100%"
              delay={1.2 + (index % 2) * 0.2}
            >
              <div
                className={`bg-white/80 backdrop-blur-sm p-8 rounded-2xl ${
                  phase.status === "current"
                    ? "border-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                    : "border border-black/10 opacity-75"
                } relative`}
              >
                <div className="absolute -top-4 left-4 bg-blue-500 text-white px-4 py-1 rounded-full text-sm">
                  {phase.status === "current" ? "CURRENT PHASE" : `PHASE ${phase.number}`}
                </div>
                <h3 className="text-3xl font-bold mb-4">
                  Phase {phase.number}: {phase.title}
                </h3>
                <ul className="space-y-3 font-inter">
                  {phase.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span
                        className={
                          item.status === "completed"
                            ? "text-green-500"
                            : item.status === "in-progress"
                            ? "text-blue-500 animate-pulse"
                            : "text-black/50"
                        }
                      >
                        {item.status === "completed"
                          ? "✅"
                          : item.status === "in-progress"
                          ? "⏳"
                          : "🔒"}
                      </span>
                      <span
                        className={
                          item.status === "completed"
                            ? "text-black/90"
                            : item.status === "in-progress"
                            ? "text-blue-500"
                            : "text-black/50"
                        }
                      >
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="text-2xl text-black/80 text-center italic mt-8">
          "{data.roadmap.quote}"
        </div>
      </div>
    </section>
  );
} 