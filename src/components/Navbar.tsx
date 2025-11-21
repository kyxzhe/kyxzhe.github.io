'use client'
import Link from 'next/link';
import { navItems } from '@/lib/constants/navItems';
import { useNavigation } from '@/hooks/useNavigation';
import HamburgerButton from './HamburgerButton';
import MobileNav from './MobileNav';

export default function Navbar() {
  const { menuOpen, toggleMenu, closeMenu } = useNavigation();
  return (
    <header className="w-full mb-14 md:mb-16" role="banner">
      <nav
        className="flex flex-row justify-between items-center md:flex-row md:items-center relative z-10"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="flex flex-row gap-2 items-center"
          aria-label="Go to homepage"
        >
          <span className="text-sm md:text-base uppercase font-light italic tracking-[0.14em]">Kevin</span>
          <span className="text-sm md:text-base uppercase font-semibold tracking-[0.14em]">Zheng</span>
          <span className="chip text-[0.55rem] uppercase tracking-[0.28em] px-2 py-1">
            Beta
          </span>
        </Link>
        <HamburgerButton open={menuOpen} onClick={toggleMenu} />
        <ul className="hidden md:flex flex-row gap-14 list-none m-0 items-center text-[0.95rem] uppercase tracking-[0.12em] text-muted-foreground">
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
