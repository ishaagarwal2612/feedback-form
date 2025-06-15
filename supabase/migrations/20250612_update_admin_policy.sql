-- First, let's drop the existing admin policy
DROP POLICY IF EXISTS "Admin can view all feedback" ON public.feedbacks;

-- Create a new admin policy with a specific admin email
CREATE POLICY "Admin can view all feedback" ON public.feedbacks
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1
            FROM auth.users
            WHERE id = auth.uid()
            AND (
                -- Add your admin email(s) here
                email = 'iagarwal@fleetstudio.com'
                -- Add more admin emails if needed with OR conditions
                -- OR email = 'another.admin@example.com'
            )
        )
    );
