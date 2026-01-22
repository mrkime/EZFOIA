import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
}

const Logo = ({ className = "" }: LogoProps) => {
  return (
    <Link to="/" className={`flex items-center gap-2.5 group ${className}`}>
      {/* Sparkle star logo - AI-inspired with line art style */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary transition-transform group-hover:scale-105 group-hover:rotate-12"
      >
        {/* Main 4-point star */}
        <path
          d="M16 2L18.5 12.5L29 16L18.5 19.5L16 30L13.5 19.5L3 16L13.5 12.5L16 2Z"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Small accent sparkle - top right */}
        <path
          d="M25 4L26 7L29 8L26 9L25 12L24 9L21 8L24 7L25 4Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Tiny accent dot - bottom left */}
        <circle
          cx="6"
          cy="26"
          r="1.5"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
      
      {/* Text logo */}
      <div className="flex items-baseline">
        <span className="font-display text-xl font-bold tracking-tight text-foreground">
          EZ
        </span>
        <span className="font-display text-xl font-bold tracking-tight text-primary">
          FOIA
        </span>
      </div>
    </Link>
  );
};

export default Logo;