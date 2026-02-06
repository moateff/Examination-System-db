import { CheckCircle2 } from 'lucide-react';
import type { Question } from "@/features/examiner-dashboard/services/examService";

interface QuestionCardProps {
    question: Question;
    questionNumber: number;
    selectedChoice?: number;
    onAnswer: (choiceNumber: number) => void;
}

export default function QuestionCard({ question, questionNumber, selectedChoice, onAnswer }: QuestionCardProps) {
    const isAnswered = selectedChoice !== undefined;

    return (
        <div className="bg-card-primary border border-border-primary rounded-xl p-5 mb-4 shadow-red-500/5 relative overflow-hidden fade-in shadow-md">
            <div className={`absolute top-0 left-0 w-1 h-full transition-colors '
                }`}></div>

            <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <span className="text-font-white font-semibold text-base">Question {questionNumber}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-secondary text-font-primary text-xs font-bold border border-border-primary">
                            {question.mark} Marks

                        </span>
                        {isAnswered && (
                            <CheckCircle2 size={18} className="text-green-500" />
                        )}
                    </div>
                </div>
                <h2 className="text-lg font-medium text-font-white leading-relaxed">
                    {question.questionText}
                </h2>
            </div>

            <div className="space-y-3">
                {question.choices.map((choice) => (
                    <label
                        key={choice.choiceNumber}
                        className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 group ${selectedChoice === choice.choiceNumber
                            ? 'border-font-primary bg-secondary'
                            : 'border-border-primary hover:border-font-gray bg-card-secondary'
                            }`}
                    >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 transition-colors shrink-0 ${selectedChoice === choice.choiceNumber
                            ? 'border-font-primary'
                            : 'border-font-gray group-hover:border-font-white'
                            }`}>
                            {selectedChoice === choice.choiceNumber && (
                                <div className="w-2.5 h-2.5 rounded-full bg-font-primary"></div>
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
                        <span className={`text-base ${selectedChoice === choice.choiceNumber
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
