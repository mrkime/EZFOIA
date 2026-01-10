import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
}

const Logo = ({ className = "" }: LogoProps) => {
  return (
    <Link to="/" className={`flex items-center gap-2.5 group ${className}`}>
      {/* Simple line art document icon */}
      <svg
        width="28"
        height="32"
        viewBox="0 0 28 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary transition-transform group-hover:scale-105"
      >
        {/* Document outline */}
        <path
          d="M2 4C2 2.89543 2.89543 2 4 2H17L26 11V28C26 29.1046 25.1046 30 24 30H4C2.89543 30 2 29.1046 2 28V4Z"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Folded corner */}
        <path
          d="M17 2V8C17 9.10457 17.8954 10 19 10H26"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Text lines */}
        <path
          d="M7 16H21"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M7 21H17"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
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