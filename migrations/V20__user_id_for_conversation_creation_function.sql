CREATE OR REPLACE FUNCTION "create_conversation"("conversation_data" jsonb)
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
  inserted_conversation_id uuid;
  message jsonb;
BEGIN
  -- Perform the insert operations
  INSERT INTO conversations (chatbot_id, user_id)
  VALUES ((conversation_data->>'chatbot_id')::uuid, (conversation_data->>'user_id')::text)
  RETURNING id INTO inserted_conversation_id;

  IF inserted_conversation_id IS NOT NULL AND jsonb_array_length(conversation_data->'messages') > 0 THEN
    FOR message IN SELECT * FROM jsonb_array_elements(conversation_data->'messages')
    LOOP
        INSERT INTO messages (conversation_id, author, content, user_id)
        VALUES (inserted_conversation_id, (message->>'author'), (message->>'content'), conversation_data->>'user_id');
    END LOOP;
  END IF;

  RETURN inserted_conversation_id;

EXCEPTION
  WHEN others THEN
    -- Raise the exception, and the transaction will be rolled back automatically
    RAISE;
END;
$$;
