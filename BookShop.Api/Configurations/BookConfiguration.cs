using BookShop.Api.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookShop.Api.Configurations;

public class BookConfiguration : IEntityTypeConfiguration<Book>
{
    public void Configure(EntityTypeBuilder<Book> builder)
    {
        builder.Property(b => b.Title).IsRequired().HasMaxLength(300);
        builder.Property(b => b.Isbn).IsRequired().HasMaxLength(20);
        builder.HasIndex(b => b.Isbn).IsUnique();
        builder.Property(b => b.Price).HasPrecision(10, 2);

        builder.HasOne(b => b.Publisher)
        .WithMany(b => b.Books)
        .HasForeignKey(b => b.PublisherId)
        .OnDelete(DeleteBehavior.Restrict);
    }
}