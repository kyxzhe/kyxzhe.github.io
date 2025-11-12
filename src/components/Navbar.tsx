'use client'
import Link from 'next/link';
import { navItems } from '@/lib/constants/navItems';
import { useNavigation } from '@/hooks/useNavigation';
import HamburgerButton from './HamburgerButton';
import MobileNav from './MobileNav';

export default function Navbar() {
  const { menuOpen, toggleMenu, closeMenu } = useNavigation();
  return (
    <header className="rounded-[20px] bg-card mb-4" role="banner">
      <nav className="flex flex-row justify-between px-4 py-4 lg:px-10 lg:py-6 items-center md:flex-row md:items-center relative" aria-label="Main navigation">
        <Link
          href="/"
          className="flex flex-row gap-1 items-center"
          aria-label="Go to homepage"
        >
          <span className="text-xl lg:text-2xl uppercase font-light italic">Lavanya</span>
          <span className="text-xl lg:text-2xl uppercase font-medium">Yasmeen</span>
        </Link>
        <HamburgerButton open={menuOpen} onClick={toggleMenu} />
        <ul className="hidden md:flex flex-row gap-20 list-none m-0 items-center">
          {navItems.map(({ href, label, title }) => (
            <li key={href}>
              <Link
                href={href}
                className="text-[1rem] uppercase font-light hover:opacity-80 transition-opacity"
                aria-label={label}
                prefetch={true}
              >
                {title}
              </Link>
            </li>
          ))}
        </ul>
        <MobileNav open={menuOpen} closeMenu={closeMenu} />
      </nav>
    </header>
  );
}