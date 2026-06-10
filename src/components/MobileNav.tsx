"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/constants/navItems";
import React from "react";

interface Props {
  id: string;
  open: boolean;
  closeMenu: () => void;
}

function isCurrentPath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

const MobileNav = React.memo(({ id, open, closeMenu }: Props) => {
  const pathname = usePathname();

  return (
    <div id={id} className="contents">
      {open && (
        <ul
          aria-label="Mobile navigation"
          className="fixed inset-0 z-30 flex h-screen min-h-screen flex-col gap-1 overflow-y-auto bg-white px-8 pb-8 pt-[104px] text-foreground dark:bg-black dark:text-white md:hidden"
        >
          {navItems.map(({ href, label, title }) => {
            const isCurrent = isCurrentPath(pathname, href);

            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex min-h-12 items-center px-1 text-[18px] font-light uppercase tracking-[0.12em] transition-opacity hover:opacity-70 ${
                    isCurrent ? "text-foreground dark:text-white" : ""
                  }`}
                  aria-label={label}
                  aria-current={isCurrent ? "page" : undefined}
                  onClick={closeMenu}
                >
                  {title}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
});

MobileNav.displayName = "MobileNav";

export default MobileNav;
