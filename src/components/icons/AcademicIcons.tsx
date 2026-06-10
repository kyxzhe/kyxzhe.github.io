import { SVGProps } from "react";

export function GoogleScholarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M5.242 13.769 0 9.5 12 0l12 9.5-5.242 4.269A7.496 7.496 0 0 0 12 9.5a7.496 7.496 0 0 0-6.758 4.269Z"
        fill="currentColor"
      />
      <path
        d="M12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function OrcidIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M16 0c-8.839 0-16 7.161-16 16s7.161 16 16 16c8.839 0 16-7.161 16-16S24.839 0 16 0ZM9.823 5.839c.704 0 1.265.573 1.265 1.26 0 .688-.561 1.265-1.265 1.265-.692-.004-1.26-.567-1.26-1.265 0-.697.563-1.26 1.26-1.26ZM8.864 9.885h1.923v13.391H8.864Zm4.751 0h5.197c4.948 0 7.125 3.541 7.125 6.703 0 3.439-2.687 6.699-7.099 6.699h-5.224Zm1.921 1.74v9.927h3.063c4.365 0 5.365-3.312 5.365-4.964 0-2.687-1.713-4.963-5.464-4.963Z"
        fill="currentColor"
      />
    </svg>
  );
}
