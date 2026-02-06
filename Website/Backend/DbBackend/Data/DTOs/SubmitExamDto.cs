namespace DbBackend.Data.DTOs
{
    public class SubmitExamDto
    {
        public int ExamId { get; set; }
        public int UserId { get; set; }
        public List<AnswerDto> Answers { get; set; } = new();
    }

    public class AnswerDto
    {
        public int QuestionId { get; set; }
        public int ChoiceNumber { get; set; }
    }
}
