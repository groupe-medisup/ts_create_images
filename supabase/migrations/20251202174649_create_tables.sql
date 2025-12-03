
CREATE TYPE image_type AS ENUM ('cours', 'EBC', 'colle');

CREATE TABLE images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_path TEXT NOT NULL,
    type image_type NOT NULL,
    matiere TEXT NOT NULL,
    subject TEXT NOT NULL DEFAULT '',
    generated_by_model TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE images OWNER TO postgres;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow select for all users" ON images
    FOR SELECT
    TO public
    USING (true);

INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true);

CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');