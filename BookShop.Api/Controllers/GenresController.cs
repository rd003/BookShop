using BookShop.Api.Constants;
using BookShop.Api.Exceptions;
using BookShop.Api.Mappers;
using BookShop.Api.Models;
using BookShop.Api.Models.DTOs;
using BookShop.Api.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookShop.Api.Controllers;

// [Authorize(Roles = Roles.Admin)]
[ApiController]
[Route("/api/[controller]")]
public class GenresController(ILogger<GenresController> logger, AppDbContext context) : ControllerBase
{
    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> GetGenres()
    {
        IQueryable<Genre> genresQuery = context.Genres;
        var genres = await genresQuery.Select(g => g.ToDto())
        .ToListAsync();
        return Ok(genres);
    }

    // TODO: Protect this endpoint
    [HttpPost]
    public async Task<IActionResult> CreateGenre(CreateGenreDto createGenre)
    {
        var genre = createGenre.ToDomain();
        context.Genres.Add(genre);
        await context.SaveChangesAsync();
        return CreatedAtRoute(nameof(GetGenre), new { id = genre.Id }, genre.ToDto());
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateGenre(int id, UpdateGenreDto updateGenre)
    {
        if (id != updateGenre.Id)
        {
            throw new BadRequestException("Id in url and body does not match");
        }
        var existingGenre = await context.Genres.AsNoTracking().SingleOrDefaultAsync(x => x.Id == id);
        if (existingGenre is null)
        {
            throw new NotFoundException("Genre does not found.");
        }
        var genre = updateGenre.ToDomain();
        genre.Updated = DateTime.UtcNow;
        context.Genres.Update(genre);
        await context.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("{id:int}", Name = nameof(GetGenre))]
    public async Task<IActionResult> GetGenre(int id)
    {
        var genre = await context.Genres.FindAsync(id) ?? throw new NotFoundException("Genre does not found");
        return Ok(genre.ToDto());
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteGenre(int id)
    {
        var genre = await context.Genres.FindAsync(id) ?? throw new NotFoundException("Genre does not found");
        genre.Deleted = DateTime.UtcNow;
        await context.SaveChangesAsync();
        return NoContent();
    }
}