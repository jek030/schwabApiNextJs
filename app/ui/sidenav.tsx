import Link from 'next/link';
import NavLinks from '@/app/ui/nav-links';
import Image from 'next/image';
import { cn } from '@/app/lib/utils';

export default function SideNav() {
  return (
    <div className="flex h-full w-[240px] flex-col border-r bg-gray-100/40 px-2 py-4">
      <Link
        className="mb-4 flex h-20 items-center justify-start gap-2 rounded-md bg-gray-100 px-4 font-medium hover:bg-sky-100 transition-colors"
        href="/"
      >
        <div className="relative h-16 w-16">
          <Image
            src="/stonks.png"
            alt="Stonks meme"
            fill
            priority={true}
            className="object-contain transform hover:scale-105 transition-transform duration-200 rounded-md"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-black">Finance</span>
          <span className="text-lg font-bold text-black">Guy</span>
        </div>
      </Link>
      
      <div className="flex flex-col flex-1">
        <NavLinks />
        <div className="flex-1" /> {/* Spacer */}
        <form className="mt-auto">
          <button className="w-full flex items-center justify-start gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600">
            <div>Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
