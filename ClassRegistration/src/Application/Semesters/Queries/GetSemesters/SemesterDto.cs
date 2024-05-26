using ClassRegistration.Domain.Entities;

namespace ClassRegistration.Application.Semesters.Queries.GetSemesters;
public class SemesterDto
{
    public int Id { get; set; }
    public int StartYear { get; set; }
    public int EndYear { get; set; }
    public int Split { get; set; }
    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Semester, SemesterDto>();
        }
    }
}
