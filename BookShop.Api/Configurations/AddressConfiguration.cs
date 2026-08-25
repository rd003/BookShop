using BookShop.Api.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookShop.Api.Configurations;

public class AddressConfiguration : IEntityTypeConfiguration<Address>
{
    public void Configure(EntityTypeBuilder<Address> builder)
    {
        builder.Property(a => a.UserId).IsRequired();
        builder.Property(a => a.FullName).IsRequired().HasMaxLength(200);
        builder.Property(a => a.Phone).IsRequired().HasMaxLength(20);
        builder.Property(a => a.Line1).IsRequired().HasMaxLength(300);
        builder.Property(a => a.Line2).HasMaxLength(300);
        builder.Property(a => a.City).IsRequired().HasMaxLength(100);
        builder.Property(a => a.State).IsRequired().HasMaxLength(100);
        builder.Property(a => a.PostalCode).IsRequired().HasMaxLength(20);
        builder.Property(a => a.Country).IsRequired().HasMaxLength(100);

        builder.HasIndex(a => a.UserId);
    }
}