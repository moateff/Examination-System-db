import { useEffect, useState, useRef } from 'react';
import { Clock } from 'lucide-react';

interface ExamHeaderProps {
    courseName: string;
    currentQuestionIndex: number;
    totalQuestions: number;
    durationMinutes?: number;
    examId: number;
    onTimeExpired: () => void;
}

export default function ExamHeader({
    courseName,
    currentQuestionIndex,
    totalQuestions,
    durationMinutes = 60, // default 60 mins
    examId,
    onTimeExpired
}: ExamHeaderProps) {
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const expiredRef = useRef(false);

    useEffect(() => {
        const STORAGE_KEY = `exam_deadline_${examId}`;
        const savedDeadline = localStorage.getItem(STORAGE_KEY);

        let deadline: number;

        if (savedDeadline) {
            deadline = parseInt(savedDeadline, 10);
        } else {
            // Calculate usage: Now + Duration
            deadline = Date.now() + durationMinutes * 60 * 1000;
            localStorage.setItem(STORAGE_KEY, deadline.toString());
        }

        const updateTimer = () => {
            const now = Date.now();
            const diff = deadline - now;

            if (diff <= 0) {
                setTimeLeft(0);
                if (!expiredRef.current) {
                    expiredRef.current = true;
                    onTimeExpired();
                }
            } else {
                setTimeLeft(diff);
            }
        };

        // Initial call
        updateTimer();

        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [examId, durationMinutes, onTimeExpired]);

    // Format HH:MM:SS
    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex justify-between items-center mb-8 bg-card-primary p-4 rounded-xl border border-border-primary">
            <div>
                <h1 className="text-2xl font-bold text-font-white">{courseName || 'Exam'}</h1>
                <p className="text-font-gray text-sm">Question {currentQuestionIndex + 1} of {totalQuestions}</p>
            </div>
            <div className={`flex items-center gap-2 font-mono text-xl px-4 py-2 rounded-lg border border-border-primary transition-colors ${(timeLeft !== null && timeLeft < 300000) ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' : 'bg-secondary text-font-primary'
                }`}>
                <Clock size={20} />
                <span>{timeLeft !== null ? formatTime(timeLeft) : '--:--:--'}</span>
            </div>
        </div>
    );
}
