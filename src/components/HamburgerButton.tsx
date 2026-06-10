import React from 'react';

interface Props {
  open: boolean;
  onClick: () => void;
  controlsId: string;
  buttonRef?: React.Ref<HTMLButtonElement>;
}

const HamburgerButton = React.memo(({ open, onClick, controlsId, buttonRef }: Props) => (
  <button
    ref={buttonRef}
    type="button"
    className="relative z-50 flex h-11 w-11 flex-col items-center justify-center rounded-full md:hidden"
    aria-label={open ? 'Close menu' : 'Open menu'}
    aria-expanded={open}
    aria-controls={controlsId}
    onClick={onClick}
  >
    <span aria-hidden="true" className={`block h-0.5 w-6 bg-foreground transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`} />
    <span aria-hidden="true" className={`block h-0.5 w-6 bg-foreground transition-all duration-300 my-1 ${open ? 'opacity-0' : ''}`} />
    <span aria-hidden="true" className={`block h-0.5 w-6 bg-foreground transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
  </button>
));

HamburgerButton.displayName = 'HamburgerButton';

export default HamburgerButton;
