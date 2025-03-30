import { Reveal } from "../reveal";
import Image from "next/image";
import data from "../../data/landing-page.json";

export default function About() {
  return (
    <section className="py-12 md:py-20 px-6 bg-[url('/landing-page/about.png')] bg-cover bg-center">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <Reveal direction="left">
          <div className="text-4xl md:text-6xl leading-tight md:leading-16 text-left w-full">
            {data.about.title}
          </div>
        </Reveal>
        <Reveal direction="left">
          <div className="flex flex-row items-center">
            <Image
              src="/landing-page/diamond-right.svg"
              alt="line"
              width={10}
              height={10}
            />
            <hr className="w-[100px] sm:w-[200px] lg:w-[200px] xl:w-[500px] h-[1.5px] bg-white" />
            <Image
              src="/landing-page/diamond-left.svg"
              alt="line"
              width={10}
              height={10}
            />
          </div>
        </Reveal>
        <div className="text-base md:text-2xl text-justify font-inter">
          {data.about.content.map((paragraph, index) => (
            <p key={index} className="mb-4 md:mb-6">
              {paragraph}
            </p>
          ))}
        </div>
        <Reveal direction="right" width="100%">
          <div className="flex flex-row items-center w-full justify-end">
            <Image
              src="/landing-page/diamond-right.svg"
              alt="line"
              width={12}
              height={12}
            />
            <hr className="w-[100px] sm:w-[200px] lg:w-[200px] xl:w-[300px] h-[1.5px] bg-white" />
            <div className="text-xl md:text-2xl ml-4">{data.about.signature}</div>
          </div>
        </Reveal>
      </div>
    </section>
  );
} 