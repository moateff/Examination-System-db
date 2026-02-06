namespace DbBackend.Data.DTOs
{
    public class QuestionFlatDto
    {
        public int QuestionId { get; set; }
        public string QuestionText { get; set; }
        public int Mark { get; set; }
        public string QuestionType { get; set; }

        public int? ChoiceNumber { get; set; }
        public string? ChoiceText { get; set; }
    }

}
