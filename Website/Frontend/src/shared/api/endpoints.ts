export const BASE_URL = 'http://localhost:5000/api'; // Backend API

export const ENDPOINTS = {
    AUTH: {
        LOGIN: '/System/login',
    },
    EXAMS: {
        GET_AVAILABLE: (userId: number | string) => `/System/available-exams/${userId}`,
        GET_QUESTIONS: (courseId: number | string, examId: number | string) => `/System/exam/${courseId}/${examId}`,
        SUBMIT: '/System/submit-exam',
    },
};
