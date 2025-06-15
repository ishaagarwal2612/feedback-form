-- Create the feedbacks table
CREATE TABLE IF NOT EXISTS public.feedbacks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow users to insert their own feedback
CREATE POLICY "Users can insert their own feedback" ON public.feedbacks
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Allow users to read their own feedback
CREATE POLICY "Users can view their own feedback" ON public.feedbacks
    FOR SELECT
    USING (auth.uid() = user_id);

-- Allow admin to read all feedback
CREATE POLICY "Admin can view all feedback" ON public.feedbacks
    FOR SELECT
    USING (auth.uid() IN (
        SELECT id FROM auth.users 
        WHERE email = 'admin@example.com' -- Replace with your admin email
    ));

-- Create indexes
CREATE INDEX IF NOT EXISTS feedbacks_user_id_idx ON public.feedbacks(user_id);
CREATE INDEX IF NOT EXISTS feedbacks_created_at_idx ON public.feedbacks(created_at DESC);
