using BookShop.Api.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookShop.Api.Configurations;

public class GenreConfiguration : IEntityTypeConfiguration<Genre>
{
    public void Configure(EntityTypeBuilder<Genre> builder)
    {
        builder.Property(g => g.Name)
        .IsRequired()
        .HasMaxLength(100)
        .UseCollation(DbCollations.CaseInsensitive);

        builder.HasIndex(g => g.Name, "IX_GenreName").IsUnique();
    }
}