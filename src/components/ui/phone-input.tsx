import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Formats a phone number for display: +1 (XXX) XXX-XXXX
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
    // Extract digits from the stored E.164 value
    const digits = extractDigits(value);
    const displayValue = formatPhoneDisplay(digits);
    
    // Track cursor position for better UX
    const inputRef = React.useRef<HTMLInputElement>(null);
    
    // Merge refs
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const input = inputRef.current;
      if (!input) return;
      
      // Allow: backspace, delete, tab, escape, enter, arrow keys
      if (
        e.key === "Backspace" ||
        e.key === "Delete" ||
        e.key === "Tab" ||
        e.key === "Escape" ||
        e.key === "Enter" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowDown"
      ) {
        if (e.key === "Backspace" || e.key === "Delete") {
          e.preventDefault();
          // Remove last digit
          const newDigits = digits.slice(0, -1);
          onChange(toE164(newDigits));
        }
        return;
      }
      
      // Only allow digits
      if (!/^\d$/.test(e.key)) {
        e.preventDefault();
        return;
      }
      
      // Prevent if we're at max length
      if (digits.length >= 10) {
        e.preventDefault();
        return;
      }
      
      e.preventDefault();
      const newDigits = digits + e.key;
      onChange(toE164(newDigits));
    };

    return (
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground select-none pointer-events-none">
          +1
        </span>
        <Input
          ref={inputRef}
          type="tel"
          inputMode="numeric"
          className={cn("pl-10", className)}
          value={displayValue}
          onKeyDown={handleKeyDown}
          onChange={() => {}} // Controlled via onKeyDown
          placeholder="(555) 123-4567"
          {...props}
        />
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
