import { Clock, Calendar, ChevronRight } from 'lucide-react';
import type { Exam } from '@/features/examiner-dashboard/services/examService';

interface ExamCardProps {
    exam: Exam;
    onStart: (exam: Exam) => void;
}

export default function ExamCard({ exam, onStart }: ExamCardProps) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom"></div>

            <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-red-600 transition-colors">
                {exam.courseName || `Exam ${exam.courseId}`}
            </h3>

            <div className="space-y-3 mb-6 text-slate-500 text-sm">
                <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-red-400" />
                    <span>{exam.date || 'Flexible Date'}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock size={16} className="text-red-400" />
                    <span>{exam.duration || 60} Minutes</span>
                </div>
            </div>

            <button
                onClick={() => onStart(exam)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 hover:bg-red-500 hover:text-white text-slate-700 border border-slate-200 hover:border-red-500 rounded-lg transition-all duration-300 font-semibold group-hover:shadow-md"
            >
                Start Exam
                <ChevronRight size={18} />
            </button>
        </div>
    );
}
