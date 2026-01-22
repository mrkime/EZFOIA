-- Add ai_summary column to foia_documents for storing AI-generated summaries
ALTER TABLE public.foia_documents 
ADD COLUMN IF NOT EXISTS ai_summary TEXT,
ADD COLUMN IF NOT EXISTS ai_summary_generated_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS extracted_text TEXT;