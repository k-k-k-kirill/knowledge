-- Drop the existing foreign key constraint
ALTER TABLE chatbots_wikis 
DROP CONSTRAINT chatbots_wikis_wiki_id_fkey;

-- Add a new foreign key constraint with ON DELETE CASCADE
ALTER TABLE chatbots_wikis
ADD CONSTRAINT chatbots_wikis_wiki_id_fkey 
FOREIGN KEY (wiki_id) 
REFERENCES wikis (id) 
ON DELETE CASCADE;
