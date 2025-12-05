ALTER TABLE images ADD COLUMN refusal_reason TEXT DEFAULT '';

DROP FUNCTION IF EXISTS refuse_image(UUID);

CREATE FUNCTION refuse_image(image_id UUID, reason TEXT DEFAULT '')
RETURNS VOID
SECURITY DEFINER
AS $$
BEGIN
    UPDATE images
    SET refused_at = NOW(),
        refusal_reason = reason
    WHERE id = image_id;
END;
$$ LANGUAGE plpgsql;
