USE Examination_System 
GO 

CREATE TABLE Branch
(
    BranchID INT IDENTITY PRIMARY KEY,
    BranchName NVARCHAR(100) NOT NULL,
    BranchAddress NVARCHAR(50) NOT NULL,
) ON 'FG_MASTER';
GO

CREATE TABLE Department
(
    DepartmentID INT IDENTITY PRIMARY KEY,
    DepartmentName NVARCHAR(100) NOT NULL,
    BranchID INT NOT NULL,
    CONSTRAINT FK_Department_Branch FOREIGN KEY (BranchID)
        REFERENCES Branch(BranchID)
) ON 'FG_MASTER';
GO

CREATE TABLE Track
(
    TrackID INT IDENTITY PRIMARY KEY,
    TrackName NVARCHAR(100) NOT NULL,
    DepartmentID INT NOT NULL,
    NumOfHours INT NOT NULL,
    CONSTRAINT FK_Track_Department FOREIGN KEY (DepartmentID)
        REFERENCES Department(DepartmentID)
) ON 'FG_MASTER';
GO

CREATE TABLE Course
(
    CourseID INT IDENTITY PRIMARY KEY,
    CourseName NVARCHAR(100) NOT NULL,
    Duration INT NOT NULL,

) ON 'FG_MASTER';
GO

CREATE TABLE Course_Track
(
    CourseID INT NOT NULL,
    TrackID INT NOT NULL,
    CONSTRAINT FK_Course_Track0 FOREIGN KEY (TrackID)
        REFERENCES Track(TrackID),
    CONSTRAINT FK_Course_Track1 FOREIGN KEY (CourseID)
        REFERENCES Course(CourseID),
    CONSTRAINT PK_Course_Track PRIMARY KEY (CourseID,TrackId)

) ON 'FG_MASTER';
GO

CREATE TABLE Topic
(
    TopicID INT IDENTITY PRIMARY KEY,
    TopicName NVARCHAR(100) NOT NULL,
    CourseID INT NOT NULL,
    Description NVARCHAR(50) NOT NULL,
    CONSTRAINT FK_Topic_Course FOREIGN KEY (CourseID)
        REFERENCES Course(CourseID)
) ON 'FG_MASTER';
GO
