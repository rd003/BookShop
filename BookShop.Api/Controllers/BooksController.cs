using BookShop.Api.Constants;
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

[Authorize(Roles = Roles.Admin)]
[ApiController]
[Route("/api/[controller]")]
public class BooksController(AppDbContext context, SortHelper<Book> sortHelper) : ControllerBase
{
    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> GetBooks([FromQuery] QueryParameters queryParameters, [FromQuery] int[] genreIds, [FromQuery] int[] authorIds)
    {
        IQueryable<Book> booksQuery = context.Books
        .Include(b => b.Publisher)
        .Include(b => b.BookAuthors)
        .ThenInclude(ba => ba.Author)
        .Include(b => b.BookGenres)
        .ThenInclude(bg => bg.Genre);

        // filter by search term
        if (!string.IsNullOrEmpty(queryParameters.SearchTerm))
        {
            booksQuery = booksQuery.Where(a => a.Title.ToLower().StartsWith(queryParameters.SearchTerm));
        }

        if (authorIds.Length != 0)
        {
            booksQuery = booksQuery.Where(b => b.BookAuthors.Any(ba => authorIds.Contains(ba.AuthorId)));
        }

        // TODO: Filter by genres
        if (genreIds.Length != 0)
        {
            booksQuery = booksQuery.Where(b => b.BookGenres.Any(bg => genreIds.Contains(bg.GenreId)));
        }

        if (!string.IsNullOrEmpty(queryParameters.SortBy))
        {
            booksQuery = sortHelper.ApplySort(booksQuery, queryParameters.SortBy);
        }

        var pagedBooks = await PagedList<Book>.ToPagedListAsync(booksQuery, queryParameters.PageNumber, queryParameters.PageSize);

        var pagedBookDtos = pagedBooks.ToPagedList(b => new ReadBookDto
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
        });
        return Ok(pagedBookDtos);
    }

    [AllowAnonymous]
    [HttpGet("{id:int}", Name = nameof(GetBook))]
    public async Task<IActionResult> GetBook(int id)
    {
        var book = await GetBookById(id) ?? throw new NotFoundException("Book Not found");
        return Ok(book);
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
        ReadBookDto? bookToReturn = await GetBookById(createdBook.Id);

        return CreatedAtRoute(nameof(GetBook), new { id = createdBook.Id }, bookToReturn);

    }

    private async Task<ReadBookDto?> GetBookById(int id)
    {
        // find book with joins with authors,genres,publisher, then return

        return await context.Books
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
        .SingleOrDefaultAsync(b => b.Id == id);
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> UpdateBook(int id, UpdateBookDto updateBookDto)
    {
        var book = await context.Books.FindAsync(id);
        if (book is null)
        {
            throw new NotFoundException("Book does not found");
        }

        if (updateBookDto.PublisherId is not null && !string.IsNullOrWhiteSpace(updateBookDto.NewPublisherName))
        {
            throw new BadRequestException("Pass at most one of publisherId or publisherName");
        }

        using var tran = await context.Database.BeginTransactionAsync();

        book.Updated = DateTime.UtcNow;
        if (updateBookDto.Title is not null) book.Title = updateBookDto.Title;
        if (updateBookDto.Description is not null) book.Description = updateBookDto.Description;
        if (updateBookDto.Isbn is not null) book.Isbn = updateBookDto.Isbn;
        if (updateBookDto.Price is not null) book.Price = updateBookDto.Price.Value;
        if (updateBookDto.StockQuantity is not null) book.StockQuantity = updateBookDto.StockQuantity.Value;
        if (updateBookDto.CoverImageUrl is not null) book.CoverImageUrl = updateBookDto.CoverImageUrl;

        // Publisher
        if (updateBookDto.PublisherId is not null)
        {
            book.PublisherId = updateBookDto.PublisherId.Value;
        }
        else if (!string.IsNullOrWhiteSpace(updateBookDto.NewPublisherName))
        {
            var existingPublisher = await context.Publishers
                .SingleOrDefaultAsync(x => EF.Functions.Like(x.Name, updateBookDto.NewPublisherName));

            if (existingPublisher is null)
            {
                var newPublisher = new Publisher { Name = updateBookDto.NewPublisherName };
                context.Publishers.Add(newPublisher);
                await context.SaveChangesAsync();
                book.PublisherId = newPublisher.Id;
            }
            else
            {
                book.PublisherId = existingPublisher.Id;
            }
        }

        // Genres — only touch relations if caller sent something
        if (updateBookDto.GenreIds is not null || (updateBookDto.NewGenreNames?.Any() ?? false))
        {
            var finalGenreIds = new HashSet<int>(updateBookDto.GenreIds ?? []);

            if (updateBookDto.NewGenreNames?.Any() ?? false)
            {
                var existingGenres = await context.Genres
                    .Where(g => updateBookDto.NewGenreNames.Contains(g.Name))
                    .ToListAsync();

                var existingByName = existingGenres
                    .ToDictionary(g => g.Name, g => g.Id, StringComparer.CurrentCultureIgnoreCase);

                var genresToCreate = updateBookDto.NewGenreNames
                    .Where(name => !existingByName.ContainsKey(name))
                    .Distinct(StringComparer.CurrentCultureIgnoreCase)
                    .Select(name => new Genre { Name = name })
                    .ToList();

                if (genresToCreate.Count > 0)
                {
                    context.Genres.AddRange(genresToCreate);
                    await context.SaveChangesAsync();
                }

                finalGenreIds.UnionWith(existingByName.Values);
                finalGenreIds.UnionWith(genresToCreate.Select(g => g.Id));
            }

            var currentLinks = await context.BookGenres.Where(bg => bg.BookId == id).ToListAsync();
            var currentIds = currentLinks.Select(l => l.GenreId).ToHashSet();

            context.BookGenres.RemoveRange(currentLinks.Where(l => !finalGenreIds.Contains(l.GenreId)));
            context.BookGenres.AddRange(finalGenreIds.Except(currentIds)
                .Select(gid => new BookGenre { BookId = id, GenreId = gid }));
        }

        // Authors 
        if (updateBookDto.AuthorIds is not null || (updateBookDto.NewAuthorNames?.Any() ?? false))
        {
            var finalAuthorIds = new HashSet<int>(updateBookDto.AuthorIds ?? []);

            if (updateBookDto.NewAuthorNames?.Any() ?? false)
            {
                var existingAuthors = await context.Authors
                    .Where(a => updateBookDto.NewAuthorNames.Contains(a.Name))
                    .ToListAsync();

                var existingByName = existingAuthors
                    .ToDictionary(a => a.Name, a => a.Id, StringComparer.CurrentCultureIgnoreCase);

                var authorsToCreate = updateBookDto.NewAuthorNames
                    .Where(name => !existingByName.ContainsKey(name))
                    .Distinct(StringComparer.CurrentCultureIgnoreCase)
                    .Select(name => new Author { Name = name })
                    .ToList();

                if (authorsToCreate.Count > 0)
                {
                    context.Authors.AddRange(authorsToCreate);
                    await context.SaveChangesAsync();
                }

                finalAuthorIds.UnionWith(existingByName.Values);
                finalAuthorIds.UnionWith(authorsToCreate.Select(a => a.Id));
            }

            var currentLinks = await context.BookAuthors.Where(ba => ba.BookId == id).ToListAsync();
            var currentIds = currentLinks.Select(l => l.AuthorId).ToHashSet();

            context.BookAuthors.RemoveRange(currentLinks.Where(l => !finalAuthorIds.Contains(l.AuthorId)));
            context.BookAuthors.AddRange(finalAuthorIds.Except(currentIds)
                .Select(aid => new BookAuthor { BookId = id, AuthorId = aid }));
        }

        await context.SaveChangesAsync();
        await tran.CommitAsync();

        var bookToReturn = await GetBookById(id);

        return Ok(bookToReturn);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteBook(int id)
    {
        var book = await context.Books.FindAsync(id) ??
            throw new NotFoundException("Book not found");

        book.Deleted = DateTime.UtcNow;

        var bookGenres = await context.BookGenres.Where(bg => bg.BookId == id).ToListAsync();
        foreach (var bookGenre in bookGenres)
        {
            bookGenre.Deleted = DateTime.UtcNow;
        }

        var bookAuthors = await context.BookAuthors.Where(ba => ba.BookId == id).ToListAsync();
        foreach (var bookAuthor in bookAuthors)
        {
            bookAuthor.Deleted = DateTime.UtcNow;
        }

        await context.SaveChangesAsync();
        return NoContent();
    }
}