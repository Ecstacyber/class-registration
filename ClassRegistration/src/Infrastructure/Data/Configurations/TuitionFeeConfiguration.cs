using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ClassRegistration.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ClassRegistration.Infrastructure.Data.Configurations;
public class TuitionFeeConfiguration : IEntityTypeConfiguration<TuitionFee>
{
    public void Configure(EntityTypeBuilder<TuitionFee> buider)
    {
        buider.Property(t => t.TotalFee).IsRequired();
    }
}
