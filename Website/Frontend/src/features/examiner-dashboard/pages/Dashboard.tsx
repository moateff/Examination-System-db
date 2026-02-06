/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '@/store';
import { fetchExams, setCurrentExam } from '../slices/examSlice';
import ExamCard from '../components/ExamCard';
import DashboardSkeleton from '../components/DashboardSkeleton';

export default function Dashboard() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { exams, loading, error } = useSelector((state: RootState) => state.exams as any);
    const { user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchExams(user.id));
        }
    }, [dispatch, user?.id]);

    const handleStartExam = (exam: any) => {
        dispatch(setCurrentExam(exam));
        navigate(`/exam/${exam.courseId}`);
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
            <h1 className="text-3xl font-bold mb-8 text-slate-800 border-l-4 border-red-500 pl-4">
                Available Exams
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exams.map((exam: any) => (
                    <ExamCard
                        key={exam.courseId}
                        exam={exam}
                        onStart={handleStartExam}
                    />
                ))}

                {exams.length === 0 && (
                    <div className="col-span-full text-center py-16 text-slate-400 bg-slate-50 rounded-xl border-2 border-slate-100 border-dashed">
                        <p className="text-lg">No exams available at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
