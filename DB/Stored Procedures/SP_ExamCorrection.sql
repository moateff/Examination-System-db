CREATE PROCEDURE Exam.sp_CorrectExam
    @StudentID INT,
    @ExamID INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @TotalGrade INT;

    SELECT 
        @TotalGrade = SUM(Q.Mark)
    FROM Exam.StudentAnswer SA
    INNER JOIN Question_Bank.ModelAnswer MA
        ON SA.QuestionID = MA.QuestionID
       AND SA.StudentChoiceNumber = MA.ChoiceNumber
    INNER JOIN Question_Bank.Question Q
        ON SA.QuestionID = Q.QuestionID
    WHERE SA.StudentID = @StudentID
      AND SA.ExamID = @ExamID;

    SET @TotalGrade = ISNULL(@TotalGrade, 0);

    UPDATE Exam.StudentExam
    SET StudentGrade = @TotalGrade
    WHERE StudentID = @StudentID
      AND ExamID = @ExamID;
END;
GO

EXEC Exam.sp_CorrectExam 
    @StudentID = 3,
    @ExamID = 7;


CREATE PROCEDURE Exam.sp_CorrectExam
    @StudentExamID INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @TotalGrade INT = 0;

    /*
        Calculate total grade by comparing
        student answers with model answers
    */
    SELECT 
        @TotalGrade = SUM(Q.Mark)
    FROM Exam.StudentAnswer SA
    INNER JOIN Question_Bank.ModelAnswer MA
        ON SA.QuestionID = MA.QuestionID
       AND SA.StudentChoiceNumber = MA.ChoiceNumber
    INNER JOIN Question_Bank.Question Q
        ON SA.QuestionID = Q.QuestionID
    WHERE SA.StudentExamID = @StudentExamID;

    -- If no correct answers, avoid NULL
    SET @TotalGrade = ISNULL(@TotalGrade, 0);

    -- Update student grade
    UPDATE Exam.StudentExam
    SET StudentGrade = @TotalGrade
    WHERE StudentExamID = @StudentExamID;
END;
GO

EXEC Exam.sp_CorrectExam @StudentExamID = 5;
