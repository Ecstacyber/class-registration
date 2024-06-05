using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ClassRegistration.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ClassRegistration.Infrastructure.Data.Configurations;
public class RegistrationScheduleConfiguration : IEntityTypeConfiguration<RegistrationSchedule>
{
    public void Configure(EntityTypeBuilder<RegistrationSchedule> builder)
    {
        builder.Property(t => t.Name).IsRequired();
        builder.Property(t => t.StartDate).IsRequired();
        builder.Property(t => t.EndDate).IsRequired();
    }  
}
