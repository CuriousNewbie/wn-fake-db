DELETE FROM
    likes;

DELETE FROM
    comments;

delete FROM
    posts;

delete from
    users;

ALTER SEQUENCE users_id_seq RESTART WITH 1;

ALTER SEQUENCE posts_id_seq RESTART WITH 1;

ALTER SEQUENCE comments_id_seq RESTART WITH 1;