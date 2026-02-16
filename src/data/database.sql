
-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id STRING PRIMARY KEY,
  email STRING UNIQUE,
  password STRING,
  role STRING DEFAULT 'authenticated',
  is_admin BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT NOW()
);

-- Branches Table
CREATE TABLE IF NOT EXISTS branches (
  id STRING PRIMARY KEY,
  name STRING,
  description STRING,
  created_at DATETIME DEFAULT NOW()
);

-- Chapters Table
CREATE TABLE IF NOT EXISTS chapters (
  id STRING PRIMARY KEY,
  name STRING,
  description STRING,
  branch_id STRING,
  created_at DATETIME DEFAULT NOW()
);

-- Questions Table
CREATE TABLE IF NOT EXISTS questions (
  id STRING PRIMARY KEY,
  chapter_id STRING,
  title STRING,
  description STRING,
  input_format STRING,
  output_format STRING,
  sample_input STRING,
  sample_output STRING,
  complexity STRING DEFAULT 'Medium',
  test_cases JSON,
  hints JSON,
  solution_code TEXT,
  total_submissions INTEGER DEFAULT 0,
  total_accepted INTEGER DEFAULT 0,
  acceptance_rate FLOAT DEFAULT 0.0,
  acceptance_rate FLOAT DEFAULT 0.0,
  time_limit INTEGER DEFAULT 2000,
  memory_limit INTEGER DEFAULT 256,
  created_at DATETIME DEFAULT NOW()
);

-- Submissions Table
CREATE TABLE IF NOT EXISTS submissions (
  id STRING PRIMARY KEY,
  user_id STRING,
  question_id STRING,
  code STRING,
  language STRING,
  verdict STRING,
  created_at DATETIME DEFAULT NOW()
);

-- SEED DATA --

-- Admin User (Password: admin)
INSERT INTO users (id, email, password, is_admin) VALUES 
('admin-id', 'admin', 'admin', TRUE);

-- Initial Branches
INSERT INTO branches (id, name, description) VALUES 
('cse', 'Computer Science', 'Data Structures and Algorithms'),
('ece', 'Electronics', 'Embedded Systems and Logic Design'),
('mech', 'Mechanical', 'Simulation and Analysis');

-- Initial Chapters
INSERT INTO chapters (id, name, description, branch_id) VALUES 
('arrays', 'Arrays', 'Basic array manipulation', 'cse'),
('strings', 'Strings', 'String processing', 'cse'),
('linked-list', 'Linked List', 'Linked List problems', 'cse');

-- Initial Questions
INSERT INTO questions (id, chapter_id, title, description, input_format, output_format, sample_input, sample_output, test_cases) VALUES 
('sum-of-array', 'arrays', 'Sum of Array', 'Find sum of array elements', 'N integers', 'Sum', '1 2 3', '6', '[{"input":"1 2 3", "output":"6"}]'),
('reverse-string', 'strings', 'Reverse String', 'Reverse the given string', 'String S', 'Reversed S', 'hello', 'olleh', '[{"input":"abc", "output":"cba"}]');
