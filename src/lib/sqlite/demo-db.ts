// The demo database for the main loaded database
const DEMO_DB = `
PRAGMA foreign_keys = ON;

CREATE TABLE Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
);

CREATE TABLE Posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    FOREIGN KEY (post_id) REFERENCES Posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

INSERT INTO Users (name, email) VALUES
('Alice', 'alice@gmail.com'),
('Bob', 'bob@hotmail.com'),
('Charlie', 'charlie@yahoo.com'),
('David', 'david@outlook.com'),
('Emma', 'emma@gmail.com'),
('Frank', 'frank@protonmail.com'),
('Grace', 'grace@hotmail.com'),
('Henry', 'henry@icloud.com'),
('Ivy', 'ivy@gmail.com'),
('Jack', 'jack@yahoo.com'),
('Kara', 'kara@outlook.com'),
('Liam', 'liam@protonmail.com'),
('Mia', 'mia@hotmail.com'),
('Nathan', 'nathan@gmail.com'),
('Olivia', 'olivia@yahoo.com');

INSERT INTO Posts (user_id, title, content) VALUES
(1, 'Hello World', 'This is my first post!'),
(2, 'SQLite Relationships', 'Understanding foreign keys in SQLite.'),
(3, 'My Coding Journey', 'Sharing my experience learning to code.'),
(4, 'Best Programming Languages', 'Which one should you learn first?'),
(5, 'How to Learn SQL', 'A beginner-friendly SQL guide.'),
(6, 'Web Development Tips', 'Tips for front-end and back-end developers.'),
(7, 'The Power of Python', 'Why Python is a great choice for developers.'),
(8, 'Functional Programming', 'Understanding FP concepts.'),
(9, 'Setting Up a Server', 'How to deploy your own website.'),
(10, 'The Future of AI', 'Exploring advancements in artificial intelligence.'),
(11, 'My Favorite JavaScript Libraries', 'Some useful libraries to check out.'),
(12, 'Linux for Developers', 'Why Linux is great for coding.'),
(13, 'Docker Basics', 'Getting started with containerization.'),
(14, 'Cybersecurity 101', 'Understanding basic security principles.'),
(15, 'React vs Vue', 'Which frontend framework should you choose?');

INSERT INTO Comments (post_id, user_id, content) VALUES
(1, 2, 'Great post, Alice!'),
(2, 3, 'Nice explanation, Bob!'),
(3, 4, 'Thanks for sharing your journey!'),
(4, 5, 'I think Python is the best for beginners.'),
(5, 6, 'This guide really helped me!'),
(6, 7, 'Awesome tips, I will apply them!'),
(7, 8, 'I love Python too!'),
(8, 9, 'Functional programming is amazing.'),
(9, 10, 'Thanks for the tutorial!'),
(10, 11, 'AI is advancing so fast!'),
(11, 12, 'I use React, but Vue is interesting.'),
(12, 13, 'Linux is my favorite OS.'),
(13, 14, 'Docker changed my workflow completely.'),
(14, 15, 'Security is super important.'),
(15, 1, 'I prefer React, but both are great!');
`;

export default DEMO_DB;
