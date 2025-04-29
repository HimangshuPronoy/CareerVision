-- Create resumes table
CREATE TABLE IF NOT EXISTS resumes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS resumes_user_id_idx ON resumes(user_id);

-- Enable Row Level Security
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own resumes
CREATE POLICY "Users can read their own resumes"
    ON resumes FOR SELECT
    USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own resumes
CREATE POLICY "Users can insert their own resumes"
    ON resumes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own resumes
CREATE POLICY "Users can update their own resumes"
    ON resumes FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to delete their own resumes
CREATE POLICY "Users can delete their own resumes"
    ON resumes FOR DELETE
    USING (auth.uid() = user_id); 