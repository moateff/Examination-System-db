select * from Questions where courseId = 1
select * from Choices where questionid =1
select * from Question_bank.ModelAnswer
select * from Courses
select * from Exams
select * from exam.studentExam
select * from exam.studentAnswer
select * from Exam.ExamQuestions



create proc GenerateExam @crsname nvarchar(100), @mcq int, @tf int
as
declare @crsid int
select @crsid = courseid from Courses where courseName = @crsname

insert into Exams(courseId,ExamDate,Duration,TotalMarks)
values(@crsid,getdate(),60,50)

declare @latestExamId int
select @latestExamId= ident_current('[Exam].Exam')

insert into Exam.ExamQuestions(ExamId,QuestionId)
select @latestExamId, QuestionId
from (
    select * from (
        select top (@mcq) *
        from getquestionbankforcourse(@crsid)
        where questiontype = 'mc'
        order by newid()
    ) mc
    union all
    select * from (
        select top (@tf) *
        from getquestionbankforcourse(@crsid)
        where questiontype = 'tf'
        order by newid()
    ) tf
) combined
order by questionid;


exec GenerateExam 'Enterprise Architecture',5,5

