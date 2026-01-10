-- Create documents table to track returned files for FOIA requests
CREATE TABLE public.foia_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID NOT NULL REFERENCES public.foia_requests(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.foia_documents ENABLE ROW LEVEL SECURITY;

-- Users can view documents for their own requests
CREATE POLICY "Users can view documents for their requests"
ON public.foia_documents
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.foia_requests
    WHERE foia_requests.id = foia_documents.request_id
    AND foia_requests.user_id = auth.uid()
  )
);

-- Create storage bucket for FOIA documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('foia-documents', 'foia-documents', false);

-- Storage policies for FOIA documents
CREATE POLICY "Users can view their own documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'foia-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Service role can upload documents"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'foia-documents');