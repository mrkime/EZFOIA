import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, Wand2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface AIDescriptionAssistantProps {
  agencyName: string;
  agencyType: string;
  recordType: string;
  currentDescription: string;
  onSuggestion: (suggestion: string) => void;
}

const AIDescriptionAssistant = ({
  agencyName,
  agencyType,
  recordType,
  currentDescription,
  onSuggestion,
}: AIDescriptionAssistantProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const { toast } = useToast();

  const generateSuggestion = async () => {
    setIsGenerating(true);
    setSuggestion(null);

    try {
      const { data, error } = await supabase.functions.invoke("foia-assistant", {
        body: {
          agencyName,
          agencyType,
          recordType,
          currentDescription,
        },
      });

      if (error) throw error;
      
      if (data?.suggestion) {
        setSuggestion(data.suggestion);
      } else {
        throw new Error("No suggestion received");
      }
    } catch (error: any) {
      console.error("AI assistant error:", error);
      toast({
        title: "AI Assistant Error",
        description: error?.message || "Failed to generate suggestion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const applySuggestion = () => {
    if (suggestion) {
      onSuggestion(suggestion);
      setSuggestion(null);
      toast({
        title: "Suggestion Applied",
        description: "The AI-generated description has been added to your request.",
      });
    }
  };

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={generateSuggestion}
        disabled={isGenerating}
        className="gap-2 text-primary border-primary/30 hover:bg-primary/10"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            {currentDescription ? "Improve with AI" : "Generate with AI"}
          </>
        )}
      </Button>

      <AnimatePresence>
        {suggestion && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-lg border border-primary/30 bg-primary/5 p-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Wand2 className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary mb-2">AI Suggestion</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{suggestion}</p>
                <div className="flex gap-2 mt-3">
                  <Button
                    type="button"
                    size="sm"
                    onClick={applySuggestion}
                    className="gap-1"
                  >
                    Use This
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setSuggestion(null)}
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIDescriptionAssistant;
