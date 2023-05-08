-- Add a unique constraint to the wiki name column
ALTER TABLE wikis
ADD CONSTRAINT unique_wiki_name UNIQUE (name);
