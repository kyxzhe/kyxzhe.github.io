interface FooterProps {
  className?: string;
}

export default function Footer({ className = "" }: FooterProps) {
  return <div className={`h-12 ${className}`} aria-hidden="true" />;
}
