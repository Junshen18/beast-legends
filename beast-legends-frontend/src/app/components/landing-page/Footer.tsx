import Image from "next/image";
import data from "../../data/landing-page.json";
import {
  AiFillInstagram,
  AiFillTwitterCircle,
  AiFillYoutube,
} from "react-icons/ai";

export default function Footer() {
  const SocialIcon = ({ type }: { type: string }) => {
    switch (type) {
      case "instagram":
        return <AiFillInstagram className="text-6xl cursor-pointer" />;
      case "twitter":
        return <AiFillTwitterCircle className="text-6xl cursor-pointer" />;
      case "youtube":
        return <AiFillYoutube className="text-6xl cursor-pointer" />;
      default:
        return null;
    }
  };

  return (
    <footer className="bg-white py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-center items-center gap-8 relative">
        <div>
          <Image
            src="/landing-page/footer-title.png"
            alt="Logo"
            width={1100}
            height={200}
          />
          <Image
            src="/landing-page/footer-bg.png"
            alt="Logo"
            width={365}
            height={365}
            className="absolute top-20 left-10"
          />
          <div className="flex flex-row items-center gap-8">
            <div className="flex flex-col items-left ml-96 gap-2 text-left text-black/70 w-1/2">
              {data.footer.links.map((link) => (
                <div
                  key={link.label}
                  className="text-2xl hover:text-black cursor-pointer"
                >
                  {link.label}
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center gap-2 w-full text-black/80">
              <div className="text-4xl hover:text-black">
                {data.footer.socials.title}
              </div>
              <div className="flex flex-row items-center gap-2">
                {data.footer.socials.links.map((social) => (
                  <a key={social.type} href={social.href}>
                    <SocialIcon type={social.type} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="text-sm text-black mt-3">
            <p>{data.footer.copyright}</p>
          </div>
        </div>
      </div>
    </footer>
  );
} 