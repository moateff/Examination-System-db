USE [Examination_System];
GO

IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = 'Reports')
    EXEC('CREATE SCHEMA Reports');
GO

CREATE OR ALTER PROCEDURE Reports.TrackStudents
    @TrackID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        s.StudentID,
        u.FName,
        u.LName,
        u.Email,
        s.BranchId,
        s.TrackId
    FROM Users.Student s
    JOIN Users.[User] u ON u.UserID = (
        SELECT a.UserID FROM Users.Applicant a WHERE a.ApplicantId = s.ApplicantId
    )
    WHERE s.TrackId = @TrackID
    ORDER BY s.StudentID;
END;
GO

CREATE OR ALTER PROCEDURE Reports.StudentCoursesWithGrades
    @StudentID INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @TrackID INT;

    SELECT @TrackID = TrackId
    FROM Users.Student
    WHERE StudentID = @StudentID;

    IF @TrackID IS NULL
        THROW 71001, 'Student not found or does not have a TrackId.', 1;

    SELECT
        c.CourseID,
        c.CourseName,
        c.Duration,
        e.ExamID,
        ei.ExaminerGrade AS Grade,
        e.ExamTotalMarks,
        CAST(CASE WHEN e.ExamTotalMarks = 0 THEN 0
                  ELSE (ei.ExaminerGrade * 100.0 / e.ExamTotalMarks) END AS DECIMAL(5,2)) AS Percentage
    FROM Curriculum.Course_Track ct
    JOIN Curriculum.Course c ON c.CourseID = ct.CourseID
    LEFT JOIN Exam.Exam e
        ON e.CourseID = c.CourseID
       AND e.TargetType = 'S'
    LEFT JOIN Exam.ExamInstance ei
        ON ei.ExamID = e.ExamID
       AND ei.ExaminerID = @StudentID
    WHERE ct.TrackID = @TrackID
    ORDER BY c.CourseName, e.ExamID;
END;
GO

CREATE OR ALTER PROCEDURE Reports.InstructorCoursesWithStudents
    @InstructorID INT
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM Users.Instructor WHERE InstructorID = @InstructorID)
        THROW 72001, 'Instructor does not exist.', 1;

    SELECT
        c.CourseID,
        c.CourseName,
        s.StudentID,
        u.Username,
        u.Email,
        s.TrackId
    FROM Curriculum.Course c
    JOIN Curriculum.Course_Track ct ON ct.CourseID = c.CourseID
    JOIN Users.Student s ON s.TrackId = ct.TrackID
    LEFT JOIN Users.Applicant a ON a.ApplicantId = s.ApplicantId
    LEFT JOIN Users.[User] u ON u.UserID = a.UserID
    ORDER BY c.CourseName, s.StudentID;
END;
GO

CREATE OR ALTER PROCEDURE Reports.CourseTopics
    @CourseID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        t.TopicID,
        t.TopicName,
        t.Description
    FROM Curriculum.Topic t
    WHERE t.CourseID = @CourseID
    ORDER BY t.TopicID;
END;
GO

CREATE OR ALTER PROCEDURE Reports.ExamHeader
    @ExamID INT
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (
        SELECT 1 
        FROM Exam.Exam 
        WHERE ExamID = @ExamID
    )
        THROW 73001, 'Exam does not exist.', 1;

    SELECT
        e.ExamID,
        e.CourseID,
        c.CourseName,
        e.ExamDate,
        e.Duration,
        e.ExamTotalMarks,
        e.TargetType
    FROM Exam.Exam e
    INNER JOIN Curriculum.Course c 
        ON c.CourseID = e.CourseID
    WHERE e.ExamID = @ExamID;
END;
GO


CREATE OR ALTER PROCEDURE Reports.ExamQuestionsWithChoices
    @ExamID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        q.QuestionID,
        q.QuestionText,
        q.QuestionType,
        q.QuestionLevel,
        q.Mark,
        ch.ChoiceNumber,
        ch.ChoiceText
    FROM Exam.ExamQuestions eq
    INNER JOIN Question_Bank.Question q 
        ON q.QuestionID = eq.QuestionId
    LEFT JOIN Question_Bank.Choice ch 
        ON ch.QuestionID = q.QuestionID
    WHERE eq.ExamId = @ExamID
    ORDER BY 
        q.QuestionID,
        ch.ChoiceNumber;
END;
GO



CREATE OR ALTER PROCEDURE Reports.ExamWithCorrectAndExaminerAnswers
    @ExamID INT,
    @ExaminerID INT
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM Exam.Exam WHERE ExamID = @ExamID)
        THROW 74001, 'Exam does not exist.', 1;

    IF NOT EXISTS (SELECT 1 FROM Exam.ExamInstance WHERE ExamID = @ExamID AND ExaminerID = @ExaminerID)
        THROW 74002, 'No submission found for this examiner/exam.', 1;

    SELECT
        e.ExamID,
        e.CourseID,
        c.CourseName,
        e.ExamDate,
        e.Duration,
        e.ExamTotalMarks,
        e.TargetType,
        ei.ExaminerGrade
    FROM Exam.Exam e
    JOIN Curriculum.Course c ON c.CourseID = e.CourseID
    JOIN Exam.ExamInstance ei ON ei.ExamID = e.ExamID AND ei.ExaminerID = @ExaminerID
    WHERE e.ExamID = @ExamID;

    SELECT
        q.QuestionID,
        q.QuestionText,
        q.QuestionType,
        q.QuestionLevel,
        q.Mark,

        ch.ChoiceNumber,
        ch.ChoiceText,

        ma.ChoiceNumber AS CorrectChoiceNumber,
        ea.ExaminerChoiceNumber AS ExaminerChoiceNumber
    FROM Exam.ExamQuestions eq
    JOIN Question_Bank.Question q ON q.QuestionID = eq.QuestionId
    LEFT JOIN Question_Bank.Choice ch ON ch.QuestionID = q.QuestionID
    LEFT JOIN Question_Bank.ModelAnswer ma ON ma.QuestionID = q.QuestionID
    LEFT JOIN Exam.ExaminerAnswer ea
        ON ea.ExamID = @ExamID
       AND ea.ExaminerID = @ExaminerID
       AND ea.QuestionID = q.QuestionID
    WHERE eq.ExamId = @ExamID
    ORDER BY q.QuestionID, ch.ChoiceNumber;
END;
GO
