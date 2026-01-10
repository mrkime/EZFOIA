-- Create enum for app roles if not exists
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create user_roles table if not exists
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;
CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;
CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Admin policies for foia_requests
DROP POLICY IF EXISTS "Admins can view all requests" ON public.foia_requests;
CREATE POLICY "Admins can view all requests"
ON public.foia_requests
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update any request" ON public.foia_requests;
CREATE POLICY "Admins can update any request"
ON public.foia_requests
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Admin policies for foia_documents
DROP POLICY IF EXISTS "Admins can view all documents" ON public.foia_documents;
CREATE POLICY "Admins can view all documents"
ON public.foia_documents
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can insert documents" ON public.foia_documents;
CREATE POLICY "Admins can insert documents"
ON public.foia_documents
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update documents" ON public.foia_documents;
CREATE POLICY "Admins can update documents"
ON public.foia_documents
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can delete documents" ON public.foia_documents;
CREATE POLICY "Admins can delete documents"
ON public.foia_documents
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Storage policies for admin access
DROP POLICY IF EXISTS "Admins can upload documents" ON storage.objects;
CREATE POLICY "Admins can upload documents"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'foia-documents' AND public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can view all stored documents" ON storage.objects;
CREATE POLICY "Admins can view all stored documents"
ON storage.objects
FOR SELECT
USING (bucket_id = 'foia-documents' AND public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update stored documents" ON storage.objects;
CREATE POLICY "Admins can update stored documents"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'foia-documents' AND public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can delete stored documents" ON storage.objects;
CREATE POLICY "Admins can delete stored documents"
ON storage.objects
FOR DELETE
USING (bucket_id = 'foia-documents' AND public.has_role(auth.uid(), 'admin'::app_role));

-- User storage policy for viewing their own documents
DROP POLICY IF EXISTS "Users can view their own documents" ON storage.objects;
CREATE POLICY "Users can view their own documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'foia-documents' 
  AND EXISTS (
    SELECT 1 FROM public.foia_documents fd
    JOIN public.foia_requests fr ON fd.request_id = fr.id
    WHERE fd.file_path = name
    AND fr.user_id = auth.uid()
  )
);

-- Admin policies for profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
CREATE POLICY "Admins can update any profile"
ON public.profiles
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::app_role));