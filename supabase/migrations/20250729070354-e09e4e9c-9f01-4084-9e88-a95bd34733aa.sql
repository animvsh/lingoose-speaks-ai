-- Update the user profile to link it to the authenticated user
UPDATE user_profiles 
SET auth_user_id = '1c237966-161d-47ba-bf50-651812399c43'
WHERE phone_number = '+16505188736' AND auth_user_id IS NULL;