-- Add columns to vapi_call_analysis for follow-up tracking
ALTER TABLE public.vapi_call_analysis 
ADD COLUMN IF NOT EXISTS follow_up_sent boolean DEFAULT NULL,
ADD COLUMN IF NOT EXISTS follow_up_sent_at timestamp with time zone DEFAULT NULL;

-- Create index for efficient cron job queries
CREATE INDEX IF NOT EXISTS idx_vapi_call_analysis_follow_up 
ON public.vapi_call_analysis (call_status, follow_up_sent, call_started_at);

-- Create index for scheduled calls cron efficiency  
CREATE INDEX IF NOT EXISTS idx_scheduled_calls_cron 
ON public.scheduled_calls (status, scheduled_time);

-- Enable pg_cron extension for scheduling cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the call scheduler to run every minute
SELECT cron.schedule(
  'call-scheduler-cron',
  '* * * * *', -- every minute
  $$
  select
    net.http_post(
        url:='https://wfcskqbprslhkfcnlndt.supabase.co/functions/v1/call-scheduler-cron',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmY3NrcWJwcnNsaGtmY25sbmR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzMjAyNzgsImV4cCI6MjA1MDg5NjI3OH0.wLjMXJ-bRD5m-b7YrDJfp1HbxCG6IUjQUC4Pdy_TT0w"}'::jsonb,
        body:=concat('{"timestamp": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);

-- Schedule the missed call handler to run every 10 minutes
SELECT cron.schedule(
  'missed-call-handler-cron',
  '*/10 * * * *', -- every 10 minutes
  $$
  select
    net.http_post(
        url:='https://wfcskqbprslhkfcnlndt.supabase.co/functions/v1/missed-call-handler-cron',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmY3NrcWJwcnNsaGtmY25sbmR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzMjAyNzgsImV4cCI6MjA1MDg5NjI3OH0.wLjMXJ-bRD5m-b7YrDJfp1HbxCG6IUjQUC4Pdy_TT0w"}'::jsonb,
        body:=concat('{"timestamp": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);