CREATE DATABASE Examination_System
ON PRIMARY
(
    NAME = Exam_Primary,
    FILENAME = 'D:\Projects\ITI\Advanced SQL\Project\Exam_Primary.mdf',
    SIZE = 100MB,
    FILEGROWTH = 10MB
),

FILEGROUP FG_MASTER
(
    NAME = Exam_Master,
    FILENAME = 'D:\Projects\ITI\Advanced SQL\Project\Exam_Master.ndf',
    SIZE = 100MB,
    FILEGROWTH = 10MB
),

FILEGROUP FG_QUESTION_BANK
(
    NAME = Exam_Questions,
    FILENAME = 'D:\Projects\ITI\Advanced SQL\Project\Exam_Questions.ndf',
    SIZE = 200MB,
    FILEGROWTH = 20MB
),

FILEGROUP FG_EXAM_RUNTIME
(
    NAME = Exam_Runtime,
    FILENAME = 'D:\Projects\ITI\Advanced SQL\Project\Exam_Runtime.ndf',
    SIZE = 300MB,
    FILEGROWTH = 50MB
)

LOG ON
(
    NAME = Exam_Log,
    FILENAME = 'D:\Projects\ITI\Advanced SQL\Project\Exam_Log.ldf',
    SIZE = 100MB,
    FILEGROWTH = 10MB
);
GO
