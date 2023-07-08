CREATE OR REPLACE FUNCTION "update_chatbot_wikis"("_chatbot_id" UUID, "wiki_ids" UUID[])
RETURNS VOID AS $$
DECLARE
    wiki_id UUID;
BEGIN
    -- Delete all existing wikis associated with the chatbot
    DELETE FROM chatbots_wikis WHERE chatbot_id = _chatbot_id;

    -- Loop over the new wiki ids and insert into chatbots_wikis
    FOREACH wiki_id IN ARRAY wiki_ids
    LOOP
        INSERT INTO chatbots_wikis (chatbot_id, wiki_id)
        VALUES (_chatbot_id, wiki_id);
    END LOOP;
END;
$$ LANGUAGE plpgsql;
