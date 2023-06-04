CREATE OR REPLACE FUNCTION match_text_sections(
  query_embedding VECTOR,
  match_threshold float,
  match_count INTEGER,
  chatbot_id UUID,
  user_id TEXT
) RETURNS TABLE (
  id UUID,
  text TEXT,
  similarity float
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    text_sections.id,
    text_sections.text,
    1 - (text_sections.embedding <=> query_embedding) as similarity
  FROM text_sections
  JOIN sources ON text_sections.source_id = sources.id
    AND sources.user_id = match_text_sections.user_id
  JOIN chatbots_wikis ON sources.wiki_id = chatbots_wikis.wiki_id
  WHERE 1 - (text_sections.embedding <=> query_embedding) > match_threshold
  AND chatbots_wikis.chatbot_id = match_text_sections.chatbot_id
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$ LANGUAGE plpgsql;
