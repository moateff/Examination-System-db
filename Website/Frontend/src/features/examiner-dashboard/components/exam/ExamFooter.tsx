interface ExamFooterProps {
    onSubmit: () => void;
    answeredCount: number;
    totalQuestions: number;
}

export default function ExamFooter({ onSubmit, answeredCount, totalQuestions }: ExamFooterProps) {
    return (
        <div className="sticky bottom-0 bg-card-primary border border-border-primary p-4 rounded-lg mt-6">
            <div className="flex justify-between items-center container mx-auto">
                <div className="text-font-gray text-sm">
                    Answered: <span className="font-semibold text-font-white">{answeredCount}</span> / {totalQuestions}
                </div>
                <button
                    onClick={onSubmit}
                    className="px-6 py-2 bg-linear-to-r from-(--color-btn-primary-color1) to-btn-primary-color2 text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-transform text-sm"
                >
                    Submit Exam
                </button>
            </div>
        </div>
    );
}
