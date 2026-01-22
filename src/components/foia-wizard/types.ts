// Types for the AI-Guided FOIA Request Builder

export interface WizardState {
  // Step 1: Agency
  agencyName: string;
  agencyCity: string;
  agencyState: string;
  jurisdictionType: "federal" | "state" | "local" | "";
  
  // Step 2: Records Description
  recordsDescription: string;
  
  // Step 3: Date/Timeframe
  dateType: "exact" | "range" | "not-sure" | "";
  exactDate: string;
  dateRangeStart: string;
  dateRangeEnd: string;
  
  // Step 4: Related Identifiers (Optional)
  relatedNames: string;
  caseNumber: string;
  relatedAddress: string;
  
  // Step 5: Format Preference
  formatPreference: "digital" | "physical" | "easiest" | "";
  
  // Step 6: Additional Context (Optional)
  additionalContext: string;
}

export interface GeneratedRequest {
  message: string;
  estimatedResponseTime: string;
  tips: string[];
}

export type WizardStep = 
  | "agency"
  | "records"
  | "timeframe"
  | "identifiers"
  | "format"
  | "context"
  | "generating"
  | "preview"
  | "auth"
  | "plan-selection"
  | "success";

export const WIZARD_STEPS: { id: WizardStep; label: string; required: boolean }[] = [
  { id: "agency", label: "Agency", required: true },
  { id: "records", label: "Records", required: true },
  { id: "timeframe", label: "Timeframe", required: true },
  { id: "identifiers", label: "Details", required: false },
  { id: "format", label: "Format", required: true },
  { id: "context", label: "Context", required: false },
];

export const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming", "District of Columbia"
];

export const FEDERAL_AGENCIES = [
  "Federal Bureau of Investigation (FBI)",
  "Central Intelligence Agency (CIA)",
  "Department of Defense (DOD)",
  "Department of Justice (DOJ)",
  "Department of State",
  "Department of Homeland Security (DHS)",
  "Environmental Protection Agency (EPA)",
  "Internal Revenue Service (IRS)",
  "National Security Agency (NSA)",
  "Securities and Exchange Commission (SEC)",
  "Federal Communications Commission (FCC)",
  "Federal Trade Commission (FTC)",
  "Department of Education",
  "Department of Health and Human Services (HHS)",
  "Department of Transportation (DOT)",
  "Department of Veterans Affairs (VA)",
  "Immigration and Customs Enforcement (ICE)",
  "Customs and Border Protection (CBP)",
  "National Archives and Records Administration (NARA)",
  "Office of Personnel Management (OPM)",
];

export const initialWizardState: WizardState = {
  agencyName: "",
  agencyCity: "",
  agencyState: "",
  jurisdictionType: "",
  recordsDescription: "",
  dateType: "",
  exactDate: "",
  dateRangeStart: "",
  dateRangeEnd: "",
  relatedNames: "",
  caseNumber: "",
  relatedAddress: "",
  formatPreference: "",
  additionalContext: "",
};
