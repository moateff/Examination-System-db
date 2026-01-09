USE Examination_System 
GO 

CREATE TABLE Question
(
    QuestionID INT IDENTITY PRIMARY KEY,
    QuestionText NVARCHAR(500) NOT NULL,
    QuestionType CHAR(2) CHECK (QuestionType IN ('MC','TF')),
    QuestionLevel NVARCHAR(10) CHECK (QuestionLevel IN ('EASY' , 'MEDIUM' , 'HARD' , 'EXTREME')),
    Mark INT NOT NULL,
    CourseID INT NOT NULL,
    CONSTRAINT FK_Question_Course FOREIGN KEY (CourseID)
        REFERENCES Course(CourseID)
) ON FG_QUESTION_BANK;
GO


CREATE TABLE Choice
(
    QuestionID INT NOT NULL,
    ChoiceNumber INT NOT NULL,
    ChoiceText NVARCHAR(200) NOT NULL,

    CONSTRAINT PK_Choice PRIMARY KEY (QuestionID, ChoiceNumber),
    CONSTRAINT FK_Choice_Question FOREIGN KEY (QuestionID)
        REFERENCES Question(QuestionID)
) ON FG_QUESTION_BANK;
GO

CREATE TABLE ModelAnswer
(
    QuestionID INT NOT NULL,
    ChoiceNumber INT NOT NULL,

    CONSTRAINT PK_ModelAnswer PRIMARY KEY (QuestionID, ChoiceNumber),
    CONSTRAINT FK_ModelAnswer_Choice FOREIGN KEY (QuestionID, ChoiceNumber)
        REFERENCES Choice(QuestionID, ChoiceNumber)
) ON FG_QUESTION_BANK;
GO
