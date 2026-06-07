'use client'
import Link from 'next/link';
import { navItems } from '@/lib/constants/navItems';
import { useNavigation } from '@/hooks/useNavigation';
import HamburgerButton from './HamburgerButton';
import MobileNav from './MobileNav';

export default function Navbar() {
  const { menuOpen, toggleMenu, closeMenu } = useNavigation();
  return (
    <header className="sticky top-0 z-40 mb-12 w-full bg-[var(--background)]/90 backdrop-blur-md supports-[backdrop-filter]:bg-[var(--background)]/78 md:mb-14" role="banner">
      <nav
        className="relative z-10 flex flex-row items-center justify-between px-2 py-2 md:flex-row md:items-center md:px-4"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="flex flex-row gap-2 items-center"
          aria-label="Go to homepage"
        >
          <span className="text-[17px] uppercase font-light italic tracking-[0.1em]">Kevin</span>
          <span className="text-[17px] uppercase font-semibold tracking-[0.1em]">Zheng</span>
        </Link>
        <HamburgerButton open={menuOpen} onClick={toggleMenu} />
        <ul className="hidden md:flex flex-row gap-11 lg:gap-14 list-none m-0 items-center text-[17px] uppercase tracking-[0.13em] text-foreground font-light dark:text-white/80">
          {navItems.map(({ href, label, title }) => (
            <li key={href}>
              <Link
                href={href}
                className="hover:text-foreground transition-colors"
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
