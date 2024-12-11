import Link from 'next/link';
import NavLinks from '@/app/ui/nav-links';
import Image from 'next/image';

export default function SideNav() {
  return (
    <div className="flex h-auto flex-col px-3 py-6 md:px-2 w-auto md:w-64">
      <Link
        className="mb-2 flex h-20 items-center justify-center rounded-md bg-blue-600 p-4 md:h-40 hover:bg-blue-500 transition-colors"
        href="/"
      >
        <Image
          src="/stonks.png"
          alt="Stonks meme"
          width={150}
          height={150}
          priority={true}
          style={{ width: 'auto', height: 'auto' }}
          className="w-32 md:w-40 transform hover:scale-105 transition-transform duration-200 rounded-md"
        />
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="border border-slate-300 hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <form>
          <button className="border border-slate-300 flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
