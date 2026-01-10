import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  secondaryDescription?: string;
  action?: {
    label: string;
    onClick?: () => void;
  };
  actionElement?: ReactNode;
  variant?: "default" | "minimal";
  className?: string;
}

const EmptyState = ({
  icon: Icon,
  title,
  description,
  secondaryDescription,
  action,
  actionElement,
  variant = "default",
  className,
}: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "flex flex-col items-center justify-center text-center",
        variant === "default" ? "py-12 px-4" : "py-8 px-4",
        className
      )}
    >
      {/* Animated icon container */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="relative mb-6"
      >
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl scale-150" />
        
        {/* Icon circle */}
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
          <Icon className="w-10 h-10 text-primary/70" strokeWidth={1.5} />
        </div>
        
        {/* Animated ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/30"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Text content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="max-w-sm"
      >
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-1">{description}</p>
        {secondaryDescription && (
          <p className="text-sm text-muted-foreground/70">{secondaryDescription}</p>
        )}
      </motion.div>

      {/* Action button */}
      {(action || actionElement) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-6"
        >
          {actionElement ? (
            actionElement
          ) : action ? (
            <Button variant="hero" onClick={action.onClick}>
              {action.label}
            </Button>
          ) : null}
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;
