interface ExamFooterProps {
    isFirst: boolean;
    isLast: boolean;
    onPrev: () => void;
    onNext: () => void;
    onSubmit: () => void;
}

export default function ExamFooter({ isFirst, isLast, onPrev, onNext, onSubmit }: ExamFooterProps) {
    return (
        <div className="flex justify-between items-center">
            <button
                onClick={onPrev}
                disabled={isFirst}
                className={`px-6 py-3 rounded-lg border border-border-primary font-medium transition-all ${isFirst
                        ? 'text-font-gray opacity-50 cursor-not-allowed bg-card-secondary'
                        : 'text-font-gray bg-card-primary hover:bg-secondary hover:text-font-white'
                    }`}
            >
                Previous
            </button>

            <button
                onClick={isLast ? onSubmit : onNext}
                className="px-8 py-3 bg-gradient-to-r from-[var(--color-btn-primary-color1)] to-[var(--color-btn-primary-color2)] text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-transform"
            >
                {isLast ? 'Finish Exam' : 'Next Question'}
            </button>
        </div>
    );
}
