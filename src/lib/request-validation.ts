import { z } from "zod";

/**
 * Shared validation schema for FOIA request data.
 * Used both in form submission and when reading from localStorage.
 */
export const requestSchema = z.object({
  agencyName: z
    .string()
    .trim()
    .min(2, { message: "Agency name must be at least 2 characters" })
    .max(200, { message: "Agency name must be less than 200 characters" }),
  agencyType: z.string().min(1, { message: "Please select an agency type" }),
  recordType: z.string().min(1, { message: "Please select a record type" }),
  recordDescription: z
    .string()
    .trim()
    .min(20, { message: "Please provide at least 20 characters describing what you're looking for" })
    .max(2000, { message: "Description must be less than 2000 characters" }),
});

export type RequestFormData = z.infer<typeof requestSchema>;

/**
 * Validates request data and returns the validated data or null.
 */
export const validateRequestData = (data: unknown): RequestFormData | null => {
  const result = requestSchema.safeParse(data);
  if (result.success) {
    return result.data;
  }
  return null;
};
