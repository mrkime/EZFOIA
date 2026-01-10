-- Add admin policy to view all activity logs for security auditing
CREATE POLICY "Admins can view all activity logs"
ON public.activity_logs
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Add validation to handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_full_name TEXT;
BEGIN
  -- Extract and validate full_name
  user_full_name := TRIM(COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''));
  
  -- Enforce length limit (reasonable max for a name)
  IF LENGTH(user_full_name) > 200 THEN
    user_full_name := LEFT(user_full_name, 200);
  END IF;
  
  -- Remove control characters
  user_full_name := REGEXP_REPLACE(user_full_name, '[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]', '', 'g');
  
  -- If empty after sanitization, set to NULL
  IF user_full_name = '' THEN
    user_full_name := NULL;
  END IF;
  
  -- Insert sanitized profile
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, user_full_name);
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail user creation
    RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;