CREATE OR REPLACE FUNCTION create_source_and_text_section(source_data jsonb, text_section_data jsonb)
RETURNS void AS $$
DECLARE
  inserted_source_id uuid;
BEGIN
  INSERT INTO sources (name, type, content_hash, wiki_id, user_id)
  VALUES (
    source_data->>'name', 
    source_data->>'type', 
    source_data->>'content_hash', 
    (source_data->>'wiki_id')::uuid,
    source_data->>'user_id'
  )
  ON CONFLICT (content_hash) DO UPDATE
  SET id = sources.id
  RETURNING id INTO inserted_source_id;

  IF inserted_source_id IS NOT NULL THEN
    INSERT INTO text_sections (source_id, text, embedding, wiki_id, user_id)
    VALUES (
      inserted_source_id,
      text_section_data->>'text',
      REPLACE(REPLACE((text_section_data->>'embedding')::text, '[', '{'), ']', '}')::numeric[], 
      (text_section_data->>'wiki_id')::uuid,
      text_section_data->>'user_id'
    );
  END IF;
END $$ LANGUAGE plpgsql;
