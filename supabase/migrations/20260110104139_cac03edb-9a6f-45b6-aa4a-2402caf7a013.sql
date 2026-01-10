-- Add notification preferences columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email_notifications boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS sms_notifications boolean DEFAULT false;

-- Create activity_logs table for tracking user actions
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  action text NOT NULL,
  description text,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Users can only view their own activity
CREATE POLICY "Users can view own activity logs"
ON public.activity_logs
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own activity logs
CREATE POLICY "Users can insert own activity logs"
ON public.activity_logs
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);