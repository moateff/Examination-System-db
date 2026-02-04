CREATE OR ALTER PROCEDURE Exam.CorrectExam
    @ExamID INT,
    @ExaminerID INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @TargetType CHAR(1);
    DECLARE @ExamTotalMarks INT;

    SELECT
        @TargetType = TargetType,
        @ExamTotalMarks = ExamTotalMarks
    FROM Exam.Exam
    WHERE ExamID = @ExamID;

    IF @TargetType IS NULL
        THROW 50011, 'Exam does not exist.', 1;

    -- validate examiner by target type
    IF @TargetType = 'S'
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM Users.Student WHERE StudentID = @ExaminerID)
            THROW 50012, 'Student does not exist for this exam.', 1;
    END
    ELSE IF @TargetType = 'A'
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM Users.Applicant WHERE ApplicantId = @ExaminerID)
            THROW 50013, 'Applicant does not exist for this exam.', 1;
    END
    ELSE
        THROW 50014, 'Invalid exam target type.', 1;

    -- submission exists
    IF NOT EXISTS (
        SELECT 1
        FROM Exam.ExamInstance
        WHERE ExamID = @ExamID AND ExaminerID = @ExaminerID
    )
        THROW 50015, 'No submission found for this examiner/exam.', 1;

    WITH Q AS (
        SELECT eq.QuestionId, q.Mark
        FROM Exam.ExamQuestions eq
        JOIN Question_Bank.Question q ON q.QuestionID = eq.QuestionId
        WHERE eq.ExamId = @ExamID
    ),
    CorrectAns AS (
        SELECT ma.QuestionID, ma.ChoiceNumber
        FROM Question_Bank.ModelAnswer ma
        WHERE ma.QuestionID IN (SELECT QuestionId FROM Q)
    ),
    ExaminerAns AS (
        SELECT ea.QuestionID, ea.ExaminerChoiceNumber
        FROM Exam.ExaminerAnswer ea
        WHERE ea.ExamID = @ExamID
          AND ea.ExaminerID = @ExaminerID
    ),
    Scored AS (
        SELECT
            Q.QuestionId,
            Q.Mark,
            CASE
                WHEN EXISTS (
                    SELECT 1
                    FROM ExaminerAns s
                    JOIN CorrectAns c
                      ON c.QuestionID = s.QuestionID
                     AND c.ChoiceNumber = s.ExaminerChoiceNumber
                    WHERE s.QuestionID = Q.QuestionId
                )
                THEN Q.Mark
                ELSE 0
            END AS Earned
        FROM Q
    )

    SELECT
        COUNT(*) AS TotalQuestions,
        @ExamTotalMarks AS TotalMarks,
        SUM(Earned) AS EarnedMarks
    INTO #Result
    FROM Scored;

    DECLARE @Earned INT = (SELECT EarnedMarks FROM #Result);

    UPDATE Exam.ExamInstance
    SET ExaminerGrade = @Earned
    WHERE ExamID = @ExamID AND ExaminerID = @ExaminerID;

    SELECT * FROM #Result;

    DROP TABLE #Result;
END;
GO
