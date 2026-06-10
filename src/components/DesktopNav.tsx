"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/constants/navItems";

function isCurrentPath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function DesktopNav() {
  const pathname = usePathname();

  return (
    <ul className="hidden md:flex flex-row gap-11 lg:gap-14 list-none m-0 items-center text-[17px] uppercase tracking-[0.13em] text-foreground font-light dark:text-white/80">
      {navItems.map(({ href, label, title }) => {
        const isCurrent = isCurrentPath(pathname, href);

        return (
          <li key={href}>
            <Link
              href={href}
              className={`inline-flex min-h-11 items-center transition-colors hover:text-foreground dark:hover:text-white ${
                isCurrent ? "text-foreground dark:text-white" : ""
              }`}
              aria-label={label}
              aria-current={isCurrent ? "page" : undefined}
              prefetch={true}
            >
              {title}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
