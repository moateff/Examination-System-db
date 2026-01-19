select * from ModelAnswers
select * from Questions
select * from Exams
select * from StudentAnswers
select * from StudentExams


create proc sp_CorrectExam @examid int, @studentid int
as
begin

declare @totalMarks int
declare @studentSum int = 0, @correctChoice int, @questionIndividualMark int
select @totalMarks = totalmarks from Exams where Examid = @examid

declare c1 cursor
for select QuestionId, Studentchoicenumber from StudentAnswersForExam(@examid,@studentid)
for read only
declare @questionId int, @studentchoiceid int
open c1
fetch c1 into @questionId, @studentchoiceid
while @@FETCH_STATUS = 0
	begin
		select @questionIndividualMark = mark from Questions where QuestionID = @questionId
		select @correctChoice = choiceNumber from ModelAnswers where QuestionID = @questionId

		if @studentchoiceid = @correctChoice
			set @studentSum = @studentSum + @questionIndividualMark;

		fetch c1 into @questionId, @studentchoiceid
	end
close c1
deallocate c1


declare @percentage decimal(5,2);
set @percentage = cast(@studentSum as decimal(5,2)) / @totalMarks * 100;

select concat(@percentage, '%') as StudentScore;

end


--test
exec sp_CorrectExam 5,1