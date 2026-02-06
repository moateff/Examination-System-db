import type { Question } from "@/features/examiner-dashboard/services/examService";

interface QuestionCardProps {
    question: Question;
    selectedChoice?: number;
    onAnswer: (choiceNumber: number) => void;
}

export default function QuestionCard({ question, selectedChoice, onAnswer }: QuestionCardProps) {
    return (
        <div className="bg-card-primary border border-border-primary rounded-2xl p-8 mb-8 shadow-lg shadow-red-500/5 relative overflow-hidden fade-in">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[var(--color-btn-primary-color1)] to-[var(--color-btn-primary-color2)]"></div>

            <div className="mb-6">
                <span className="inline-block px-3 py-1 rounded-full bg-secondary text-font-primary text-xs font-bold mb-3 border border-border-primary">
                    {question.mark} Marks
                </span>
                <h2 className="text-2xl font-medium text-font-white leading-relaxed">
                    {question.questionText}
                </h2>
            </div>

            <div className="space-y-4">
                {question.choices.map((choice) => (
                    <label
                        key={choice.choiceNumber}
                        className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 group ${selectedChoice === choice.choiceNumber
                            ? 'border-font-primary bg-secondary'
                            : 'border-border-primary hover:border-font-gray bg-card-secondary'
                            }`}
                    >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-colors ${selectedChoice === choice.choiceNumber
                            ? 'border-font-primary'
                            : 'border-font-gray group-hover:border-font-white'
                            }`}>
                            {selectedChoice === choice.choiceNumber && (
                                <div className="w-3 h-3 rounded-full bg-font-primary"></div>
                            )}
                        </div>
                        <input
                            type="radio"
                            name={`question-${question.questionId}`}
                            value={choice.choiceNumber}
                            checked={selectedChoice === choice.choiceNumber}
                            onChange={() => onAnswer(choice.choiceNumber)}
                            className="hidden"
                        />
                        <span className={`text-lg ${selectedChoice === choice.choiceNumber
                            ? 'text-font-primary font-medium'
                            : 'text-font-gray group-hover:text-font-white'
                            }`}>
                            {choice.choiceText}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
}
