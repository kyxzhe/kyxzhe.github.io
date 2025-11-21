'use client'
import Link from 'next/link';
import { navItems } from '@/lib/constants/navItems';
import { useNavigation } from '@/hooks/useNavigation';
import HamburgerButton from './HamburgerButton';
import MobileNav from './MobileNav';

export default function Navbar() {
  const { menuOpen, toggleMenu, closeMenu } = useNavigation();
  return (
    <header className="w-full mb-12 md:mb-14" role="banner">
      <nav
        className="flex flex-row justify-between items-center md:flex-row md:items-center relative z-10 px-1 md:px-2"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="flex flex-row gap-2 items-center"
          aria-label="Go to homepage"
        >
          <span className="text-[0.92rem] md:text-[0.98rem] uppercase font-light italic tracking-[0.12em]">Kevin</span>
          <span className="text-[0.92rem] md:text-[0.98rem] uppercase font-semibold tracking-[0.12em]">Zheng</span>
          <span className="chip text-[0.55rem] uppercase tracking-[0.26em] px-2 py-[0.38rem]">
            Beta
          </span>
        </Link>
        <HamburgerButton open={menuOpen} onClick={toggleMenu} />
        <ul className="hidden md:flex flex-row gap-12 list-none m-0 items-center text-[0.82rem] uppercase tracking-[0.16em] text-muted-foreground">
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
