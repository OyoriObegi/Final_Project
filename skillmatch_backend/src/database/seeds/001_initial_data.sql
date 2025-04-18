-- Insert initial admin user (password: admin123)
INSERT INTO users (email, password_hash, first_name, last_name, role)
VALUES ('admin@skillmatch.com', '$2b$10$X7z3tYvJX3tYvJX3tYvJX.3tYvJX3tYvJX3tYvJX3tYvJX3tYvJX', 'Admin', 'User', 'admin');

-- Insert some initial skills
INSERT INTO skills (name, category) VALUES
('JavaScript', 'Programming'),
('Python', 'Programming'),
('React', 'Frontend'),
('Node.js', 'Backend'),
('SQL', 'Database'),
('MongoDB', 'Database'),
('AWS', 'Cloud'),
('Docker', 'DevOps'),
('Git', 'Version Control'),
('TypeScript', 'Programming'),
('Angular', 'Frontend'),
('Express.js', 'Backend'),
('PostgreSQL', 'Database'),
('GraphQL', 'API'),
('RESTful APIs', 'API'),
('CI/CD', 'DevOps'),
('Kubernetes', 'DevOps'),
('Machine Learning', 'AI'),
('Data Analysis', 'Data Science'),
('UI/UX Design', 'Design');

-- Insert some sample employers
INSERT INTO users (email, password_hash, first_name, last_name, role)
VALUES 
('techcorp@example.com', '$2b$10$X7z3tYvJX3tYvJX3tYvJX.3tYvJX3tYvJX3tYvJX3tYvJX3tYvJX', 'Tech', 'Corp', 'employer'),
('innovate@example.com', '$2b$10$X7z3tYvJX3tYvJX3tYvJX.3tYvJX3tYvJX3tYvJX3tYvJX3tYvJX', 'Innovate', 'Labs', 'employer');

-- Insert some sample job seekers
INSERT INTO users (email, password_hash, first_name, last_name, role)
VALUES 
('john.doe@example.com', '$2b$10$X7z3tYvJX3tYvJX3tYvJX.3tYvJX3tYvJX3tYvJX3tYvJX3tYvJX', 'John', 'Doe', 'job_seeker'),
('jane.smith@example.com', '$2b$10$X7z3tYvJX3tYvJX3tYvJX.3tYvJX3tYvJX3tYvJX3tYvJX3tYvJX', 'Jane', 'Smith', 'job_seeker');

-- Insert some sample jobs
INSERT INTO jobs (employer_id, title, description, requirements, location, job_type, experience_level, salary_range)
VALUES 
(2, 'Senior Full Stack Developer', 'Looking for an experienced full stack developer to join our team.', '5+ years of experience with React and Node.js', 'Remote', 'full_time', 'senior', '$100,000 - $150,000'),
(3, 'Junior Frontend Developer', 'Entry-level position for frontend development.', 'Knowledge of HTML, CSS, and JavaScript', 'New York', 'full_time', 'entry', '$60,000 - $80,000'),
(2, 'DevOps Engineer', 'Seeking a DevOps engineer to manage our cloud infrastructure.', 'Experience with AWS and Kubernetes', 'San Francisco', 'full_time', 'mid', '$90,000 - $120,000');

-- Insert job skills
INSERT INTO job_skills (job_id, skill_id, required)
VALUES 
(1, 1, true),  -- JavaScript for Senior Full Stack
(1, 3, true),  -- React for Senior Full Stack
(1, 4, true),  -- Node.js for Senior Full Stack
(2, 1, true),  -- JavaScript for Junior Frontend
(2, 3, true),  -- React for Junior Frontend
(3, 7, true),  -- AWS for DevOps
(3, 8, true),  -- Docker for DevOps
(3, 17, true); -- Kubernetes for DevOps

-- Insert user skills
INSERT INTO user_skills (user_id, skill_id, proficiency_level)
VALUES 
(4, 1, 4),  -- John Doe: JavaScript
(4, 3, 4),  -- John Doe: React
(4, 4, 3),  -- John Doe: Node.js
(5, 1, 3),  -- Jane Smith: JavaScript
(5, 3, 3),  -- Jane Smith: React
(5, 10, 4); -- Jane Smith: TypeScript 