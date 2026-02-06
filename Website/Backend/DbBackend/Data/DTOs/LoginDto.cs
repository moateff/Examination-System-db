namespace DbBackend.Data.DTOs
{
    public class LoginDto
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class LoginResponseDto
    {
        public int UserID { get; set; }
        public string FName { get; set; }
        public string LName { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public char Role { get; set; }
        public char Gender { get; set; }
    }
}
