"use client";
import Link from 'next/link';
import NavLinks from '@/app/ui/nav-links';
import Image from 'next/image';
import { cn } from '@/app/lib/utils';
import { useState } from 'react';

export default function SideNav() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={cn(
        "flex h-full flex-col border-r bg-gray-100/40 px-2 py-4 transition-all duration-300",
        isHovered ? "w-[240px]" : "w-[80px]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        className={cn(
          "mb-4 flex h-20 items-center rounded-md bg-gray-100 px-4 font-medium hover:bg-sky-100 transition-colors",
          isHovered ? "justify-start gap-2" : "justify-center"
        )}
        href="/"
      >
        <div className="relative h-16 w-16 flex-shrink-0">
          <Image
            src="/stonks.png"
            alt="Stonks meme"
            fill
            priority={true}
            className="object-contain transform hover:scale-105 transition-transform duration-200 rounded-md"
          />
        </div>
        <div className={cn(
          "flex flex-col overflow-hidden transition-all duration-300",
          isHovered ? "opacity-100 w-auto" : "opacity-0 w-0"
        )}>
          <span className="text-lg font-bold text-black">Finance</span>
          <span className="text-lg font-bold text-black">Guy</span>
        </div>
      </Link>
      
      <div className="flex flex-col flex-1">
        <NavLinks collapsed={!isHovered} />
        <div className="flex-1" />
        <form className="mt-auto">
          <button className={cn(
            "w-full flex items-center rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600",
            isHovered ? "justify-start gap-2" : "justify-center"
          )}>
            <div>Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
