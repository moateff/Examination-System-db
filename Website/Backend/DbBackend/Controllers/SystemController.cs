using DbBackend.Data.DTOs;
using DbBackend.Data.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace DbBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SystemController : ControllerBase
    {
        private readonly ExaminationSystemContext _context;

        public SystemController(ExaminationSystemContext context)
        {
            _context = context;
        }

        [HttpGet("{CourseId}")]
        public IActionResult GetNumber(int CourseId)
        {
            // Step 1: Get exam ID
            var examDto = _context.Set<ExamIdDto>()
                .FromSqlRaw("EXEC Exam.getAnExam @crsId",new SqlParameter("@crsId", CourseId)).AsNoTracking().AsEnumerable().FirstOrDefault();

            if (examDto == null)
                return NotFound("No exam found for this course");

            // Step 2: Get FLAT questions + answers
            var rawData = _context.Set<QuestionFlatDto>()
                .FromSqlRaw("EXEC Exam.getQuestionsWithAnswers @exId",new SqlParameter("@exId", examDto.ExamId)).AsNoTracking().ToList();

            if (!rawData.Any())
                return NotFound("No questions found for this exam");

            // Step 3: Group & build clean structure
            var result = rawData
                .GroupBy(q => new
                {
                    q.QuestionId,
                    q.QuestionText,
                    q.Mark,
                    q.QuestionType
                })
                .Select(g => new QuestionWithAnswersDto
                {
                    QuestionId = g.Key.QuestionId,
                    QuestionText = g.Key.QuestionText,
                    Mark = g.Key.Mark,
                    QuestionType = g.Key.QuestionType,

                    Choices = g
                        .Where(x => x.ChoiceNumber.HasValue)
                        .Select(x => new ChoiceDto
                        {
                            ChoiceNumber = x.ChoiceNumber.Value,
                            ChoiceText = x.ChoiceText
                        })
                        .ToList()
                })
                .ToList();

            return Ok(result);
        }

        [HttpGet("available-exams/{userId}")]
        public IActionResult GetAvailableExams(int userId)
        {
            // 1️ - Get user role
            var role = _context.Set<UserRoleDto>()
                .FromSqlRaw("EXEC Users.CheckUserType @UserID",new SqlParameter("@UserID", userId)).AsNoTracking().AsEnumerable().FirstOrDefault();

            if (role == null)
                return NotFound("User not found");

            // 2️ - Student
            if (role.RoleType == "Student")
            {
                var studentId = _context.Set<StudentIdDto>()
                    .FromSqlRaw("EXEC Users.GetStudentIdByUserId @UserID",new SqlParameter("@UserID", userId)).AsNoTracking().AsEnumerable().FirstOrDefault();

                if (studentId == null)
                    return NotFound("Student not found");

                var exams = _context.Set<CourseDto>()
                    .FromSqlRaw("EXEC GetCourseExamsForStudent @stdId",new SqlParameter("@stdId", studentId.StudentID)).AsNoTracking().ToList();

                return Ok(new
                {
                    Role = "Student",
                    Exams = exams
                });
            }

            // 3️ - Applicant
            if (role.RoleType == "Applicant")
            {
                var applicantId = _context.Set<ApplicantIdDto>()
                    .FromSqlRaw("EXEC Users.GetApplicantIdByUserId @UserID",new SqlParameter("@UserID", userId)).AsNoTracking().AsEnumerable().FirstOrDefault();

                if (applicantId == null)
                    return NotFound("Applicant not found");

                var exams = _context.Set<CourseDto>()
                    .FromSqlRaw("EXEC GetCourseExamsForApplicants @appId",new SqlParameter("@appId", applicantId.ApplicantId)).AsNoTracking().ToList();

                return Ok(new
                {
                    Role = "Applicant",
                    Exams = exams
                });
            }

            // 4️ - Normal user
            return Ok(new
            {
                Role = "User",
            });
        }
    }
}
