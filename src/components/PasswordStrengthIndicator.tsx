import zxcvbn from "zxcvbn";
import { Progress } from "@/components/ui/progress";
import { Check, X, AlertTriangle, Shield, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

const strengthLabels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
const strengthColors = [
  "bg-destructive",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-emerald-500",
  "bg-primary",
];

const getStrengthIcon = (score: number) => {
  if (score <= 1) return <X className="w-4 h-4" />;
  if (score === 2) return <AlertTriangle className="w-4 h-4" />;
  if (score === 3) return <Shield className="w-4 h-4" />;
  return <ShieldCheck className="w-4 h-4" />;
};

export const PasswordStrengthIndicator = ({
  password,
  className,
}: PasswordStrengthIndicatorProps) => {
  if (!password) return null;

  const result = zxcvbn(password);
  const score = result.score; // 0-4
  const progressValue = ((score + 1) / 5) * 100;

  const requirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains a number", met: /\d/.test(password) },
    { label: "Contains uppercase", met: /[A-Z]/.test(password) },
    { label: "Contains special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  return (
    <div className={cn("space-y-3", className)}>
      {/* Strength Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Password Strength</span>
          <span
            className={cn(
              "flex items-center gap-1 font-medium",
              score <= 1 && "text-destructive",
              score === 2 && "text-yellow-500",
              score >= 3 && "text-emerald-500"
            )}
          >
            {getStrengthIcon(score)}
            {strengthLabels[score]}
          </span>
        </div>
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-300 rounded-full",
              strengthColors[score]
            )}
            style={{ width: `${progressValue}%` }}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="grid grid-cols-2 gap-1.5">
        {requirements.map((req, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center gap-1.5 text-xs transition-colors",
              req.met ? "text-emerald-500" : "text-muted-foreground"
            )}
          >
            {req.met ? (
              <Check className="w-3 h-3" />
            ) : (
              <X className="w-3 h-3" />
            )}
            {req.label}
          </div>
        ))}
      </div>

      {/* Feedback from zxcvbn */}
      {result.feedback.warning && (
        <p className="text-xs text-amber-500 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          {result.feedback.warning}
        </p>
      )}
      {result.feedback.suggestions.length > 0 && score < 3 && (
        <p className="text-xs text-muted-foreground">
          💡 {result.feedback.suggestions[0]}
        </p>
      )}
    </div>
  );
};

export const isPasswordStrong = (password: string): boolean => {
  const result = zxcvbn(password);
  return result.score >= 2; // Require at least "Fair" strength
};
