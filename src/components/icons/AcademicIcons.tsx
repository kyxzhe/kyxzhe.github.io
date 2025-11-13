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
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      <circle cx="12" cy="12" r="10" fill="#A6CE39" />
      <path
        fill="#fff"
        d="M9.2 7.5v9h-1.7v-9h1.7zm3.5-.1c2.4 0 4.3 1.9 4.3 4.5 0 2.7-1.9 4.7-4.3 4.7s-4.3-2-4.3-4.7c0-2.6 1.9-4.5 4.3-4.5zm0 1.6c-1.5 0-2.6 1.3-2.6 2.9 0 1.7 1.1 3 2.6 3s2.6-1.3 2.6-3c0-1.6-1.1-2.9-2.6-2.9z"
      />
    </svg>
  );
}
