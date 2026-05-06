import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAFAFA] text-black p-8 text-center">
      <h1 className="text-6xl font-black mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-8">PAGE NOT FOUND</h2>
      <p className="text-gray-500 mb-12 max-w-md">
        The page you are looking for doesn&apos;t exist or has been moved to a new universe.
      </p>
      <Link 
        href="/" 
        className="px-8 py-3 bg-black text-white rounded-full font-bold uppercase tracking-widest hover:bg-[#D4FF00] hover:text-black transition-all"
      >
        Back to Earth
      </Link>
    </div>
  );
}
