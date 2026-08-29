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
    public async Task<IActionResult> CreateGenre(CreateGenreDto createGenre)
    {
        var genre = createGenre.ToDomain();
        context.Genres.Add(genre);
        await context.SaveChangesAsync();
        return CreatedAtRoute(nameof(GetGenre), new { id = genre.Id }, genre.ToDto());
    }

    [HttpGet("{id:int}", Name = nameof(GetGenre))]
    public async Task<IActionResult> GetGenre(int id)
    {
        var genre = await context.Genres.FindAsync(id) ?? throw new NotFoundException("Genre does not found");
        return Ok(genre.ToDto());
    }
}