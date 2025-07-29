-- Update the cron job to use the correct Supabase project URL
SELECT cron.unschedule('call-scheduler-cron');
SELECT cron.unschedule('missed-call-handler-cron');

-- Recreate the cron jobs with the correct project URL
SELECT cron.schedule(
  'call-scheduler-cron',
  '* * * * *', -- every minute
  $$
  select
    net.http_post(
        url:='https://pgbbjvqsscvomyulvbhs.supabase.co/functions/v1/call-scheduler-cron',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnYmJqdnFzc2N2b215dWx2YmhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NTE1NTIsImV4cCI6MjA2NjEyNzU1Mn0.slzjNC-SkIE1yw_6Ipju4Y1CX97BnW6bqhoNLzOx2wk"}'::jsonb,
        body:=concat('{"timestamp": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);

SELECT cron.schedule(
  'missed-call-handler-cron',
  '*/10 * * * *', -- every 10 minutes
  $$
  select
    net.http_post(
        url:='https://pgbbjvqsscvomyulvbhs.supabase.co/functions/v1/missed-call-handler-cron',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnYmJqdnFzc2N2b215dWx2YmhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NTE1NTIsImV4cCI6MjA2NjEyNzU1Mn0.slzjNC-SkIE1yw_6Ipju4Y1CX97BnW6bqhoNLzOx2wk"}'::jsonb,
        body:=concat('{"timestamp": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);