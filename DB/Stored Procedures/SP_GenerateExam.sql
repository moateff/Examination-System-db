CREATE OR ALTER PROCEDURE Exam.GenerateExam
    @CourseID INT,
    @TargetType CHAR(1),        -- 'S' or 'A'
    @Duration INT,              -- minutes
    @ExamDate Datetime,

    @MCQCount INT,
    @MCQLevel NVARCHAR(10),     -- EASY / MEDIUM / HARD / EXTREME

    @TFCount INT,
    @TFLevel NVARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON;

    IF @TargetType NOT IN ('S','A')
        THROW 60001, 'Invalid TargetType. Must be S or A.', 1;

    IF @MCQLevel NOT IN ('EASY','MEDIUM','HARD','EXTREME')
        THROW 60002, 'Invalid MCQ level.', 1;

    IF @TFLevel NOT IN ('EASY','MEDIUM','HARD','EXTREME')
        THROW 60003, 'Invalid TF level.', 1;

    IF NOT EXISTS (SELECT 1 FROM Curriculum.Course WHERE CourseID = @CourseID)
        THROW 60004, 'Course does not exist.', 1;

    IF @MCQCount > (
        SELECT COUNT(*) FROM Question_Bank.Question
        WHERE CourseID=@CourseID AND QuestionType='MC' AND QuestionLevel=@MCQLevel
    )
        THROW 60005, 'Not enough MCQ questions for this course/level.', 1;

    IF @TFCount > (
        SELECT COUNT(*) FROM Question_Bank.Question
        WHERE CourseID=@CourseID AND QuestionType='TF' AND QuestionLevel=@TFLevel
    )
        THROW 60006, 'Not enough TF questions for this course/level.', 1;

    DECLARE @MCQ TABLE(QuestionID INT PRIMARY KEY);
    DECLARE @TF  TABLE(QuestionID INT PRIMARY KEY);

    -- Random MCQ selection (ROW_NUMBER way)
    ;WITH R AS (
        SELECT q.QuestionID,
               ROW_NUMBER() OVER (ORDER BY NEWID()) AS rn
        FROM Question_Bank.Question q
        WHERE q.CourseID=@CourseID
          AND q.QuestionType='MC'
          AND q.QuestionLevel=@MCQLevel
    )
    INSERT INTO @MCQ(QuestionID)
    SELECT QuestionID FROM R WHERE rn <= @MCQCount;

    -- Random TF selection
    ;WITH R AS (
        SELECT q.QuestionID,
               ROW_NUMBER() OVER (ORDER BY NEWID()) AS rn
        FROM Question_Bank.Question q
        WHERE q.CourseID=@CourseID
          AND q.QuestionType='TF'
          AND q.QuestionLevel=@TFLevel
    )
    INSERT INTO @TF(QuestionID)
    SELECT QuestionID FROM R WHERE rn <= @TFCount;

    -- Calculate total marks from selected questions
    DECLARE @ExamTotalMarks INT;

    SELECT @ExamTotalMarks = SUM(q.Mark)
    FROM (
        SELECT QuestionID FROM @MCQ
        UNION ALL
        SELECT QuestionID FROM @TF
    ) x
    JOIN Question_Bank.Question q ON q.QuestionID = x.QuestionID;

    -- Create exam
    INSERT INTO Exam.Exam (CourseID, ExamDate, Duration, ExamTotalMarks, TargetType)
    VALUES (@CourseID, @ExamDate, @Duration, @ExamTotalMarks, @TargetType);

    DECLARE @ExamID INT = SCOPE_IDENTITY();

    -- Insert questions
    INSERT INTO Exam.ExamQuestions (ExamId, QuestionId)
    SELECT @ExamID, QuestionID FROM @MCQ
    UNION ALL
    SELECT @ExamID, QuestionID FROM @TF;

    -- Return
    SELECT @ExamID AS ExamID, @ExamTotalMarks AS ExamTotalMarks;

    SELECT q.QuestionID, q.QuestionType, q.QuestionLevel, q.Mark, q.QuestionText
    FROM Exam.ExamQuestions eq
    JOIN Question_Bank.Question q ON q.QuestionID = eq.QuestionId
    WHERE eq.ExamId = @ExamID
    ORDER BY q.QuestionType, q.QuestionID;
END;
GO
