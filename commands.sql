CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
);

-- Initial data
INSERT INTO blogs (author, url, title, likes) VALUES ('John Doe', 'https://www.example.com/clever-blogpost', 'This is a random title', 18);
INSERT INTO blogs (author, url, title, likes) VALUES ('Lizzy McBlogsalot', 'example.com/reader-friendly-0245882', '5 ways to make your code more readable', 22);
