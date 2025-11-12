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
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={closeMenu}
          aria-hidden="true"
        />
        <motion.ul
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={mobileMenuVariants}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute top-[80px] left-0 border border-accent w-full bg-card rounded-[20px] shadow-lg flex flex-col gap-6 py-8 px-10 z-50 md:hidden"
          role="menu"
        >
          {navItems.map(({ href, label, title }) => (
            <li key={href}>
              <Link
                href={href}
                className="text-xl uppercase font-light hover:opacity-80 transition-opacity"
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
      </>
    )}
  </AnimatePresence>
));

MobileNav.displayName = 'MobileNav';

export default MobileNav;