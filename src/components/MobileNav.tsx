import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { navItems } from '@/lib/constants/navItems';
import { mobileMenuVariants } from '@/lib/animation/variants';
import React from 'react';

interface Props {
  open: boolean;
  closeMenu: () => void;
}

const MobileNav = React.memo(({ open, closeMenu }: Props) => (
  <AnimatePresence>
    {open && (
      <motion.ul
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={mobileMenuVariants}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="absolute left-0 right-0 top-full z-50 mt-2 flex flex-col gap-1 bg-[var(--background)] px-1 pb-5 pt-3 text-foreground dark:text-white md:hidden"
        role="menu"
      >
        {navItems.map(({ href, label, title }) => (
          <li key={href}>
            <Link
              href={href}
              className="flex min-h-12 items-center px-1 text-[18px] font-light uppercase tracking-[0.12em] transition-opacity hover:opacity-70"
              aria-label={label}
              onClick={closeMenu}
              role="menuitem"
              tabIndex={0}
            >
              {title}
            </Link>
          </li>
        ))}
      </motion.ul>
    )}
  </AnimatePresence>
));

MobileNav.displayName = 'MobileNav';

export default MobileNav;
