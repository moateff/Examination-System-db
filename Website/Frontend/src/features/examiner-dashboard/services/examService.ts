import { BaseService } from '@/shared/api/baseService';
import { ENDPOINTS } from '@/shared/api/endpoints';
import type { ApiResponse } from '@/shared/api/types';

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

export class ExamService extends BaseService {
    async getAvailableExams(userId: number): Promise<Exam[]> {
        const response = await this.get<ApiResponse<Exam[]>>(ENDPOINTS.EXAMS.GET_AVAILABLE(userId));
        return response.data;
    }

    async getExamQuestions( courseId: number | string , examId: number | string ) : Promise<Question[]> {
        const response = await this.get<ApiResponse<Question[]>>(ENDPOINTS.EXAMS.GET_QUESTIONS(courseId , examId));
        return response.data;
    }

    async submitExam(payload: { examId: number, userId: string, answers: { questionId: number, choiceNumber: number }[] }): Promise<void> {
        await this.post<ApiResponse<void>>(ENDPOINTS.EXAMS.SUBMIT, payload);
    }
}

export const examService = new ExamService();
