-- getAll
    SELECT `sections`.*, `styles`.* FROM `sections`
    INNER JOIN `styles` ON `sections`.`id` = `styles`.`section_id`
    WHERE `sections`.`article_id` = ?;

-- addNew
    INSERT INTO `sections` (`article_id`, `content`, `content_type`, `image_url`)
    VALUES (?, ?, ?, ?);

-- changeContent
    UPDATE `sections`
    SET `content` = ?,
        `content_type` = ?,
        `image_url` = ?
    WHERE `id` = ?;

-- remove
    DELETE FROM `sections`
    WHERE `id` = ?;
    