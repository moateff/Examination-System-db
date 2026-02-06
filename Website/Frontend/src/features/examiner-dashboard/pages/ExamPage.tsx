import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '@/store';
import { fetchQuestions, submitExam as submitExamAction } from '../slices/examSlice';
import ExamHeader from '../components/exam/ExamHeader';
import QuestionCard from '../components/exam/QuestionCard';
import ExamFooter from '../components/exam/ExamFooter';
import ExamSkeleton from '../components/exam/ExamSkeleton';
import toast from 'react-hot-toast';

export default function ExamPage() {
    const { examId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { questions, loading, error, currentExam } = useSelector((state: RootState) => state.exams as any);
    const { user } = useSelector((state: RootState) => state.auth);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});

    useEffect(() => {
        if (examId) {
            dispatch(fetchQuestions(examId));
        }
    }, [dispatch, examId]);

    const handleAnswer = (questionId: number, choiceNumber: number) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: choiceNumber
        }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const submitExam = useCallback(async () => {
        try {
            const formattedAnswers = Object.entries(answers).map(([qId, choice]) => ({
                questionId: parseInt(qId),
                choiceNumber: choice
            }));

            await dispatch(submitExamAction({
                examId: Number(examId),
                userId: user?.id || '',
                answers: formattedAnswers
            })).unwrap();
            if (examId) {
                localStorage.removeItem(`exam_deadline_${examId}`);
            }
            toast.success("Exam Submitted Successfully!");
            navigate('/dashboard');
        } catch (err) {
            console.error("Submission failed", err);
            toast.error("Failed to submit exam. Please try again.");
        }
    }, [answers, examId, navigate, user?.id, dispatch]);

    const handleTimeExpired = useCallback(() => {
        toast("Time's up! Submitting your answers...", { icon: '⏳' });
        submitExam();
    }, [submitExam]);

    if (loading) return <ExamSkeleton />;

    if (error) return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="text-center text-red-500 py-10 bg-red-50 rounded-lg border border-red-200 mx-4 mt-8">
                <div className="text-red-500 text-xl font-bold mb-2">Error Loading Exam</div>
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

    if (!questions || questions.length === 0) return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="min-h-[85vh] flex items-center justify-center bg-primary text-font-gray">
                No questions found for this exam.
            </div>
        </div>
    );

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="min-h-[85vh] bg-primary px-4 py-8">
                <ExamHeader
                    courseName={currentExam?.courseName}
                    currentQuestionIndex={currentQuestionIndex}
                    totalQuestions={questions.length}
                    durationMinutes={currentExam?.duration || 60}
                    examId={Number(examId)}
                    onTimeExpired={handleTimeExpired}
                />

                <QuestionCard
                    question={currentQuestion}
                    selectedChoice={answers[currentQuestion.questionId]}
                    onAnswer={(choice) => handleAnswer(currentQuestion.questionId, choice)}
                />

                <ExamFooter
                    isFirst={currentQuestionIndex === 0}
                    isLast={currentQuestionIndex === questions.length - 1}
                    onPrev={handlePrev}
                    onNext={handleNext}
                    onSubmit={submitExam}
                />
            </div>
        </div>
    );
}
