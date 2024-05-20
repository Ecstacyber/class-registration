using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ClassRegistration.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ClassRegistration.Infrastructure.Data.Configurations;
public class SemesterConfiguration : IEntityTypeConfiguration<Semester>
{
    public void Configure(EntityTypeBuilder<Semester> builder)
    {
        builder.Property(t => t.StartYear).IsRequired();
        builder.Property(t => t.EndYear).IsRequired();
        builder.Property(t => t.Split).IsRequired();
    }
}
