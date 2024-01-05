-- getAll
    SELECT * FROM `articles`
    WHERE `user_id` = ?;

-- getData
    SELECT * FROM `articles`
    WHERE `user_id` = ? AND `name` = ?;

-- getDataById
    SELECT * FROM `articles`
    WHERE `id` = ?;

-- addNew
    INSERT INTO `articles` (`user_id`, `name`, `title`, `keywords`, `image_name`, `description`)
    VALUES (?, ? ,?, ?, ?, ?);

-- changeData
    UPDATE `articles`
    SET `name` = ?,
        `title` = ?,
        `keywords` = ?,
        `description` = ?
    WHERE `id` = ?;

-- changePublishment
    UPDATE `articles`
    SET `is_publish` = ?
    WHERE `id` = ?;

-- remove
    DELETE FROM `articles`
    WHERE `id` = ?;
    