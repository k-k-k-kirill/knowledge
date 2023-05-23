CREATE OR REPLACE FUNCTION "create_chatbot"(name VARCHAR(255), "wiki_ids" UUID[])
RETURNS UUID AS $$
DECLARE
    chatbot_id UUID;
    wiki_id UUID;
BEGIN
    -- Insert a new chatbot and get its id
    INSERT INTO chatbots (name)
    VALUES (name)
    RETURNING id INTO chatbot_id;

    -- Loop over the wiki ids and insert into chatbots_wikis
    FOREACH wiki_id IN ARRAY wiki_ids
    LOOP
        INSERT INTO chatbots_wikis (chatbot_id, wiki_id)
        VALUES (chatbot_id, wiki_id);
    END LOOP;

    -- Return the id of the newly created chatbot
    RETURN chatbot_id;
END;
$$ LANGUAGE plpgsql;