using BookShop.Api.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookShop.Api.Configurations;

public class PublisherConfiguration : IEntityTypeConfiguration<Publisher>
{
    public void Configure(EntityTypeBuilder<Publisher> builder)
    {
        builder.Property(p => p.Name)
        .IsRequired()
        .HasMaxLength(200)
        .UseCollation(DbCollations.CaseInsensitive);

        builder.HasIndex(p => p.Name).IsUnique();
    }
}