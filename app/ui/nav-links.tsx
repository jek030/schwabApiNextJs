"use client";
import {
  HomeIcon,
  TableCellsIcon,
  UserGroupIcon,
  CalendarIcon,
  EyeIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/app/lib/utils';
import { Button } from './button';

const mainLinks = [
  { 
    name: 'Home', 
    href: '/', 
    icon: HomeIcon 
  },
  {
    name: 'Accounts',
    href: '/accounts',
    icon: TableCellsIcon,
  },
  {
    name: 'Calendar',
    href: '/accounts/calendar',
    icon: CalendarIcon,
  },
  {
    name: 'Watchlists',
    href: '/watchlists',
    icon: EyeIcon,
  },
];

const marketLinks = [
  {
    name: 'Search',
    href: '/search',
    icon: UserGroupIcon,
  },
  {
    name: 'Crypto',
    href: '/crypto',
    icon: CurrencyDollarIcon,
  },
];

interface NavLinksProps {
  collapsed?: boolean;
}

export default function NavLinks({ collapsed = false }: NavLinksProps) {
  const pathname = usePathname();

  const NavButton = ({ link }: { link: typeof mainLinks[0] }) => {
    const LinkIcon = link.icon;
    return (
      <Button
        key={link.name}
        asChild
        variant={pathname === link.href ? "secondary" : "ghost"}
        className={cn(
          "w-full",
          collapsed ? "justify-center px-2" : "justify-start"
        )}
      >
        <Link href={link.href}>
          <LinkIcon className="h-4 w-4" />
          {!collapsed && <span className="ml-2">{link.name}</span>}
        </Link>
      </Button>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="px-2 py-2">
        <div className="space-y-1">
          {mainLinks.map((link) => (
            <NavButton key={link.name} link={link} />
          ))}
        </div>
      </div>

      <div className="px-4">
        <div className="h-px bg-gray-200" />
      </div>

      <div className="px-2 py-2">
        <div className="space-y-1">
          {marketLinks.map((link) => (
            <NavButton key={link.name} link={link} />
          ))}
        </div>
      </div>
    </div>
  );
}

