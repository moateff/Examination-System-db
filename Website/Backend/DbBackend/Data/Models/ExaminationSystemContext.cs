using DbBackend.Data.DTOs;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

namespace DbBackend.Data.Models;

public partial class ExaminationSystemContext : DbContext
{
    public ExaminationSystemContext()
    {
    }

    public ExaminationSystemContext(DbContextOptions<ExaminationSystemContext> options)
        : base(options)
    {
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Data Source=.;Initial Catalog=Examination_System;Integrated Security=True;Persist Security Info=False;Pooling=False;MultipleActiveResultSets=True;Encrypt=True;TrustServerCertificate=True;Command Timeout=0");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ExamIdDto>().HasNoKey();
        modelBuilder.Entity<QuestionWithAnswersDto>().HasNoKey();
        modelBuilder.Entity<ChoiceDto>().HasNoKey();
        modelBuilder.Entity<QuestionFlatDto>().HasNoKey();
        modelBuilder.Entity<CourseDto>().HasNoKey();
        modelBuilder.Entity<ApplicantIdDto>().HasNoKey();
        modelBuilder.Entity<StudentIdDto>().HasNoKey();
        modelBuilder.Entity<UserRoleDto>().HasNoKey();
        modelBuilder.Entity<LoginResponseDto>().HasNoKey();

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
