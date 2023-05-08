-- Add a new 'wikis' table
CREATE TABLE IF NOT EXISTS wikis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add a default wiki
INSERT INTO wikis (name) VALUES ('Default Wiki');

-- Add a 'wiki_id' column to 'sources' and 'text_sections' tables
ALTER TABLE sources ADD COLUMN wiki_id UUID;
ALTER TABLE text_sections ADD COLUMN wiki_id UUID;

-- Update existing sources and text sections to be associated with the default wiki
UPDATE sources SET wiki_id = (SELECT id FROM wikis WHERE name = 'Default Wiki');
UPDATE text_sections SET wiki_id = (SELECT id FROM wikis WHERE name = 'Default Wiki');

-- Add a foreign key constraint to the 'sources' and 'text_sections' tables
ALTER TABLE sources
  ADD CONSTRAINT fk_sources_wikis
  FOREIGN KEY (wiki_id) REFERENCES wikis(id)
  ON DELETE CASCADE;

ALTER TABLE text_sections
  ADD CONSTRAINT fk_text_sections_wikis
  FOREIGN KEY (wiki_id) REFERENCES wikis(id)
  ON DELETE CASCADE;

-- Make 'wiki_id' column required (NOT NULL)
ALTER TABLE sources ALTER COLUMN wiki_id SET NOT NULL;
ALTER TABLE text_sections ALTER COLUMN wiki_id SET NOT NULL;

ALTER TABLE sources
ADD CONSTRAINT unique_wiki_content_hash UNIQUE (wiki_id, content_hash);

