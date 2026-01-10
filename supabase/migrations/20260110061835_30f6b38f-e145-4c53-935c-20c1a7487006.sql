-- Drop the overly permissive storage policy
DROP POLICY IF EXISTS "Service role can upload documents" ON storage.objects;

-- Create a more restrictive policy for document uploads
-- Documents can only be uploaded via backend with proper validation
-- This policy allows authenticated users to upload to their own folder
CREATE POLICY "Authenticated users can upload their documents"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'foia-documents' 
  AND auth.uid() IS NOT NULL
  AND auth.uid()::text = (storage.foldername(name))[1]
);