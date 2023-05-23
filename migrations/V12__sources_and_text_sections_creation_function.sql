CREATE OR REPLACE FUNCTION "create_source_and_text_section"("source_data" jsonb, "text_section_data" jsonb)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  inserted_source_id uuid;
BEGIN
  -- Perform the insert operations
  INSERT INTO sources (name, type, content_hash, wiki_id)
  VALUES (source_data->>'name', source_data->>'type', source_data->>'content_hash', (source_data->>'wiki_id')::uuid)
  ON CONFLICT (content_hash) DO UPDATE
  SET id = sources.id
  RETURNING id INTO inserted_source_id;

  IF inserted_source_id IS NOT NULL THEN
    INSERT INTO text_sections (source_id, text, embedding, wiki_id)
    VALUES (
      inserted_source_id,
      text_section_data->>'text',
      REPLACE(REPLACE((text_section_data->>'embedding')::text, '[', '{'), ']', '}')::numeric[], (text_section_data->>'wiki_id')::uuid
    );
  END IF;

EXCEPTION
  WHEN others THEN
    -- Raise the exception, and the transaction will be rolled back automatically
    RAISE;
END;
$$;
