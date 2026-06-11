import React from 'react';

interface Props {
  open: boolean;
  onClick: () => void;
}

const HamburgerButton = React.memo(({ open, onClick }: Props) => (
  <button
    className="relative z-50 md:hidden flex flex-col justify-center items-center w-11 h-11 focus:outline-none"
    aria-label={open ? 'Close menu' : 'Open menu'}
    aria-expanded={open}
    onClick={onClick}
  >
    <span className={`block h-0.5 w-6 bg-foreground transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`} />
    <span className={`block h-0.5 w-6 bg-foreground transition-all duration-300 my-1 ${open ? 'opacity-0' : ''}`} />
    <span className={`block h-0.5 w-6 bg-foreground transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
  </button>
));

HamburgerButton.displayName = 'HamburgerButton';

export default HamburgerButton;
