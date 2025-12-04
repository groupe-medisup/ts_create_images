ALTER TABLE images ADD COLUMN refused_at TIMESTAMPTZ DEFAULT NULL;

CREATE FUNCTION refuse_image(image_id UUID)
RETURNS VOID
SECURITY DEFINER
AS $$
BEGIN
    UPDATE images
    SET refused_at = NOW()
    WHERE id = image_id;
END;
$$ LANGUAGE plpgsql;