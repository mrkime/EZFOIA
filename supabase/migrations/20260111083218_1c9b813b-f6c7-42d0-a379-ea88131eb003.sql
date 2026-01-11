-- Add DELETE policies for better security

-- Profiles: Only admins can delete profiles
CREATE POLICY "Admins can delete profiles"
ON public.profiles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- FOIA Requests: Users can delete their own pending requests, admins can delete any
CREATE POLICY "Users can delete their own pending requests"
ON public.foia_requests
FOR DELETE
TO authenticated
USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins can delete any request"
ON public.foia_requests
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Activity logs: Prevent ALL deletions to maintain audit trail integrity
CREATE POLICY "No one can delete activity logs"
ON public.activity_logs
FOR DELETE
TO authenticated
USING (false);

-- Activity logs: Prevent ALL updates to maintain audit trail integrity
CREATE POLICY "No one can update activity logs"
ON public.activity_logs
FOR UPDATE
TO authenticated
USING (false);