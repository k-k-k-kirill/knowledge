-- Add the "order" column to the "text_sections" table
ALTER TABLE text_sections
ADD COLUMN order_number INTEGER NOT NULL DEFAULT 0;
