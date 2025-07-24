-- Add FCM token field to user_profiles for push notifications
ALTER TABLE public.user_profiles 
ADD COLUMN fcm_token TEXT;