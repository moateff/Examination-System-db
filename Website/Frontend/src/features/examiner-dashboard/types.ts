export interface Exam {
    examId: number;
    courseId: number;
    courseName: string;
    examDate: string;
    duration: number;
}

export interface Question {
    questionId: number;
    questionText: string;
    mark: number;
    questionType: 'MC' | 'TF';
    choices: {
        choiceNumber: number;
        choiceText: string;
    }[];
}

export interface ExamAnswer {
    questionId: number;
    choiceNumber: number;
}
