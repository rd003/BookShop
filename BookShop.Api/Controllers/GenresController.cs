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

// TODO: Protect the controler
// [Authorize(Roles = Roles.Admin)]
[ApiController]
[Route("/api/[controller]")]
public class GenresController(AppDbContext context) : ControllerBase
{
    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> GetGenres([FromQuery] QueryParameters queryParameters)
    {
        IQueryable<Genre> genresQuery = context.Genres;

        // filter by search term
        if (!string.IsNullOrEmpty(queryParameters.SearchTerm))
        {
            genresQuery = genresQuery.Where(a => a.Name.ToLower().StartsWith(queryParameters.SearchTerm));
        }
        // if (!string.IsNullOrEmpty(queryParameters.SortBy))
        // {
        //     genresQuery = _sortHelper.ApplySort(genresQuery, queryParameters.SortBy);
        // }

        var pagedGenres = await PagedList<Genre>.ToPagedListAsync(genresQuery, queryParameters.PageNumber, queryParameters.PageSize);
        var pagedGenreDtos = pagedGenres.ToPagedList(g => g.ToDto());

        return Ok(pagedGenreDtos);
    }


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