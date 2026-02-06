import { useEffect, useState, useRef } from 'react';
import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ExamHeaderProps {
    courseName: string;
    totalQuestions: number;
    durationMinutes?: number;
    examId: number;
    onTimeExpired: () => void;
    userID?: number;
}

export default function ExamHeader({
    courseName,
    totalQuestions,
    durationMinutes = 60,
    examId,
    onTimeExpired,
    userID
}: ExamHeaderProps) {
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [displayName, setDisplayName] = useState<string>(courseName || 'Exam');
    const expiredRef = useRef(false);

    useEffect(() => {
        if (!userID) return;

        let STORAGE_KEY = `exam_${userID}_${examId}`;
        let savedData = localStorage.getItem(STORAGE_KEY);

        if (!savedData) {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(`exam_${userID}_`) && key.endsWith(`_${examId}`)) {
                    savedData = localStorage.getItem(key);
                    STORAGE_KEY = key;
                    break;
                }
            }
        }

        let deadline: number;

        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                deadline = parsed.deadline;
                if (!courseName && parsed.examName) {
                    setDisplayName(parsed.examName);
                }
            } catch {
                deadline = Date.now() + durationMinutes * 60 * 1000;
            }
        } else {
            if (!courseName) return;

            deadline = Date.now() + durationMinutes * 60 * 1000;
            const examData = {
                examName: courseName,
                examId: examId,
                deadline: deadline,
                startedAt: Date.now(),
                userID: userID
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(examData));
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
    }, [examId, courseName, durationMinutes, onTimeExpired, userID]);

    // Update display name when courseName loads from API
    useEffect(() => {
        if (courseName) {
            setDisplayName(courseName);
        }
    }, [courseName]);

    // Format HH:MM:SS
    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex items-center mb-3 bg-card-primary border border-border-primary rounded-lg px-4 py-3 sticky top-0 z-10">
            <div className='container mx-auto flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                    <div className="flex items-center">
                        <img src="/iti-logo.png" alt="logo" className="h-12" loading="lazy" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-font-white container mx-auto">{displayName}</h1>
                        <p className="text-font-gray text-xs">{totalQuestions} Questions</p>
                    </div>
                </div>
                <div className={`flex items-center gap-2 font-mono text-lg px-3 py-1.5 rounded-lg border border-border-primary transition-colors ${(timeLeft !== null && timeLeft < 300000) ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' : 'bg-secondary text-font-primary'
                    }`}>
                    <Clock size={18} />
                    <span>{timeLeft !== null ? formatTime(timeLeft) : '--:--:--'}</span>
                </div>
            </div>
        </div>
    );
}
