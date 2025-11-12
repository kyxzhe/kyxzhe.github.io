import { SVGProps } from "react";

export function GoogleScholarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      <path
        fill="#4285F4"
        d="M21.8 12.2c0-.7-.1-1.3-.2-1.9H12v3.6h5.6c-.2 1.4-1.1 2.6-2.5 3.4v2.8h4c2.3-2.1 3.7-5.1 3.7-7.9z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.9-.9 6.6-2.4l-4-2.8c-.7.5-1.6.8-2.6.8-2 0-3.7-1.4-4.3-3.2H3.4v3.1C5.1 19.9 8.3 22 12 22z"
      />
      <path
        fill="#FBBC05"
        d="M7.7 14.4c-.2-.6-.4-1.2-.4-1.9s.1-1.3.4-1.9V7.5H3.4A10 10 0 0 0 2 12c0 1.6.4 3.1 1.4 4.5l4.3-3.1z"
      />
      <path
        fill="#EA4335"
        d="M12 6.4c1.2 0 2.4.4 3.3 1.3l2.4-2.4C16.9 3.7 14.7 3 12 3 8.3 3 5.1 5.1 3.4 8l4.3 3.1c.6-1.8 2.3-3.2 4.3-3.2z"
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
