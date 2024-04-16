using ClassRegistration.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ClassRegistration.Infrastructure.Data.Configurations;

public class DepartmentConfiguration : IEntityTypeConfiguration<Department>
{
    public void Configure(EntityTypeBuilder<Department> builder)
    {
        builder.Property(t => t.ShortName)
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(t => t.FullName)
            .IsRequired();
    }
}
