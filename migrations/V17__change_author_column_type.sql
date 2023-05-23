ALTER TABLE messages
ALTER COLUMN author TYPE TEXT USING author::text;

DROP TYPE message_author;