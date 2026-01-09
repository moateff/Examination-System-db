USE Examination_System;
GO

CREATE SCHEMA Users;
GO
CREATE SCHEMA Org;
GO
CREATE SCHEMA Curriculum;
GO
CREATE SCHEMA Question_Bank;
GO
CREATE SCHEMA Exam;
GO


-- Move Hierarchy to Campus
ALTER SCHEMA Org TRANSFER dbo.Branch;
ALTER SCHEMA Org TRANSFER dbo.Department;

ALTER SCHEMA Curriculum TRANSFER dbo.Track;
ALTER SCHEMA Curriculum TRANSFER dbo.Course;
ALTER SCHEMA Curriculum TRANSFER dbo.Course_Track;
ALTER SCHEMA Curriculum TRANSFER dbo.Topic;

ALTER SCHEMA Users TRANSFER dbo.[User];
ALTER SCHEMA Users TRANSFER dbo.Admin;
ALTER SCHEMA Users TRANSFER dbo.Instructor;
ALTER SCHEMA Users TRANSFER dbo.Student;

ALTER SCHEMA Question_Bank TRANSFER dbo.Question;
ALTER SCHEMA Question_Bank TRANSFER dbo.Choice;
ALTER SCHEMA Question_Bank TRANSFER dbo.ModelAnswer;

ALTER SCHEMA Exam TRANSFER dbo.Exam;
ALTER SCHEMA Exam TRANSFER dbo.StudentExam;
ALTER SCHEMA Exam TRANSFER dbo.StudentAnswer;
GO

-- Synonyms
USE Examination_System;
GO

CREATE SYNONYM Users FOR Users.[User];
CREATE SYNONYM Instructors FOR Users.Instructor;
CREATE SYNONYM Students FOR Users.Student;
CREATE SYNONYM Admins FOR Users.Admin;

CREATE SYNONYM Questions FOR Question_Bank.Question;
CREATE SYNONYM Choices FOR Question_Bank.Choice;
CREATE SYNONYM ModelAnswers FOR Question_Bank.ModelAnswer;

CREATE SYNONYM Departments FOR org.Department;
CREATE SYNONYM Branches FOR org.branch;

CREATE SYNONYM Exams FOR Exam.Exam;
CREATE SYNONYM StudentAnswers FOR Exam.StudentAnswer;
CREATE SYNONYM StudentExams FOR Exam.StudentExam;

CREATE SYNONYM Courses FOR Curriculum.Course;
CREATE SYNONYM Courses_Tracks FOR Curriculum.Course_Track;
CREATE SYNONYM Topics FOR Curriculum.Topic;
CREATE SYNONYM Tracks FOR Curriculum.Track;