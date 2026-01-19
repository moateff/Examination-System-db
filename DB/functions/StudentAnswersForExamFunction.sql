create function StudentAnswersForExam(@examid int, @studentid int)
returns table
as
return
(
	select QuestionId, Studentchoicenumber
	from StudentAnswers sa join StudentExams se
	on se.StudentID = @studentid and se.examid = @examid and sa.StudentExamID = se.StudentExamID
)