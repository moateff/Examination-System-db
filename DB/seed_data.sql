USE [Examination_System];
GO

-- 1. Branches
INSERT INTO Org.Branch (BranchName, BranchAddress) VALUES
('ITI Nasr City', 'Nasr City, Cairo'),
('ITI Smart Village', 'Smart Village, Giza');

-- 2. Departments
INSERT INTO Org.Department (DepartmentName, BranchID) VALUES
('Software Development', 1);

-- 3. Tracks
INSERT INTO Curriculum.Track (TrackName, DepartmentID, NumOfHours) VALUES
('Integrated Software Architecture', 1, 1024),
('Professional Development & CRM', 1, 964),
('Mobile Development', 1, 951);

-- 4. Courses
INSERT INTO Curriculum.Course (CourseName, Duration) VALUES
('Software Design Patterns', 40),
('Enterprise Architecture', 50),
('Customer Relationship Management', 30),
('Team & Project Management', 30),
('Flutter Mobile Development', 40),
('Android Native Development', 40),
('Database Systems', 40),
('Advanced Database', 50),
('Computer Science Theory', 30),
('Object-Oriented Programming', 40),
('C# Programming', 40);

-- 5. Course_Track mapping
INSERT INTO Curriculum.Course_Track (CourseID, TrackID) VALUES
(1, 1),
(2, 1),
(3, 2),
(4, 2),
(5, 3),
(6, 3),
(7, 1),
(8, 1),
(9, 2),
(10, 1),
(11, 1);

-- 6. Topics
INSERT INTO Curriculum.Topic (TopicName, CourseID, Description) VALUES
-- Integrated Software Architecture
('Design Patterns Basics', 1, 'Singleton, Factory, Observer patterns'),
('Advanced Design Patterns', 1, 'Decorator, Adapter, Strategy patterns'),
('Enterprise Architecture Models', 2, 'TOGAF, Microservices, Layered Architecture'),
('Architecture Documentation', 2, 'UML, C4 Model, Decision Records'),
('Database Fundamentals', 7, 'ER diagrams, Normalization, SQL basics'),
('Advanced Database Concepts', 8, 'Indexing, Transactions, Stored Procedures'),
('OOP Principles', 10, 'Encapsulation, Inheritance, Polymorphism, Abstraction'),
('C# Basics', 11, 'Variables, Data Types, Loops, Conditions'),
('C# Advanced', 11, 'LINQ, Delegates, Events, Async programming'),

-- Professional Development & CRM
('CRM Concepts', 3, 'Customer lifecycle, CRM software, Segmentation'),
('Sales & Marketing Management', 3, 'Sales funnels, Retention, Marketing Strategies'),
('Project Management Basics', 4, 'Agile, Scrum, Kanban techniques'),
('Team Management & Soft Skills', 4, 'Conflict resolution, Communication, Leadership'),
('Computer Science Theory', 9, 'Algorithms, Complexity, Computability, Data Structures'),

-- Mobile Development
('Flutter Widgets', 5, 'Stateless & Stateful Widgets, Layouts, Navigation'),
('Flutter State Management', 5, 'Provider, Riverpod, Bloc'),
('Android Activities & Intents', 6, 'Activity lifecycle, Intents, Fragments'),
('Android UI & Navigation', 6, 'RecyclerView, Navigation components, Material Design');

-- 7. Users
-- Admin
INSERT INTO Users.[User] (FName, LName, BDate, Email, Address, Username, Password, Role, Gender) VALUES
('Mohamed', 'Ali', '1990-05-10', 'mohamed.ali@iti.com', 'Cairo', 'admin_mohamed', 'P@ssword123', 'A', 'M');

-- Instructors
INSERT INTO Users.[User] (FName, LName, BDate, Email, Address, Username, Password, Role, Gender) VALUES
('Sara', 'Hassan', '1985-07-15', 'sara.hassan@iti.com', 'Cairo', 'instructor_sara', 'P@ssword123', 'I', 'F'),
('Ahmed', 'Kamal', '1982-03-22', 'ahmed.kamal@iti.com', 'Giza', 'instructor_ahmed', 'P@ssword123', 'I', 'M'),
('Hany', 'Farid', '1983-11-12', 'hany.farid@iti.com', 'Cairo', 'instructor_hany', 'P@ssword123', 'I', 'M');

-- Students
INSERT INTO Users.[User] (FName, LName, BDate, Email, Address, Username, Password, Role, Gender) VALUES
('Ali', 'Mohamed', '2000-01-12', 'ali.mohamed@student.iti.com', 'Cairo', 'student_ali', 'P@ssword123', 'S', 'M'),
('Nour', 'Salah', '2001-04-18', 'nour.salah@student.iti.com', 'Cairo', 'student_nour', 'P@ssword123', 'S', 'F'),
('Omar', 'Hussein', '2000-08-22', 'omar.hussein@student.iti.com', 'Giza', 'student_omar', 'P@ssword123', 'S', 'M');

-- 8. Map Admin, Instructors, Students
INSERT INTO Users.Admin (UserID) VALUES (1);

INSERT INTO Users.Instructor (UserID, Degree, Salary, HireDate) VALUES
(2, 'MS', 15000, '2020-01-01'),
(3, 'PHD', 18000, '2018-09-01'),
(4, 'MS', 16000, '2019-03-01');

INSERT INTO Users.Student (UserID, Faculty, GPA, GraduationYear) VALUES
(5, 'Software Engineering', 4.2, 2024),
(6, 'Professional Development', 3.8, 2024),
(7, 'Mobile Development', 4.0, 2024);

-- 9. Example Questions
INSERT INTO Question_Bank.Question (QuestionText, QuestionType, QuestionLevel, Mark, CourseID) VALUES
('What is the Singleton pattern?', 'MC', 'EASY', 5, 1),
('Which architecture style uses Microservices?', 'MC', 'MEDIUM', 5, 2),
('CRM helps in managing customer relationships.', 'TF', 'EASY', 5, 3),
('Flutter widgets can be Stateless or Stateful.', 'TF', 'MEDIUM', 5, 5),
('Android Activities are part of the application lifecycle.', 'TF', 'EASY', 5, 6);

-- 10. Choices
INSERT INTO Question_Bank.Choice (QuestionID, ChoiceNumber, ChoiceText) VALUES
(1, 1, 'A pattern with a single instance'),
(1, 2, 'A database model'),
(2, 1, 'Monolithic'),
(2, 2, 'Microservices'),
(2, 3, 'MVC');

-- 11. Model Answers
INSERT INTO Question_Bank.ModelAnswer (QuestionID, ChoiceNumber) VALUES
(1, 1),
(2, 2);

-- 12. Exams
INSERT INTO Exam.Exam (CourseID, Duration, TotalMarks) VALUES
(1, 60, 10),
(2, 90, 10),
(5, 90, 10);

-- 13. Student Exams
INSERT INTO Exam.StudentExam (StudentID, ExamID, StudentGrade) VALUES
(5, 1, 9),
(6, 2, 8),
(7, 3, 10);

-- 14. Student Answers
INSERT INTO Exam.StudentAnswer (StudentExamID, QuestionID, StudentChoiceNumber) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 4, 1);




----------- 


-- 2. Add new Department
INSERT INTO Org.Department (DepartmentName, BranchID) VALUES
('Cyber Security, Cloud, and Infrastructure Services', 1); -- assuming branch 1: ITI Nasr City

-- Get the new DepartmentID (assuming identity auto-increment, it will be 2 if only 2 departments exist)
DECLARE @CyberDeptID INT = SCOPE_IDENTITY();

-- 3. Add Tracks for the new Department
INSERT INTO Curriculum.Track (TrackName, DepartmentID, NumOfHours) VALUES
('Systems Administration', @CyberDeptID, 900),
('Cyber Security', @CyberDeptID, 950),
('Cloud Architecture', @CyberDeptID, 920);

-- Assuming TrackIDs are auto-increment and in order: 4=Systems Administration, 5=Cyber Security, 6=Cloud Architecture
DECLARE @SystemsAdminTrackID INT = 4;
DECLARE @CyberSecurityTrackID INT = 5;
DECLARE @CloudArchitectureTrackID INT = 6;

-- 4. Courses for the new tracks
INSERT INTO Curriculum.Course (CourseName, Duration) VALUES
-- Systems Administration
('Linux Server Administration', 40),
('Windows Server Administration', 40),
('Networking Fundamentals', 35),
-- Cyber Security
('Cyber Security Fundamentals', 40),
('Ethical Hacking & Penetration Testing', 50),
('Security Policies & Risk Management', 30),
-- Cloud Architecture
('Cloud Computing Basics', 35),
('AWS Cloud Solutions', 45),
('Azure Cloud Solutions', 45),
('Cloud Security & DevOps', 40);

-- Map Courses to Tracks (CourseID assuming 12 onwards after previous courses)
INSERT INTO Curriculum.Course_Track (CourseID, TrackID) VALUES
-- Systems Administration Track
(12, @SystemsAdminTrackID),
(13, @SystemsAdminTrackID),
(14, @SystemsAdminTrackID),
-- Cyber Security Track
(15, @CyberSecurityTrackID),
(16, @CyberSecurityTrackID),
(17, @CyberSecurityTrackID),
-- Cloud Architecture Track
(18, @CloudArchitectureTrackID),
(19, @CloudArchitectureTrackID),
(20, @CloudArchitectureTrackID),
(21, @CloudArchitectureTrackID);

-- 5. Topics for new Courses
-- Systems Administration
INSERT INTO Curriculum.Topic (TopicName, CourseID, Description) VALUES
('Linux Basics', 12, 'File system, Users, Permissions, Shell commands'),
('Linux Services & Daemons', 12, 'Cron jobs, Systemd, Logging'),
('Windows Server Installation & Roles', 13, 'Active Directory, DNS, DHCP'),
('Server Administration Tasks', 13, 'Users, Groups, Policies, Backup & Recovery'),
('Networking Fundamentals', 14, 'TCP/IP, Subnetting, Routing, Switches, Firewalls');

-- Cyber Security
INSERT INTO Curriculum.Topic (TopicName, CourseID, Description) VALUES
('Introduction to Cyber Security', 15, 'Threats, Vulnerabilities, Security Concepts'),
('Ethical Hacking Techniques', 16, 'Penetration Testing, Reconnaissance, Exploitation'),
('Security Policies & Risk Assessment', 17, 'Policy Creation, Risk Management, Incident Response');

-- Cloud Architecture
INSERT INTO Curriculum.Topic (TopicName, CourseID, Description) VALUES
('Cloud Computing Concepts', 18, 'IaaS, PaaS, SaaS, Cloud Deployment Models'),
('AWS Services & Architecture', 19, 'EC2, S3, VPC, IAM, Lambda'),
('Azure Services & Architecture', 20, 'VMs, Storage, Networking, Azure Active Directory'),
('Cloud Security & DevOps', 21, 'CI/CD, Cloud Security Best Practices, Monitoring');
