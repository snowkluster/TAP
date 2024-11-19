
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    post_name TEXT,
    post_author TEXT,
    post_author_url TEXT,
    post_link TEXT,
    post_date TIMESTAMP,
    views INTEGER DEFAULT 0,
    replies INTEGER DEFAULT 0,
    type TEXT
);

CREATE INDEX IF NOT EXISTS idx_posts_type ON posts(type);
CREATE INDEX IF NOT EXISTS idx_posts_date ON posts(post_date);