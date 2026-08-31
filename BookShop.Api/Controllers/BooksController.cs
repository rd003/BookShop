using BookShop.Api.Exceptions;
using BookShop.Api.Helpers;
using BookShop.Api.Mappers;
using BookShop.Api.Models;
using BookShop.Api.Models.DTOs;
using BookShop.Api.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookShop.Api.Controllers;

// TODO: Protect the controler
// [Authorize(Roles = Roles.Admin)]
[ApiController]
[Route("/api/[controller]")]
public class BooksController(AppDbContext context, SortHelper<Genre> sortHelper) : ControllerBase
{
    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> GetBooks()
    {
        return Ok();
    }

    [AllowAnonymous]
    [HttpGet("{id:int}", Name = nameof(GetBookById))]
    public async Task<IActionResult> GetBookById(int id)
    {
        return Ok();
    }

    [HttpPost]
    public async Task<IActionResult> CreateBook(CreateBookDto createBookDto)
    {
        if ((createBookDto.PublisherId is null) == string.IsNullOrWhiteSpace(createBookDto.NewPublisherName))
        {
            throw new BadRequestException("Pass exactly one of publisherId or publisherName");
        }

        using var tran = await context.Database.BeginTransactionAsync();

        // Case: Create a new publisher
        if (!string.IsNullOrWhiteSpace(createBookDto.NewPublisherName))
        {
            // check publisher's existence
            var existingPublisher = await context.Publishers.SingleOrDefaultAsync(x => EF.Functions.Like(x.Name, createBookDto.NewPublisherName));

            // Create publisher if not present
            if (existingPublisher is null)
            {
                var newPublisher = new Publisher
                {
                    Name = createBookDto.NewPublisherName
                };
                context.Publishers.Add(newPublisher);
                await context.SaveChangesAsync();
                createBookDto.PublisherId = newPublisher.Id;
            }
            else
            {
                createBookDto.PublisherId = existingPublisher.Id;
            }
        }

        // Case: if user passes new genres
        if (createBookDto.NewGenreNames.Any())
        {
            var existingGenres = await context.Genres
                .Where(g => createBookDto.NewGenreNames.Contains(g.Name))
                .ToListAsync();

            var existingByName = existingGenres
                .ToDictionary(g => g.Name, g => g.Id, StringComparer.CurrentCultureIgnoreCase);

            var genresToCreate = createBookDto.NewGenreNames
                .Where(name => !existingByName.ContainsKey(name))
                .Distinct(StringComparer.CurrentCultureIgnoreCase)
                .Select(name => new Genre { Name = name })
                .ToList();

            if (genresToCreate.Count > 0)
            {
                context.Genres.AddRange(genresToCreate);
                await context.SaveChangesAsync();
            }

            foreach (var id in existingByName.Values.Concat(genresToCreate.Select(g => g.Id)))
            {
                if (!createBookDto.ExistingGenreIds.Contains(id))
                {
                    createBookDto.ExistingGenreIds.Add(id);
                }
            }
        }

        // Case: if user passes new authors
        if (createBookDto.NewAuthorNames.Any())
        {
            var existingAuthors = await context.Authors
                .Where(a => createBookDto.NewAuthorNames.Contains(a.Name))
                .ToListAsync();

            var existingByName = existingAuthors
                .ToDictionary(a => a.Name, a => a.Id, StringComparer.CurrentCultureIgnoreCase);

            var authorsToCreate = createBookDto.NewAuthorNames
                .Where(name => !existingByName.ContainsKey(name))
                .Distinct(StringComparer.CurrentCultureIgnoreCase)
                .Select(name => new Author { Name = name })
                .ToList();

            if (authorsToCreate.Count > 0)
            {
                context.Authors.AddRange(authorsToCreate);
                await context.SaveChangesAsync();
            }

            foreach (var id in existingByName.Values.Concat(authorsToCreate.Select(a => a.Id)))
            {
                if (!createBookDto.ExistingAuthorIds.Contains(id))
                {
                    createBookDto.ExistingAuthorIds.Add(id);
                }
            }
        }

        // Create Book
        var createdBook = createBookDto.ToDomain();
        context.Books.Add(createdBook);
        await context.SaveChangesAsync();

        // Create BookAuthors entry
        foreach (var authorId in createBookDto.ExistingAuthorIds)
        {
            var newBookAuthor = new BookAuthor
            {
                AuthorId = authorId,
                BookId = createdBook.Id
            };
            context.BookAuthors.Add(newBookAuthor);
        }

        // Create BookGenres entry
        foreach (var genreId in createBookDto.ExistingGenreIds)
        {
            var newBookGenre = new BookGenre
            {
                GenreId = genreId,
                BookId = createdBook.Id
            };
            context.BookGenres.Add(newBookGenre);
        }

        await context.SaveChangesAsync();
        await tran.CommitAsync();
        // find book with joins with authors,genres,publisher, then return

        var bookToReturn = await context.Books
        .Include(b => b.Publisher)
        .Include(b => b.BookAuthors)
        .Include(b => b.BookGenres)
        .Select(b => new ReadBookDto
        {
            Id = b.Id,
            PublisherName = b.Publisher.Name,
            Isbn = b.Isbn,
            CoverImageUrl = b.CoverImageUrl,
            Description = b.Description,
            Price = b.Price,
            PublisherId = b.PublisherId,
            Title = b.Title,
            StockQuantity = b.StockQuantity,
            Authors = b.BookAuthors.Select(ba => ba.Author.ToDto()).ToList(),
            Genres = b.BookGenres.Select(bg => bg.Genre.ToDto()).ToList()
        })
        .SingleOrDefaultAsync(b => b.Id == createdBook.Id);

        return CreatedAtRoute(nameof(GetBookById), new { id = createdBook.Id }, bookToReturn);
    }
}