exec Exam.GenerateExam 1 , 'A' , 120 , '2/2/2026' , 1 , 'Easy' , 1 , 'Easy'

select * from Exam.Exam

create or alter procedure Exam.getAnExam @crsId int 
as 
begin
	select top 1 ExamID 
	from Exam.Exam 
	where CourseID = @crsId
	order by newid()
end

exec Exam.getAnExam 1



create or alter procedure Exam.getQuestionForExam @exId int
as 
begin
	select Q.QuestionId , QuestionText , Mark
	from Exam.ExamQuestions eq inner join Question_Bank.Question Q 
	on Q.QuestionID = eq.QuestionId
	where eq.ExamId = @exId
end

exec Exam.getQuestionForExam 20





CREATE OR ALTER PROCEDURE Exam.getQuestionsWithAnswers
    @exId INT
AS
BEGIN
    SELECT 
        Q.QuestionId,
        Q.QuestionText,
        Q.Mark,
        Q.QuestionType,
        C.ChoiceNumber,
        C.ChoiceText
    FROM Exam.ExamQuestions EQ
    INNER JOIN Question_Bank.Question Q
        ON Q.QuestionID = EQ.QuestionId
    LEFT JOIN Question_Bank.Choice C
        ON C.QuestionId = Q.QuestionId
    WHERE EQ.ExamId = @exId
    ORDER BY Q.QuestionId, C.ChoiceNumber
END

exec Exam.getQuestionsWithAnswers 20




select FName , LName , Email , T.TrackID , T.TrackName , BranchName 
from Users.Applicant A inner join Curriculum.Applicant_Track_Branch ATB
on A.ApplicantId = ATB.ApplicantId 
inner join Org.Branch B on ATB.BranchID = B.BranchID 
inner join Curriculum.Track T on ATB.TrackID = T.TrackID
inner join Users.[User] U on U.UserID = A.UserID





users table
 - role -> A admin
 - role -> P applicant (default)
 - role -> S student

trigger when creating a new user with role = P then insert this in the applicant table
trigger when addintg a new applicant then insert for him English and IQ Exams



CREATE TRIGGER Users.trg_CreateApplicantOnUserInsert
ON [Users].[User]
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO [Users].[Applicant]
        (UserID)
    SELECT
        i.UserID
    FROM inserted i
    WHERE i.Role = 'P'
      AND NOT EXISTS (
          SELECT 1
          FROM [Users].[Applicant] a
          WHERE a.UserID = i.UserID
      );
END;

select * from Users.Applicant



create or alter procedure GetCourseExamsForStudent @stdId int
as 
begin
    select C.CourseID , CourseName
    from Users.Student S inner join Curriculum.Track T
    on S.TrackId = T.TrackID
    inner join Curriculum.Course_Track CT 
    on CT.TrackID = T.TrackID 
    inner join Curriculum.Course C on C.CourseID = CT.CourseID
    where S.StudentID = @stdId and CT.isPrerequisit = 0
end

exec GetCourseExamsForStudent 1


select * from Users.[Student] 



CREATE TRIGGER Curriculum.trg_CreateCourseOnTrackInsert
ON [Curriculum].[Track]
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO [Curriculum].[Course]
        (CourseName)
    SELECT
        i.TrackName           -- same name as Track
    FROM inserted i
    WHERE NOT EXISTS (
        SELECT 1
        FROM [Curriculum].[Course] c
        WHERE c.CourseName = i.TrackName
    );
END;



insert into Curriculum.Course (CourseName)
select T.TrackName+' - ApplicantExam' 
from Curriculum.Track T




create or alter procedure GetCourseExamsForApplicants @AppId int
as 
begin
    select distinct C.CourseID , CourseName
    from Curriculum.Applicant_Track_Branch ATB inner join
    Curriculum.Track T on T.TrackID = ATB.TrackID
    inner join Curriculum.Course_Track CT on Ct.TrackID = T.TrackID
    inner join Curriculum.Course C on C.CourseID = CT.CourseID
    where Ct.isPrerequisit = 1
end 

exec GetCourseExamsForApplicants 1



--trigger for Auto adding english and IQ as Prerequisit for any course added 
CREATE TRIGGER Curriculum.trg_AddPrerequisitesOnTrackInsert
ON [Curriculum].[Track]
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO [Curriculum].[Course_Track]
        (CourseID, TrackID, isPrerequisit)
    SELECT
        c.CourseID,
        i.TrackID,
        1 AS isPrerequisit
    FROM inserted i
    CROSS JOIN (
        SELECT 38 AS CourseID   -- English
        UNION ALL
        SELECT 39               -- IQ
    ) c
    WHERE NOT EXISTS (
        SELECT 1
        FROM [Curriculum].[Course_Track] ct
        WHERE ct.TrackID = i.TrackID
          AND ct.CourseID = c.CourseID
    );
END;





CREATE PROCEDURE Users.CheckUserType
    @UserID INT
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1
        FROM [Users].[Student] s
        INNER JOIN [Users].[Applicant] a
            ON s.ApplicantId = a.ApplicantId
        WHERE a.UserID = @UserID
    )
    BEGIN
        SELECT 
            'Student' AS RoleType;
        RETURN;
    END

    IF EXISTS (
        SELECT 1
        FROM [Users].[Applicant]
        WHERE UserID = @UserID
    )
    BEGIN
        SELECT 
            'Applicant' AS RoleType;
        RETURN;
    END

    SELECT 
        'User' AS RoleType;
END


exec Users.CheckUserType 14







CREATE PROCEDURE Users.GetStudentIdByUserId
    @UserID INT
AS
BEGIN
    SELECT s.StudentID
    FROM Users.Student s
    JOIN Users.Applicant a ON s.ApplicantId = a.ApplicantId
    WHERE a.UserID = @UserID;
END


CREATE PROCEDURE Users.GetApplicantIdByUserId
    @UserID INT
AS
BEGIN
    SELECT ApplicantId
    FROM Users.Applicant
    WHERE UserID = @UserID;
END
