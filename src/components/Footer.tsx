interface FooterProps {
  className?: string;
}

export default function Footer({ className = "" }: FooterProps) {
  return (
    <footer className={`py-4 ${className}`} aria-hidden="true">
      <div className="h-4" />
    </footer>
  );
}
