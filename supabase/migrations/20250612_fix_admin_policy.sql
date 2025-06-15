-- Drop the existing admin policy
DROP POLICY IF EXISTS "Admin can view all feedback" ON public.feedbacks;

-- Create admin_users table to store admin emails
CREATE TABLE IF NOT EXISTS public.admin_users (
    email TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert the admin email
INSERT INTO public.admin_users (email)
VALUES ('iagarwal@fleetstudio.com')
ON CONFLICT (email) DO NOTHING;

-- Create a new admin policy that uses the admin_users table
CREATE POLICY "Admin can view all feedback" ON public.feedbacks
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1
            FROM public.admin_users
            WHERE email = auth.jwt()->>'email'
        )
    );
