import { useState, useCallback } from 'react';

export function useNavigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = useCallback(() => setMenuOpen(prev => !prev), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  return { menuOpen, toggleMenu, closeMenu };
}