import { motion } from "framer-motion";
import { Check, Clock, FileSearch, Send, CheckCircle } from "lucide-react";
import { format } from "date-fns";

interface TimelineStep {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  status: "completed" | "current" | "upcoming";
  date?: string;
}

interface RequestTimelineProps {
  currentStatus: string;
  createdAt: string;
  updatedAt: string;
}

const getTimelineSteps = (status: string, createdAt: string, updatedAt: string): TimelineStep[] => {
  const normalizedStatus = status.toLowerCase();
  
  const steps: TimelineStep[] = [
    {
      id: "submitted",
      label: "Request Submitted",
      description: "Your FOIA request has been received",
      icon: Send,
      status: "completed",
      date: createdAt,
    },
    {
      id: "review",
      label: "Under Review",
      description: "Our team is reviewing your request",
      icon: FileSearch,
      status: normalizedStatus === "pending" ? "current" : "completed",
      date: normalizedStatus !== "pending" ? updatedAt : undefined,
    },
    {
      id: "processing",
      label: "Processing",
      description: "Request filed with the agency",
      icon: Clock,
      status: 
        normalizedStatus === "in_progress" || normalizedStatus === "processing" 
          ? "current" 
          : normalizedStatus === "completed" || normalizedStatus === "rejected" || normalizedStatus === "denied"
            ? "completed"
            : "upcoming",
      date: normalizedStatus === "in_progress" || normalizedStatus === "processing" ? updatedAt : undefined,
    },
    {
      id: "completed",
      label: "Completed",
      description: "Documents available for download",
      icon: CheckCircle,
      status: normalizedStatus === "completed" ? "completed" : normalizedStatus === "rejected" || normalizedStatus === "denied" ? "upcoming" : "upcoming",
      date: normalizedStatus === "completed" ? updatedAt : undefined,
    },
  ];

  return steps;
};

const RequestTimeline = ({ currentStatus, createdAt, updatedAt }: RequestTimelineProps) => {
  const steps = getTimelineSteps(currentStatus, createdAt, updatedAt);

  return (
    <div className="relative">
      {steps.map((step, index) => {
        const StepIcon = step.icon;
        const isLast = index === steps.length - 1;
        
        return (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative flex gap-4"
          >
            {/* Vertical line */}
            {!isLast && (
              <div className="absolute left-5 top-10 w-0.5 h-full -ml-px">
                <div 
                  className={`w-full h-full ${
                    step.status === "completed" 
                      ? "bg-primary" 
                      : "bg-border"
                  }`}
                />
              </div>
            )}
            
            {/* Icon */}
            <div 
              className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full shrink-0 ${
                step.status === "completed"
                  ? "bg-primary text-primary-foreground"
                  : step.status === "current"
                    ? "bg-primary/20 text-primary border-2 border-primary"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {step.status === "completed" ? (
                <Check className="w-5 h-5" />
              ) : (
                <StepIcon className={`w-5 h-5 ${step.status === "current" ? "animate-pulse" : ""}`} />
              )}
            </div>
            
            {/* Content */}
            <div className={`pb-8 ${isLast ? "pb-0" : ""}`}>
              <div className="flex items-center gap-2">
                <p 
                  className={`font-medium ${
                    step.status === "upcoming" ? "text-muted-foreground" : "text-foreground"
                  }`}
                >
                  {step.label}
                </p>
                {step.status === "current" && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary">
                    Current
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {step.description}
              </p>
              {step.date && (
                <p className="text-xs text-muted-foreground mt-1">
                  {format(new Date(step.date), "MMM d, yyyy 'at' h:mm a")}
                </p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default RequestTimeline;
