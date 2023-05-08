-- Create the sources table
CREATE TABLE IF NOT EXISTS sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  upload_timestamp TIMESTAMPTZ NOT NULL
);

-- Create the text_sections table
CREATE TABLE IF NOT EXISTS text_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_id UUID NOT NULL REFERENCES sources(id),
  text TEXT NOT NULL,
  embedding vector(1536)
);