"use client";
import Image from "next/image";
import data from "../../data/landing-page.json";
import {
  AiFillInstagram,
  AiFillTwitterCircle,
  AiFillYoutube,
} from "react-icons/ai";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();
  const SocialIcon = ({ type }: { type: string }) => {
    switch (type) {
      case "instagram":
        return <AiFillInstagram className="text-4xl md:text-6xl cursor-pointer" />;
      case "twitter":
        return <AiFillTwitterCircle className="text-4xl md:text-6xl cursor-pointer" />;
      case "youtube":
        return <AiFillYoutube className="text-4xl md:text-6xl cursor-pointer" />;
      default:
        return null;
    }
  };

  return (
    <footer className="bg-white py-8 md:py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-8 relative">
        <div className="w-full flex flex-col items-center">
          <div className="relative w-full">
            <Image
              src="/landing-page/title.svg"
              alt="Logo"
              width={1100}
              height={200}
              className="w-full h-auto"
            />
            <Image
              src="/landing-page/footer-bg.png"
              alt="Logo"
              width={365}
              height={365}
              className="absolute top-28 left-0 hidden md:block"
            />
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 w-full">
            <div className="flex flex-col gap-2 text-left text-black/70 w-fit md:ml-36 mt-5 md:mt-0">
              {data.footer.links.map((link) => (
                <div
                  key={link.label}
                  className="text-xl md:text-2xl hover:text-black cursor-pointer"
                  onClick={() => {
                    router.push(link.href);
                  }}
                >
                  {link.label}
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center gap-4 w-full md:w-auto text-black/80">
              <div className="text-3xl md:text-4xl hover:text-black">
                {data.footer.socials.title}
              </div>
              <div className="flex flex-row items-center gap-4">
                {data.footer.socials.links.map((social) => (
                  <a key={social.type} href={social.href}>
                    <SocialIcon type={social.type} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="text-sm text-black mt-6 text-center">
            <p>{data.footer.copyright}</p>
          </div>
        </div>
      </div>
    </footer>
  );
} 