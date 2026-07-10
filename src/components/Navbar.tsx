'use client'
import { useEffect } from 'react';
import Link from 'next/link';
import { navItems } from '@/lib/constants/navItems';
import { useNavigation } from '@/hooks/useNavigation';
import HamburgerButton from './HamburgerButton';
import MobileNav from './MobileNav';

export default function Navbar() {
  const { menuOpen, toggleMenu, closeMenu } = useNavigation();

  useEffect(() => {
    if (!menuOpen) return;

    const originalOverflow = document.body.style.overflow;
    const trigger = document.querySelector<HTMLButtonElement>('[aria-controls="mobile-navigation"]');
    const menu = document.getElementById('mobile-navigation');
    const desktopQuery = window.matchMedia('(min-width: 768px)');
    const focusable = () => [
      trigger,
      ...Array.from(menu?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []),
    ].filter((item): item is HTMLElement => Boolean(item));

    document.body.style.overflow = 'hidden';
    focusable()[1]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
        return;
      }

      if (event.key !== 'Tab') return;
      const items = focusable();
      const first = items[0];
      const last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    const handleDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) closeMenu();
    };

    document.addEventListener('keydown', handleKeyDown);
    desktopQuery.addEventListener('change', handleDesktop);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      desktopQuery.removeEventListener('change', handleDesktop);
      if (!desktopQuery.matches) trigger?.focus();
    };
  }, [closeMenu, menuOpen]);

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-40 w-full bg-[var(--background)]/90 px-6 pb-2 pt-[18px] backdrop-blur-md supports-[backdrop-filter]:bg-[var(--background)]/78 md:px-[42px] md:pt-6" role="banner">
        <nav
          className="relative z-10 flex flex-row items-center justify-between px-2 py-2 md:flex-row md:items-center md:px-4"
          aria-label="Main navigation"
        >
          <Link
            href="/"
            className="relative z-50 flex flex-row gap-2 items-center"
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
      <div className="h-[108px] md:h-[98px]" aria-hidden="true" />
    </>
  );
}
