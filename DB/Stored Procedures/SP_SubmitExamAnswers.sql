CREATE OR ALTER PROCEDURE Exam.SubmitExamAnswers
    @ExamID INT,
    @ExaminerID INT,
    @Answers Exam.AnswerInput READONLY
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @TargetType CHAR(1);

    SELECT @TargetType = TargetType
    FROM Exam.Exam
    WHERE ExamID = @ExamID;

    -- Validate exam exists
   IF @TargetType IS NULL
        THROW 50001, 'Exam does not exist.', 1;

    -- Validate examiner based on exam type
    IF @TargetType = 'S'
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM Users.Student WHERE StudentID = @ExaminerID)
            THROW 50002, 'Student does not exist for this exam.', 1;
    END
    ELSE IF @TargetType = 'A'
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM Users.Applicant WHERE ApplicantId = @ExaminerID)
            THROW 50003, 'Applicant does not exist for this exam.', 1;
    END
    ELSE THROW 50004, 'Invalid exam target type.', 1;

    -- Prevent duplicate submissions
    IF EXISTS (
        SELECT 1
        FROM Exam.ExamInstance
        WHERE ExamID = @ExamID
          AND ExaminerID = @ExaminerID
    )
        THROW 50005, 'Duplicate submission is not allowed.', 1;
    

    -- Create ExamInstance row
    INSERT INTO Exam.ExamInstance (ExaminerID, ExamID, ExamGrade)
    VALUES (@ExaminerID, @ExamID, 0);

    /*
      Insert answers:
      - Only accept questions that are part of this exam
      - Only accept choices that exist for that question
      - We'll store ExaminerExamID = @ExamID (since you don't have an identity for attempts)
    */
    INSERT INTO Exam.ExaminerAnswer (QuestionID, ExaminerChoiceNumber, ExamID, ExaminerID)
    SELECT
        a.QuestionID,
        a.ChoiceNumber,
        @ExamID AS ExamID,
        @ExaminerID AS ExaminerID
    FROM @Answers a
    WHERE EXISTS (
        SELECT 1
        FROM Exam.ExamQuestions eq
        WHERE eq.ExamId = @ExamID AND eq.QuestionId = a.QuestionID
    )
    AND EXISTS (
        SELECT 1
        FROM Question_Bank.Choice c
        WHERE c.QuestionID = a.QuestionID AND c.ChoiceNumber = a.ChoiceNumber
    );

    -- Optional: if nothing inserted => invalid payload
    IF @@ROWCOUNT = 0
        THROW 50004, 'No valid answers were inserted (invalid questions/choices).', 1;
END;
GO
