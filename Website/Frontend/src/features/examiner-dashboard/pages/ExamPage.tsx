/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import type { AppDispatch, RootState } from '@/store';
import { fetchQuestions, submitExam as submitExamAction } from '../slices/examSlice';
import ExamHeader from '../components/exam/ExamHeader';
import QuestionCard from '../components/exam/QuestionCard';
import ExamFooter from '../components/exam/ExamFooter';
import ExamSkeleton from '../components/exam/ExamSkeleton';
import ExamSuccessPage from '../components/exam/ExamSuccessPage';
import toast from 'react-hot-toast';

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

export default function ExamPage() {
    const { courseId, examId } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const { questions, loading, error, currentExam } = useSelector((state: RootState) => state.exams as any);
    const { user } = useSelector((state: RootState) => state.auth);

    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    // Randomize questions once when they're loaded
    const randomizedQuestions = useMemo(() => {
        if (!questions || questions.length === 0) return [];
        return shuffleArray(questions);
    }, [questions]);

    useEffect(() => {
        if (courseId && examId) {
            dispatch(fetchQuestions({ courseId, examId }));
        }
    }, [dispatch, courseId, examId]);

    const handleAnswer = (questionId: number, choiceNumber: number) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: choiceNumber
        }));
    };

    const submitExam = useCallback(async () => {
        try {
            const formattedAnswers = Object.entries(answers).map(([qId, choice]) => ({
                questionId: parseInt(qId),
                choiceNumber: choice
            }));

            await dispatch(submitExamAction({
                examId: Number(examId),
                userId: String(user?.userID || ''),
                answers: formattedAnswers
            })).unwrap();

            if (examId && user?.userID) {
                const storageKey = `exam_${user.userID}_${examId}`;
                localStorage.removeItem(storageKey);
            }

            setIsSubmitted(true);
            setShowConfirmDialog(false);
            toast.success("Exam Submitted Successfully!");
        } catch (err) {
            console.error("Submission failed", err);
            toast.error("Failed to submit exam. Please try again.");
            setShowConfirmDialog(false);
        }
    }, [answers, examId, user?.userID, dispatch]);

    const handleSubmitClick = () => {
        setShowConfirmDialog(true);
    };

    const handleConfirmSubmit = () => {
        submitExam();
    };

    const handleCancelSubmit = () => {
        setShowConfirmDialog(false);
    };

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

    if (!questions || questions.length === 0 || randomizedQuestions.length === 0) return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="min-h-[85vh] flex items-center justify-center bg-primary text-font-gray">
                No questions found for this exam.
            </div>
        </div>
    );

    // Show success page after submission
    if (isSubmitted) {
        return (
            <ExamSuccessPage
                courseName={currentExam?.courseName || 'Exam'}
                totalQuestions={questions.length}
                answeredCount={Object.keys(answers).length}
                examDate={currentExam?.examDate || new Date().toISOString()}
                duration={currentExam?.duration || 60}
            />
        );
    }

    return (
        <>
            <div>
                <ExamHeader
                    courseName={currentExam?.courseName}
                    totalQuestions={randomizedQuestions.length}
                    durationMinutes={currentExam?.duration || 60}
                    examId={Number(examId)}
                    onTimeExpired={handleTimeExpired}
                    userID={user?.userID}
                />
                <div className='container mx-auto px-4 py-6 max-w-7xl'>

                    <div className=" space-y-4">
                        {randomizedQuestions.map((question: any, index: number) => (
                            <QuestionCard
                                key={question.questionId}
                                question={question}
                                questionNumber={index + 1}
                                selectedChoice={answers[question.questionId]}
                                onAnswer={(choice) => handleAnswer(question.questionId, choice)}
                            />
                        ))}
                    </div>

                </div>

                <ExamFooter
                    answeredCount={Object.keys(answers).length}
                    totalQuestions={randomizedQuestions.length}
                    onSubmit={handleSubmitClick}
                />
            </div>

            {/* Confirmation Dialog */}
            {showConfirmDialog && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
                    <div className="bg-card-primary border border-border-primary rounded-xl p-6 max-w-md w-full shadow-2xl">
                        <h3 className="text-xl font-bold text-font-white mb-3">
                            Submit Exam?
                        </h3>
                        <p className="text-font-gray mb-6">
                            Are you sure you want to submit your exam? You have answered{' '}
                            <span className="font-semibold text-font-white">{Object.keys(answers).length}</span> out of{' '}
                            <span className="font-semibold text-font-white">{randomizedQuestions.length}</span> questions.
                            {Object.keys(answers).length < randomizedQuestions.length && (
                                <span className="block mt-2 text-yellow-500 text-sm">
                                    ⚠️ You haven't answered all questions.
                                </span>
                            )}
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={handleCancelSubmit}
                                className="flex-1 px-4 py-2 bg-card-secondary border border-border-primary text-font-gray rounded-lg hover:bg-secondary transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmSubmit}
                                className="flex-1 px-4 py-2 bg-linear-to-r from-(--color-btn-primary-color1) to-btn-primary-color2 text-white font-bold rounded-lg hover:shadow-lg transition-all"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
