'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useNavigation } from '@/hooks/useNavigation';
import HamburgerButton from './HamburgerButton';
import MobileNav from './MobileNav';

export default function MobileMenu() {
  const { menuOpen, toggleMenu, closeMenu } = useNavigation();
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const mobileMenuId = 'mobile-navigation';

  const closeMenuAndRestoreFocus = useCallback(() => {
    closeMenu();
    window.setTimeout(() => menuButtonRef.current?.focus(), 0);
  }, [closeMenu]);

  useEffect(() => {
    if (!menuOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenuAndRestoreFocus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeMenuAndRestoreFocus, menuOpen]);

  return (
    <>
      <HamburgerButton
        open={menuOpen}
        onClick={toggleMenu}
        controlsId={mobileMenuId}
        buttonRef={menuButtonRef}
      />
      <MobileNav id={mobileMenuId} open={menuOpen} closeMenu={closeMenu} />
    </>
  );
}
