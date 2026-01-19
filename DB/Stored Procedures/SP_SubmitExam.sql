select * from StudentAnswers
select * from StudentExams
select * from Choices
select * from Students
select * from Exam.ExamQuestions

select * from Exam.ExamQuestions

create type questionChoiceType as table
(
    QuestionId int,
    ChoiceId int
);


--The backend should send datatable that has 2 columns, questionid and choiceid
create proc sp_submitExam @examid int, @studentId int, @quesChoiceTable questionChoiceType readonly
as

begin
insert into StudentExams(Studentid, Examid)
values (@studentId, @examid)

declare @latestStExamId int = Scope_identity()

insert into StudentAnswers(StudentExamId, Questionid, StudentChoiceNumber)
select @latestStExamId, QuestionId, ChoiceId
from @quesChoiceTable
end

--Testing the SP
declare @TestAnswers questionChoiceType;

insert into @TestAnswers (QuestionId, ChoiceId)
values 
    (2, 2),   -- Question 1, selected choice 2
    (28, 1),  
    (31, 3);   

exec sp_submitExam 5,1,@testAnswers

