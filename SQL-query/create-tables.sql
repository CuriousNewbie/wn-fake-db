CREATE TABLE users (
    id SERIAL CONSTRAINT users_pk PRIMARY KEY,
    name varchar(50) NOT NULL UNIQUE,
    password char(64) not NULL,
    avatar char(27) DEFAULT 'https://robohash.org/custom'
);

CREATE TABLE posts (
    id SERIAL CONSTRAINT posts_pk PRIMARY KEY,
    author_id INTEGER REFERENCES users(id),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    content TEXT NOT NULL
);

CREATE TABLE comments (
    id SERIAL CONSTRAINT comments_pk PRIMARY KEY,
    author_id INTEGER NOT NULL REFERENCES users(id),
    post_id INTEGER NOT NULL REFERENCES posts(id),
    parent_comment_id INTEGER REFERENCES comments(id),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    content TEXT NOT NULL
);

CREATE TABLE likes (
    user_id INTEGER NOT NULL REFERENCES users(id),
    post_id INTEGER NOT NULL REFERENCES posts(id),
    value BOOLEAN NOT NULL,
    PRIMARY KEY (USER_ID, post_id)
);