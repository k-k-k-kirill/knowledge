-- Create the join table
CREATE TABLE IF NOT EXISTS messages_text_sections (
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  text_section_id UUID REFERENCES text_sections(id) ON DELETE CASCADE,
  PRIMARY KEY(message_id, text_section_id)
);

-- Create indexes for better performance
CREATE INDEX idx_message_text_sections_message_id ON messages_text_sections(message_id);
CREATE INDEX idx_message_text_sections_text_section_id ON messages_text_sections(text_section_id);
