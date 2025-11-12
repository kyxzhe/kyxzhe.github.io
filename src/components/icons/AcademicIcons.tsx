import { SVGProps } from "react";

export function GoogleScholarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M3 7.5 12 12l9-4.5-9-4.5-9 4.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 11.5v5.2c0 .5.3.9.8 1.2l4.2 2.1c.6.3 1.4.3 2 0l4.2-2.1c.5-.3.8-.7.8-1.2v-5.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="11.3" r="1.8" fill="currentColor" />
    </svg>
  );
}

export function OrcidIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      <circle cx="12" cy="12" r="10" fill="#A6CE39" />
      <path
        fill="#fff"
        d="M9.2 7.5v9h-1.7v-9h1.7zm3.5-.1c2.4 0 4.3 1.9 4.3 4.5 0 2.7-1.9 4.7-4.3 4.7s-4.3-2-4.3-4.7c0-2.6 1.9-4.5 4.3-4.5zm0 1.6c-1.5 0-2.6 1.3-2.6 2.9 0 1.7 1.1 3 2.6 3s2.6-1.3 2.6-3c0-1.6-1.1-2.9-2.6-2.9z"
      />
    </svg>
  );
}
