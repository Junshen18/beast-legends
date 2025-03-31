import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-[url('/404.png')] bg-cover bg-right flex items-center justify-center">
      <div className="bg-black/60 backdrop-blur-md p-8 rounded-xl text-white text-center max-w-md">
        <Image 
          src="/white-title.svg"
          alt="Beast Legends Logo"
          width={200}
          height={60}
          className="mx-auto mb-6"
        />
        <h1 className="text-6xl font-bold font-dark-mystic mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
        <p className="text-gray-300 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link 
          href="/" 
          className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 rounded-lg font-bold hover:from-purple-700 hover:to-blue-700 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
} 