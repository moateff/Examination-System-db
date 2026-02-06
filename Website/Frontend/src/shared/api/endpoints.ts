export const BASE_URL = 'http://localhost:5000/api'; // Replace with actual backend URL

export const ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
    },
    EXAMS: {
        GET_AVAILABLE: '/student/exams', // Adjust based on user provided JSON 'exams' role: Applicant? User: Examiner System for ITI. 
        // The user image shows "role": "Applicant", "exams": [...]. 
        // This implies an endpoint like /dashboard/exams or similar. 
        // I will stick to a reasonable default and update if I see more info.
        GET_QUESTIONS: (examId: number | string) => `/exams/${examId}/questions`,
        SUBMIT: '/student/exam/submit',
    },
};
