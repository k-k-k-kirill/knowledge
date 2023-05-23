-- Create the sources table
CREATE TABLE IF NOT EXISTS chatbots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL
);

-- Create the chatbots_wikis join table
CREATE TABLE IF NOT EXISTS chatbots_wikis (
  chatbot_id UUID REFERENCES chatbots (id),
  wiki_id UUID REFERENCES wikis (id),
  PRIMARY KEY (chatbot_id, wiki_id)
);