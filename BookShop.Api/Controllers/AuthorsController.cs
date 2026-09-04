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
public class AuthorsController(AppDbContext context, SortHelper<Author> sortHelper) : ControllerBase
{
    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> GetAuthors([FromQuery] QueryParameters queryParameters)
    {
        IQueryable<Author> authorsQuery = context.Authors;

        // filter by search term
        if (!string.IsNullOrEmpty(queryParameters.SearchTerm))
        {
            authorsQuery = authorsQuery.Where(a => a.Name.ToLower().StartsWith(queryParameters.SearchTerm));
        }
        if (!string.IsNullOrEmpty(queryParameters.SortBy))
        {
            authorsQuery = sortHelper.ApplySort(authorsQuery, queryParameters.SortBy);
        }
        var pagedAuthors = await PagedList<Author>.ToPagedListAsync(authorsQuery, queryParameters.PageNumber, queryParameters.PageSize);
        var pagedAuthorDtos = pagedAuthors.ToPagedList(a => a.ToDto());
        return Ok(pagedAuthorDtos);
    }


    [HttpPost]
    public async Task<IActionResult> CreateAuthor(CreateAuthorDto createAuthor)
    {
        var genre = createAuthor.ToDomain();
        context.Authors.Add(genre);
        await context.SaveChangesAsync();
        return CreatedAtRoute(nameof(GetAuthor), new { id = genre.Id }, genre.ToDto());
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateAuthor(int id, UpdateAuthorDto updateAuthor)
    {
        if (id != updateAuthor.Id)
        {
            throw new BadRequestException("Id in url and body does not match");
        }
        var existingAuthor = await context.Authors.AsNoTracking().SingleOrDefaultAsync(x => x.Id == id) ?? throw new NotFoundException("Author does not found.");

        var genre = updateAuthor.ToDomain();
        genre.Updated = DateTime.UtcNow;
        context.Authors.Update(genre);
        await context.SaveChangesAsync();
        return NoContent();
    }

    [AllowAnonymous]
    [HttpGet("{id:int}", Name = nameof(GetAuthor))]
    public async Task<IActionResult> GetAuthor(int id)
    {
        var genre = await context.Authors.FindAsync(id) ?? throw new NotFoundException("Author does not found");
        return Ok(genre.ToDto());
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteAuthor(int id)
    {
        var genre = await context.Authors.FindAsync(id) ?? throw new NotFoundException("Author does not found");
        genre.Deleted = DateTime.UtcNow;
        await context.SaveChangesAsync();
        return NoContent();
    }
}