using ClassRegistration.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ClassRegistration.Infrastructure.Data.Configurations;

public class RegistrationRecordConfiguration : IEntityTypeConfiguration<RegistrationRecord>
{
    public void Configure(EntityTypeBuilder<RegistrationRecord> builder)
    {
        builder.Property(t => t.Result).IsRequired();
    }
}
