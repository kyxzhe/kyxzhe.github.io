import Link from "next/link";
import DesktopNav from "./DesktopNav";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
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
          <DesktopNav />
          <MobileMenu />
        </nav>
      </header>
      <div className="h-[108px] md:h-[98px]" aria-hidden="true" />
    </>
  );
}
