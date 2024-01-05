-- getAll
    SELECT * FROM `articles`
    WHERE `user_id` = ?;

-- getData
    SELECT * FROM `articles`
    WHERE `user_id` = ? AND `name` = ?

-- addNew
    INSERT INTO `articles` (`user_id`, `name`, `title`, `keywords`, `image_name`, `description`)
    VALUES (?, ? ,?, ?, ?, ?);

-- changeData
    UPDATE `articles`
    SET `name` = ?,
        `title` = ?,
        `keywords` = ?,
        `image_name` = ?,
        `description` = ?
    WHERE `id` = ?;

-- changePublishment
    UPDATE `articles`
    SET `is_publish` = ?
    WHERE `id` = ?;

-- remove
    DELETE FROM `articles`
    WHERE `id` = ?;
    