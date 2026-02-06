import { CheckCircle2, Clock, FileText, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ExamSuccessPageProps {
    courseName: string;
    totalQuestions: number;
    answeredCount: number;
    examDate: string;
    duration: number;
}

export default function ExamSuccessPage({
    courseName,
    totalQuestions,
    answeredCount,
    examDate,
    duration
}: ExamSuccessPageProps) {
    const navigate = useNavigate();

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-primary px-4">
            <div className="max-w-2xl w-full bg-card-primary border border-border-primary rounded-2xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                        <CheckCircle2 size={48} className="text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-font-white mb-2">
                        Exam Submitted Successfully!
                    </h1>
                    <p className="text-font-gray text-lg">
                        Your answers have been recorded and submitted.
                    </p>
                </div>

                <div className="bg-secondary border border-border-primary rounded-xl p-6 mb-6">
                    <h2 className="text-xl font-semibold text-font-white mb-4">Exam Details</h2>

                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <FileText size={20} className="text-font-primary mt-1 shrink-0" />
                            <div>
                                <p className="text-font-gray text-sm">Course</p>
                                <p className="text-font-white font-medium">{courseName}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Calendar size={20} className="text-font-primary mt-1 shrink-0" />
                            <div>
                                <p className="text-font-gray text-sm">Submitted On</p>
                                <p className="text-font-white font-medium">{formatDate(examDate)}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Clock size={20} className="text-font-primary mt-1 shrink-0" />
                            <div>
                                <p className="text-font-gray text-sm">Duration</p>
                                <p className="text-font-white font-medium">{duration} minutes</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <CheckCircle2 size={20} className="text-font-primary mt-1 shrink-0" />
                            <div>
                                <p className="text-font-gray text-sm">Questions Answered</p>
                                <p className="text-font-white font-medium">
                                    {answeredCount} out of {totalQuestions} questions
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="flex-1 px-6 py-3 bg-linear-to-r from-(--color-btn-primary-color1) to-btn-primary-color2 text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-transform"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div >
    );
}
