-- Add user_id column to sources table
ALTER TABLE sources
ADD COLUMN user_id TEXT NOT NULL;

-- Add user_id column to text_sections table
ALTER TABLE text_sections
ADD COLUMN user_id TEXT NOT NULL;

-- Add user_id column to wikis table
ALTER TABLE wikis
ADD COLUMN user_id TEXT NOT NULL;

-- Add user_id column to chatbots table
ALTER TABLE chatbots
ADD COLUMN user_id TEXT NOT NULL;

-- Add user_id column to conversations table
ALTER TABLE conversations
ADD COLUMN user_id TEXT NOT NULL;

-- Add user_id column to messages table
ALTER TABLE messages
ADD COLUMN user_id TEXT;
