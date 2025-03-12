import { Reveal } from "../reveal";
import Image from "next/image";
import data from "../../data/landing-page.json";

export default function About() {
  return (
    <section className="py-20 px-6 bg-[url('/landing-page/about.png')] bg-cover bg-center">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <Reveal direction="left">
          <div className="text-6xl leading-16 text-left w-md">
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
            <hr className="lg:w-[200px] xl:w-[500px] h-[1.5px] bg-white" />
            <Image
              src="/landing-page/diamond-left.svg"
              alt="line"
              width={10}
              height={10}
            />
          </div>
        </Reveal>
        <div className="text-2xl text-justify font-inter">
          {data.about.content.map((paragraph, index) => (
            <p key={index} className="mb-6">
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
            <hr className="lg:w-[200px] xl:w-[300px] h-[1.5px] bg-white" />
            <div className="text-2xl ml-4">{data.about.signature}</div>
          </div>
        </Reveal>
      </div>
    </section>
  );
} 