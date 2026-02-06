import { Clock, Calendar, ChevronRight, BookOpen } from 'lucide-react';
import type { Exam } from '@/features/examiner-dashboard/types';

interface ExamCardProps {
    exam: Exam;
    onStart: (exam: Exam) => void;
    isActive?: boolean;
    hasOtherActiveExam?: boolean;
}

export default function ExamCard({ exam, onStart, isActive = false, hasOtherActiveExam = false }: ExamCardProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-lg hover:border-red-300 transition-all duration-300 group">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="shrink-0 w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
                        <BookOpen size={20} className="text-red-500" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-slate-800 truncate group-hover:text-red-600 transition-colors">
                            {exam.courseName}
                        </h3>
                        <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                            <div className="flex items-center gap-1.5">
                                <Calendar size={14} className="text-slate-400" />
                                <span>{formatDate(exam.examDate)}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock size={14} className="text-slate-400" />
                                <span>{exam.duration} min</span>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => onStart(exam)}
                    disabled={hasOtherActiveExam}
                    className={`shrink-0 flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg transition-all duration-300 ${hasOtherActiveExam
                        ? 'bg-gray-400 cursor-not-allowed opacity-50'
                        : isActive
                            ? 'bg-red-500/80 hover:bg-red-600/50 cursor-pointer group-hover:shadow-md'

                            : 'bg-red-500 hover:bg-red-600 cursor-pointer group-hover:shadow-md'
                        }`}
                >
                    {isActive ? 'Continue Exam' : 'Start Exam'}
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
}
