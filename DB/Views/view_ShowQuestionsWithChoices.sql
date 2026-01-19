create view vw_questionsChoices
as
select q.QuestionId, QuestionText,QuestionType,ChoiceNumber, ChoiceText
from Questions q join Choices c
on q.QuestionID = c.QuestionID


select * from vw_questionsChoices

