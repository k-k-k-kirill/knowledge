-- Add foreign key constraint with ON DELETE CASCADE
ALTER TABLE text_sections
ADD CONSTRAINT fk_text_sections_source_id
FOREIGN KEY (source_id)
REFERENCES sources(id)
ON DELETE CASCADE;
