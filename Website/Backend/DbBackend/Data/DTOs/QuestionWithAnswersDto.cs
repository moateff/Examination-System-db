namespace DbBackend.Data.DTOs
{
    public class QuestionWithAnswersDto
    {
        public int QuestionId { get; set; }
        public string QuestionText { get; set; }
        public int Mark { get; set; }
        public string QuestionType { get; set; }

        public List<ChoiceDto> Choices { get; set; } = new();
    }


}
