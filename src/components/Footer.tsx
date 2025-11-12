import { Heart } from "lucide-react";

interface FooterProps {
  className?: string;
}

export default function Footer({ className = "" }: FooterProps) {
  return (
    <footer className={`text-center py-4 ${className} absolute right-0 left-1/2 transform -translate-x-1/2 -bottom-12 md:-bottom-20 lg:-bottom-7`}>
      <div className="flex items-center justify-center gap-2 text-xs text-foreground/15 hover:text-foreground transition-colors duration-300">
        <span>Made with</span>
        <Heart size={12} className="text-red-500/30 hover:text-red-500 fill-current transition-colors duration-300" />
        <span>by</span>
        <a 
          href="https://github.com/mkhoirulwafa18"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors duration-300 hover:underline"
        >
          Wafastarz
        </a>
      </div>
    </footer>
  );
}