\c postgres;
drop database test1;
create database test1;
\c test1;


----------------------------------------------------------------------------------------------
CREATE TABLE users (
    id SERIAL CONSTRAINT users_pk PRIMARY KEY,
    name varchar(50) NOT NULL UNIQUE,
    email varchar(320) NOT NULL UNIQUE,
    password char(64) not NULL,
    avatar char(29) DEFAULT 'https://robohash.org/custom',
    followers INTEGER DEFAULT 0,
    subs json NOT NULL DEFAULT '[]'::json,
    blocks json NOT NULL DEFAULT '[]'::json
);
----------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------
CREATE TABLE posts (
    id SERIAL CONSTRAINT posts_pk PRIMARY KEY,
    author_id INTEGER REFERENCES users(id),
    date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    comment_number INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    dislikes INTEGER DEFAULT 0
);
----------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------
CREATE TABLE comments (
    id SERIAL CONSTRAINT comments_pk PRIMARY KEY,
    author_id INTEGER NOT NULL REFERENCES users(id),
    post_id INTEGER NOT NULL REFERENCES posts(id),
    parent_comment_id INTEGER REFERENCES comments(id),
    date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    content TEXT NOT NULL
);
----------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------
CREATE or REPLACE FUNCTION comment_insert_handler()
RETURNS TRIGGER AS $$
BEGIN
UPDATE
    posts
SET
    comment_number = comment_number + 1
WHERE
    id = NEW.post_id;

return Null;

END $$ LANGUAGE plpgsql;
----------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------
CREATE TRIGGER insert_comment_trigger
AFTER
INSERT
    ON comments FOR EACH ROW EXECUTE PROCEDURE comment_insert_handler();
----------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------
CREATE TABLE likes (
    user_id INTEGER NOT NULL REFERENCES users(id),
    post_id INTEGER NOT NULL REFERENCES posts(id),
    value BOOLEAN NOT NULL,
    PRIMARY KEY (USER_ID, post_id)
);
----------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------
CREATE
or REPLACE FUNCTION like_insert_handler() RETURNS TRIGGER AS $$ 
BEGIN 
IF new.value = TRUE THEN
UPDATE
    posts
SET
    likes = likes + 1
WHERE
    id = NEW.post_id;

ELSE
UPDATE
    posts
SET
    dislikes = dislikes + 1
WHERE
    id = NEW.post_id;

END IF;

return Null;

END $$ LANGUAGE plpgsql;
----------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------
CREATE TRIGGER insert_like_trigger
AFTER
INSERT
    ON likes FOR EACH ROW EXECUTE PROCEDURE like_insert_handler();
----------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------
CREATE
or REPLACE FUNCTION like_delete_handler() RETURNS TRIGGER AS $$ 
BEGIN 
IF old.value = TRUE THEN
UPDATE
    posts
SET
    likes = likes - 1
WHERE
    id = old.post_id;

ELSE
UPDATE
    posts
SET
    dislikes = dislikes - 1
WHERE
    id = NEW.post_id;

END IF;

return Null;

END $$ LANGUAGE plpgsql;
----------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------
CREATE TRIGGER delete_like_trigger
AFTER
DELETE
    ON likes FOR EACH ROW EXECUTE PROCEDURE like_delete_handler();

----------------------------------------------------------------------------------------------
ALTER SEQUENCE users_id_seq RESTART WITH 1;

ALTER SEQUENCE posts_id_seq RESTART WITH 1;

ALTER SEQUENCE comments_id_seq RESTART WITH 1;
