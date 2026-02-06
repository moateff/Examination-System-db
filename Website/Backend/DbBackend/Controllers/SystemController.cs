using DbBackend.Data.DTOs;
using DbBackend.Data.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;

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

        [HttpGet("exam/{CourseId}/{ExamId}")]
        public IActionResult GetExam(int CourseId, int ExamId)
        {
            var rawData = _context.Set<QuestionFlatDto>()
                .FromSqlRaw("EXEC Exam.getQuestionsWithAnswers @exId",new SqlParameter("@exId", ExamId)).AsNoTracking().ToList();

            if (!rawData.Any())
                return NotFound(new { Success = false, Message = "No questions found for this exam" });

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

            return Ok(new { Success = true, Message = "Questions retrieved successfully", Data = result });
        }

            [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto loginRequest)
        {
            if (loginRequest == null || string.IsNullOrEmpty(loginRequest.Username) || string.IsNullOrEmpty(loginRequest.Password))
                return BadRequest("Username and password are required");

            try
            {
                var loginResponse = _context.Set<LoginResponseDto>()
                    .FromSqlRaw(
                        "EXEC Users.Login @Username, @Password",
                        new SqlParameter("@Username", loginRequest.Username),
                        new SqlParameter("@Password", loginRequest.Password))
                    .AsNoTracking()
                    .AsEnumerable()
                    .FirstOrDefault();

                if (loginResponse == null)
                    return Unauthorized(new { Success = false, Message = "Invalid username or password" });

                return Ok(new
                {
                    Success = true,
                    Message = "Login successful",
                    Data = loginResponse
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred during login: {ex.Message}");
            }
        }

        [HttpGet("available-exams/{userId}")]
        public IActionResult GetAvailableExams(int userId)
        {
            try
            {
                var exams = _context.Set<CourseDto>()
                        .FromSqlRaw("EXEC Exam.GetAvailableExams @appId", new SqlParameter("@appId", userId)).AsNoTracking().ToList();

                return Ok(new { Success = true, Message = "Exams retrieved successfully", Data = exams });
            }catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while retrieving available exams: {ex.Message}");
            }
        }

        [HttpPost("submit-exam")]
        public IActionResult SubmitExam([FromBody] SubmitExamDto submitRequest)
        {
            if (submitRequest == null || submitRequest.Answers == null || !submitRequest.Answers.Any())
                return BadRequest(new { Success = false, Message = "Exam ID, User ID, and at least one answer are required" });

            try
            {
                // Get user role first
                var role = _context.Set<UserRoleDto>()
                    .FromSqlRaw("EXEC Users.CheckUserType @UserID", new SqlParameter("@UserID", submitRequest.UserId))
                    .AsNoTracking().AsEnumerable().FirstOrDefault();

                if (role == null) 
                    return NotFound(new { Success = false, Message = "User not found" });

  
                // Build DataTable for table-valued parameter
                var answersTable = new DataTable();
                answersTable.Columns.Add("QuestionID", typeof(int));
                answersTable.Columns.Add("ChoiceNumber", typeof(int));

                foreach (var answer in submitRequest.Answers)
                {
                    answersTable.Rows.Add(answer.QuestionId, answer.ChoiceNumber);
                }

                var examIdParam = new SqlParameter("@ExamID", submitRequest.ExamId);
                var examinerIdParam = new SqlParameter("@ExaminerID", submitRequest.UserId);
                var answersParam = new SqlParameter("@Answers", SqlDbType.Structured)
                {
                    TypeName = "Exam.AnswerInput",
                    Value = answersTable
                };

                _context.Database.ExecuteSqlRaw("EXEC Exam.SubmitExamAnswers @ExamID, @ExaminerID, @Answers",
                    examIdParam, examinerIdParam, answersParam);

                return Ok(new { Success = true, Message = "Exam submitted successfully" });
            }
            catch (SqlException ex) when (ex.Number >= 50001 && ex.Number <= 50005)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Success = false, Message = $"An error occurred while submitting the exam: {ex.Message}" });
            }
        }
    }
}
