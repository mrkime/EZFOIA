import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Formats a phone number for display: (XXX) XXX-XXXX
 */
function formatPhoneDisplay(digits: string): string {
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

/**
 * Extracts only the 10 US digits from a phone value (strips +1 and formatting)
 */
function extractDigits(value: string): string {
  const allDigits = value.replace(/\D/g, "");
  // If starts with 1 and has 11 digits, strip leading 1
  if (allDigits.length === 11 && allDigits.startsWith("1")) {
    return allDigits.slice(1);
  }
  return allDigits.slice(0, 10);
}

/**
 * Converts 10 digits to E.164 format: +1XXXXXXXXXX
 */
function toE164(digits: string): string {
  if (digits.length === 0) return "";
  return `+1${digits}`;
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, value, onChange, ...props }, ref) => {
    // Use local state for digits to avoid re-render issues
    const [localDigits, setLocalDigits] = React.useState(() => extractDigits(value));
    
    // Sync local state with prop changes (e.g., form reset)
    React.useEffect(() => {
      const propDigits = extractDigits(value);
      if (propDigits !== localDigits) {
        setLocalDigits(propDigits);
      }
    }, [value]);

    const displayValue = formatPhoneDisplay(localDigits);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawInput = e.target.value;
      // Extract only new digits from the raw input
      const inputDigits = rawInput.replace(/\D/g, "").slice(0, 10);
      
      setLocalDigits(inputDigits);
      onChange(toE164(inputDigits));
    };

    return (
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground select-none pointer-events-none">
          +1
        </span>
        <Input
          ref={ref}
          type="tel"
          inputMode="numeric"
          className={cn("pl-10", className)}
          value={displayValue}
          onChange={handleChange}
          placeholder="(555) 123-4567"
          {...props}
        />
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
