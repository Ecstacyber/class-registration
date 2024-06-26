﻿using ClassRegistration.Application.Courses.Queries.GetCourses;
using ClassRegistration.Domain.Entities;
using Microsoft.EntityFrameworkCore.Query.Internal;

namespace ClassRegistration.Application.Classes.Queries.GetClasses;

public class ClassResult
{
    public int Id { get; set; }
    public int CourseId { get; set; }
    public int ClassTypeId { get; set; }
    public int RegistrationScheduleId { get; set; }
    public string? ClassCode { get; set; }
    public string? DepartmentName { get; set; }
    public string? LecturerName { get; set; }
    public int Credit { get; set; }
    public int DayOfWeek { get; set; }
    public int StartPeriod { get; set; }
    public int EndPeriod { get; set; }
    public int Capacity { get; set; }
    public int UserClassCount { get; set; }
    public bool CanBeRegistered { get; set; }
    public ClassType? ClassType { get; set; }
    public Course? Course { get; set; }
    public CourseResult? CourseResult { get; set; }
    public RegistrationSchedule? RegistrationSchedule { get; set; }
    //public IList<UserClass> UserClasses { get; set; } = new List<UserClass>();
    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Class, ClassResult>();
        }
    }
}
