USE Examination_System
GO

CREATE TABLE Exam
(
    ExamID INT IDENTITY PRIMARY KEY,
    CourseID INT NOT NULL,
    ExamDate DATETIME DEFAULT GETDATE(),
    Duration INT NOT NULL,
    TotalMarks INT NOT NULL,

    CONSTRAINT FK_Exam_Course FOREIGN KEY (CourseID)
        REFERENCES Course(CourseID)
) ON FG_EXAM_RUNTIME;
GO


CREATE TABLE StudentExam
(
    StudentExamID INT IDENTITY PRIMARY KEY,
    StudentID INT NOT NULL,
    ExamID INT NOT NULL,
    StudentGrade INT NOT NULL,

    CONSTRAINT FK_StudentExam_Student FOREIGN KEY (StudentID)
        REFERENCES Student(StudentID),

    CONSTRAINT FK_StudentExam_Exam FOREIGN KEY (ExamID)
        REFERENCES Exam(ExamID)
) ON FG_EXAM_RUNTIME;
GO

CREATE TABLE StudentAnswer
(
    StudentExamID INT NOT NULL,
    QuestionID INT NOT NULL,
    StudentChoiceNumber INT NOT NULL,

    CONSTRAINT PK_StudentAnswer 
        PRIMARY KEY (StudentExamID, QuestionID, StudentChoiceNumber),

    CONSTRAINT FK_StudentAnswer_Choice FOREIGN KEY (QuestionID, StudentChoiceNumber)
        REFERENCES Choice(QuestionID, ChoiceNumber),

    CONSTRAINT FK_StudentAnswer_StudentExam FOREIGN KEY (StudentExamID)
        REFERENCES StudentExam(StudentExamID)
) ON FG_EXAM_RUNTIME;
GO
