-- getAll
    SELECT * FROM `articles`
    WHERE `user_id` = ?;

-- getId
    SELECT `id` FROM `articles`
    WHERE `user_id` = ? AND `name` = ?

-- addNew
    INSERT INTO `articles` (`user_id`, `name`)
    VALUES (?, ?);

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
    