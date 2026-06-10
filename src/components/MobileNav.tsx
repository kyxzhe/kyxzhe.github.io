import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { navItems } from '@/lib/constants/navItems';
import { mobileMenuVariants } from '@/lib/animation/variants';
import React from 'react';

interface Props {
  id: string;
  open: boolean;
  closeMenu: () => void;
}

const MobileNav = React.memo(({ id, open, closeMenu }: Props) => (
  <AnimatePresence>
    {open && (
      <motion.ul
        id={id}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={mobileMenuVariants}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed inset-0 z-30 flex h-screen min-h-screen flex-col gap-1 overflow-y-auto bg-white px-8 pb-8 pt-[104px] text-foreground dark:bg-black dark:text-white md:hidden"
      >
        {navItems.map(({ href, label, title }) => (
          <li key={href}>
            <Link
              href={href}
              className="flex min-h-12 items-center px-1 text-[18px] font-light uppercase tracking-[0.12em] transition-opacity hover:opacity-70"
              aria-label={label}
              onClick={closeMenu}
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
