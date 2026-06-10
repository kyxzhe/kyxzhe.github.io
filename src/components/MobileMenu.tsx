'use client';

import { useEffect } from 'react';
import { useNavigation } from '@/hooks/useNavigation';
import HamburgerButton from './HamburgerButton';
import MobileNav from './MobileNav';

export default function MobileMenu() {
  const { menuOpen, toggleMenu, closeMenu } = useNavigation();
  const mobileMenuId = 'mobile-navigation';

  useEffect(() => {
    if (!menuOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeMenu, menuOpen]);

  return (
    <>
      <HamburgerButton open={menuOpen} onClick={toggleMenu} controlsId={mobileMenuId} />
      <MobileNav id={mobileMenuId} open={menuOpen} closeMenu={closeMenu} />
    </>
  );
}
