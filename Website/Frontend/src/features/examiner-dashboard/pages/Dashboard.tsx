/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '@/store';
import { fetchExams, setCurrentExam } from '../slices/examSlice';
import ExamCard from '../components/ExamCard';
import DashboardSkeleton from '../components/DashboardSkeleton';
import toast from 'react-hot-toast';

interface ActiveExamData {
    examName: string;
    examId: number;
    deadline: number;
    startedAt: number;
    userID: number;
}

export default function Dashboard() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { exams, loading, error } = useSelector((state: RootState) => state.exams as any);
    const { user } = useSelector((state: RootState) => state.auth);
    const [activeExams, setActiveExams] = useState<Map<number, ActiveExamData>>(new Map());

    // Check localStorage for active exams for current user
    const checkActiveExams = () => {
        if (!user?.userID) return;

        const activeExamsMap = new Map<number, ActiveExamData>();
        const userPrefix = `exam_${user.userID}_`;

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(userPrefix)) {
                try {
                    const data = JSON.parse(localStorage.getItem(key) || '');
                    // Check if exam is still active (deadline not passed) and belongs to current user
                    if (data.deadline > Date.now() && data.userID === user.userID) {
                        activeExamsMap.set(data.examId, data);
                    }
                } catch {
                    // Invalid data, ignore
                }
            }
        }

        setActiveExams(activeExamsMap);
    };

    useEffect(() => {
        if (user?.userID) {
            dispatch(fetchExams(user.userID));
            checkActiveExams();
        }
    }, [dispatch, user?.userID]);

    const handleStartExam = (exam: any) => {
        const currentExamIsActive = activeExams.has(exam.examId);

        // If clicking on an active exam, continue it
        if (currentExamIsActive) {
            dispatch(setCurrentExam(exam));
            navigate(`/exam/${exam.courseId}/${exam.examId}`);
            return;
        }

        // Check if any other exam is active
        if (activeExams.size > 0) {
            const activeExamData = Array.from(activeExams.values())[0];
            toast.error(
                `You have an active exam: "${activeExamData.examName}". Please complete or wait for it to expire before starting a new one.`,
                { duration: 5000 }
            );
            return;
        }

        // Start new exam
        dispatch(setCurrentExam(exam));
        navigate(`/exam/${exam.courseId}/${exam.examId}`);
    };

    if (loading) return <DashboardSkeleton />;

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="text-center text-red-500 py-10 bg-red-50 rounded-lg border border-red-200 mx-4 mt-8">
                    <p className="font-semibold">Error loading exams</p>
                    <p>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <h1 className="text-3xl font-bold mb-6 text-slate-800 border-l-4 border-red-500 pl-4">
                Available Exams
            </h1>

            <div className="space-y-3">
                {exams.map((exam: any) => (
                    <ExamCard
                        key={exam.examId}
                        exam={exam}
                        onStart={handleStartExam}
                        isActive={activeExams.has(exam.examId)}
                        hasOtherActiveExam={activeExams.size > 0 && !activeExams.has(exam.examId)}
                    />
                ))}

                {exams.length === 0 && (
                    <div className="text-center py-16 text-slate-400 bg-slate-50 rounded-xl border-2 border-slate-100 border-dashed">
                        <p className="text-lg">No exams available at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
