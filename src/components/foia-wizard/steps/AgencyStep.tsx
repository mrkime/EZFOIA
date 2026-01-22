import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, MapPin, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { WizardState, US_STATES, FEDERAL_AGENCIES } from "../types";

interface AgencyStepProps {
  data: WizardState;
  onUpdate: (updates: Partial<WizardState>) => void;
  onNext: () => void;
}

export const AgencyStep = ({ data, onUpdate, onNext }: AgencyStepProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredAgencies, setFilteredAgencies] = useState<string[]>([]);

  useEffect(() => {
    if (data.agencyName && data.jurisdictionType === "federal") {
      const filtered = FEDERAL_AGENCIES.filter(agency =>
        agency.toLowerCase().includes(data.agencyName.toLowerCase())
      );
      setFilteredAgencies(filtered);
      setShowSuggestions(filtered.length > 0 && data.agencyName.length >= 2);
    } else {
      setShowSuggestions(false);
    }
  }, [data.agencyName, data.jurisdictionType]);

  // Auto-detect jurisdiction based on agency name
  useEffect(() => {
    if (!data.jurisdictionType && data.agencyName) {
      const lowerName = data.agencyName.toLowerCase();
      if (
        lowerName.includes("fbi") ||
        lowerName.includes("cia") ||
        lowerName.includes("federal") ||
        lowerName.includes("department of") ||
        lowerName.includes("national") ||
        FEDERAL_AGENCIES.some(a => a.toLowerCase().includes(lowerName))
      ) {
        onUpdate({ jurisdictionType: "federal" });
      } else if (lowerName.includes("city of") || lowerName.includes("county")) {
        onUpdate({ jurisdictionType: "local" });
      }
    }
  }, [data.agencyName]);

  const isValid = data.agencyName.trim().length >= 2 && data.jurisdictionType;

  const handleSelectAgency = (agency: string) => {
    onUpdate({ agencyName: agency });
    setShowSuggestions(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Question Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-7 h-7 text-primary" />
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
          Which government agency are you requesting records from?
        </h2>
        <p className="text-muted-foreground">
          Start typing and we'll help you find the right agency.
        </p>
      </div>

      {/* Agency Type Selection */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label>Agency Level</Label>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="w-4 h-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p><strong>Federal:</strong> FBI, CIA, DOJ, EPA, etc.</p>
              <p><strong>State:</strong> State police, DMV, state agencies</p>
              <p><strong>Local:</strong> City/county offices, local police</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: "federal", label: "Federal" },
            { value: "state", label: "State" },
            { value: "local", label: "Local" },
          ].map((option) => (
            <Button
              key={option.value}
              type="button"
              variant={data.jurisdictionType === option.value ? "default" : "outline"}
              className={`h-12 ${data.jurisdictionType === option.value ? "ring-2 ring-primary" : ""}`}
              onClick={() => onUpdate({ jurisdictionType: option.value as "federal" | "state" | "local" })}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Agency Name Input */}
      <div className="space-y-2 relative">
        <Label htmlFor="agencyName">Agency Name</Label>
        <Input
          id="agencyName"
          placeholder="e.g., FBI, Department of Education, City of Austin"
          value={data.agencyName}
          onChange={(e) => onUpdate({ agencyName: e.target.value })}
          className="h-12 text-lg"
          autoFocus
        />
        
        {/* Autocomplete Suggestions */}
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto"
          >
            {filteredAgencies.map((agency) => (
              <button
                key={agency}
                type="button"
                className="w-full px-4 py-2 text-left hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg"
                onClick={() => handleSelectAgency(agency)}
              >
                {agency}
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Location (for state/local) */}
      {(data.jurisdictionType === "state" || data.jurisdictionType === "local") && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">Location helps us route your request correctly</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>State</Label>
              <Select 
                value={data.agencyState} 
                onValueChange={(value) => onUpdate({ agencyState: value })}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {US_STATES.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {data.jurisdictionType === "local" && (
              <div className="space-y-2">
                <Label>City/County</Label>
                <Input
                  placeholder="e.g., Austin, Travis County"
                  value={data.agencyCity}
                  onChange={(e) => onUpdate({ agencyCity: e.target.value })}
                  className="h-12"
                />
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Continue Button */}
      <div className="pt-4">
        <Button
          variant="hero"
          size="lg"
          className="w-full h-14 text-lg"
          disabled={!isValid}
          onClick={onNext}
        >
          Continue
        </Button>
        
        {!isValid && (
          <p className="text-center text-sm text-muted-foreground mt-2">
            Please select an agency level and enter the agency name
          </p>
        )}
      </div>
    </motion.div>
  );
};
