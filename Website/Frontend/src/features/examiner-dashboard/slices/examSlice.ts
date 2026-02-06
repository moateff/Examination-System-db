import {
    createSlice,
    createAsyncThunk,
    type PayloadAction,
} from '@reduxjs/toolkit';
import { examService, type Exam, type Question } from '../services/examService';

interface ExamState {
    exams: Exam[];
    currentExam: Exam | null;
    questions: Question[];
    loading: boolean;
    submitting: boolean;
    error: string | null;
}

const initialState: ExamState = {
    exams: [],
    currentExam: null,
    questions: [],
    loading: false,
    submitting: false,
    error: null,
};

export const fetchExams = createAsyncThunk(
    'exams/fetchAvailable',
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await examService.getAvailableExams(userId);
            // Adjust if response is wrapped
            return response;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch exams',
            );
        }
    },
);

export const fetchQuestions = createAsyncThunk(
    'exams/fetchQuestions',
    async (examId: number | string, { rejectWithValue }) => {
        try {
            const response = await examService.getExamQuestions(examId);
            return response;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch questions',
            );
        }
    },
);

export const submitExam = createAsyncThunk(
    'exams/submit',
    async (payload: { examId: number, userId: string, answers: { questionId: number, choiceNumber: number }[] }, { rejectWithValue }) => {
        try {
            await examService.submitExam(payload);
            return;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to submit exam',
            );
        }
    }
);

const examSlice = createSlice({
    name: 'exams',
    initialState,
    reducers: {
        setCurrentExam: (state, action: PayloadAction<Exam>) => {
            state.currentExam = action.payload;
        },
        clearExamData: (state) => {
            state.currentExam = null;
            state.questions = [];
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Exams
            .addCase(fetchExams.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchExams.fulfilled, (state, action) => {
                state.loading = false;
                // Handle if payload is wrapped. Assuming array for now based on service return type
                if (Array.isArray(action.payload)) {
                    state.exams = action.payload;
                } else {
                    // If the API returns { role: ..., exams: ... }
                    // @ts-ignore
                    state.exams = action.payload.exams || [];
                }
            })
            .addCase(fetchExams.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch Questions
            .addCase(fetchQuestions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchQuestions.fulfilled, (state, action) => {
                state.loading = false;
                state.questions = action.payload;
            })
            .addCase(fetchQuestions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Submit Exam
            .addCase(submitExam.pending, (state) => {
                state.submitting = true;
                state.error = null;
            })
            .addCase(submitExam.fulfilled, (state) => {
                state.submitting = false;
                // Optionally clear exam data or handle success feedback
            })
            .addCase(submitExam.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload as string;
            });
    },
});

export const { setCurrentExam, clearExamData } = examSlice.actions;
export default examSlice.reducer;
