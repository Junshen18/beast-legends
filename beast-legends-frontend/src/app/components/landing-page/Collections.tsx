import { Reveal } from "../reveal";
import Image from "next/image";
import data from "../../data/landing-page.json";

export default function Collections() {
  return (
    <section className="py-20 px-6 bg-[url('/landing-page/collections.png')] bg-cover bg-center">
      <div className="max-w-7xl mx-auto flex flex-col gap-6 justify-center items-center h-[870px]">
        <Reveal>
          <div className="text-6xl w-full text-center">
            {data.collections.title}
          </div>
        </Reveal>
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
      </div>
    </section>
  );
} 