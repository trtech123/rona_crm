-- Create a comments table that links to posts
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    source TEXT, -- Where the comment came from (e.g., 'facebook', 'make', etc.)
    external_id TEXT, -- External ID from the source platform (if applicable)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    is_processed BOOLEAN DEFAULT false,
    metadata JSONB -- For any additional data
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS comments_post_id_idx ON public.comments(post_id);
CREATE INDEX IF NOT EXISTS comments_created_at_idx ON public.comments(created_at);
CREATE INDEX IF NOT EXISTS comments_source_idx ON public.comments(source);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view comments on their own posts
CREATE POLICY "Users can view comments on their own posts" 
ON public.comments
FOR SELECT
USING (
    post_id IN (
        SELECT id FROM public.posts WHERE user_id = auth.uid()
    )
);

-- Policy to allow users to insert comments
CREATE POLICY "Users can insert comments" 
ON public.comments
FOR INSERT
WITH CHECK (true);

-- Policy to allow users to update their own comments
CREATE POLICY "Users can update their own comments" 
ON public.comments
FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Policy to allow users to delete their own comments
CREATE POLICY "Users can delete their own comments" 
ON public.comments
FOR DELETE
USING (user_id = auth.uid());

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at timestamp
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.comments
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Add a comment to the table
COMMENT ON TABLE public.comments IS 'Comments linked to posts, can be from various sources like Facebook or Make.com'; 