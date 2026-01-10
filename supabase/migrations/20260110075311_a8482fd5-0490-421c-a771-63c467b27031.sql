-- Fix PUBLIC_DATA_EXPOSURE: Add TO authenticated clause to all policies
-- This prevents unauthenticated (anonymous) users from accessing any data

-- ============================================
-- profiles table policies
-- ============================================
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
CREATE POLICY "Admins can update any profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- foia_requests table policies
-- ============================================
DROP POLICY IF EXISTS "Users can view their own requests" ON public.foia_requests;
CREATE POLICY "Users can view their own requests"
ON public.foia_requests
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all requests" ON public.foia_requests;
CREATE POLICY "Admins can view all requests"
ON public.foia_requests
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Users can create their own requests" ON public.foia_requests;
CREATE POLICY "Users can create their own requests"
ON public.foia_requests
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own requests" ON public.foia_requests;
CREATE POLICY "Users can update their own requests"
ON public.foia_requests
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can update any request" ON public.foia_requests;
CREATE POLICY "Admins can update any request"
ON public.foia_requests
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- foia_documents table policies
-- ============================================
DROP POLICY IF EXISTS "Users can view documents for their requests" ON public.foia_documents;
CREATE POLICY "Users can view documents for their requests"
ON public.foia_documents
FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM foia_requests
  WHERE foia_requests.id = foia_documents.request_id
  AND foia_requests.user_id = auth.uid()
));

DROP POLICY IF EXISTS "Admins can view all documents" ON public.foia_documents;
CREATE POLICY "Admins can view all documents"
ON public.foia_documents
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can insert documents" ON public.foia_documents;
CREATE POLICY "Admins can insert documents"
ON public.foia_documents
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update documents" ON public.foia_documents;
CREATE POLICY "Admins can update documents"
ON public.foia_documents
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can delete documents" ON public.foia_documents;
CREATE POLICY "Admins can delete documents"
ON public.foia_documents
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- user_roles table policies
-- ============================================
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;
CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;
CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));