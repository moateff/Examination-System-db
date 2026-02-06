namespace DbBackend.Data.DTOs
{
    public class CourseDto
    {     
        public int examId { get; set; }
        public int courseId { get; set; }
        public string courseName { get; set; }
        public DateTime ExamDate { get; set; }
        public int Duration { get; set; }
   
    }
}