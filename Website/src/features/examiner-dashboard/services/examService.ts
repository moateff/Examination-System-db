import { BaseService } from '@/shared/api/baseService';
import { ENDPOINTS } from '@/shared/api/endpoints';

export interface Exam {
    id: number;
    courseId: number;
    courseName: string;
    date?: string; // User requested date
    duration?: number; // User requested duration
    // User provided image shows "courseId", "courseName" in "exams" list.
    // I will add mock data for date and duration if missing from API or assume they come
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

export class ExamService extends BaseService {
    async getAvailableExams(userId: string): Promise<Exam[]> {
        // The user provided image shows a structure: { role: "Applicant", exams: [...] }
        // If the API returns that structure, I need to extract exams.
        // For now, I'll assume endpoint returns the list or I map it.

        // I'll simulate the response structure from user image if I were mocking,
        // but here I call the API.
        return this.get<Exam[]>(ENDPOINTS.EXAMS.GET_AVAILABLE, {
            params: { userId },
        });
    }

    async getExamQuestions(examId: number | string): Promise<Question[]> {
        return this.get<Question[]>(ENDPOINTS.EXAMS.GET_QUESTIONS(examId));
    }

    async submitExam(payload: { examId: number, userId: string, answers: { questionId: number, choiceNumber: number }[] }): Promise<void> {
        return this.post<void>(ENDPOINTS.EXAMS.SUBMIT, payload);
    }
}

export const examService = new ExamService();
