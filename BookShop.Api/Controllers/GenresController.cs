using BookShop.Api.Constants;
using BookShop.Api.Models;
using BookShop.Api.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookShop.Api.Controllers;

// [Authorize(Roles = Roles.Admin)]
[ApiController]
[Route("/api/[controller]2")]
public class GenresController(ILogger<GenresController> logger, AppDbContext context) : ControllerBase
{
    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> GetGenres()
    {
        IQueryable<Genre> genresQuery = context.Genres;
        return Ok(await genresQuery.ToListAsync());
    }

    // TODO: Protect this endpoint
    public async Task<IActionResult> CreateGenre()
    {
        int createdId = 1;
        return CreatedAtRoute("GetGenre", new { id = createdId });
    }

    [HttpGet("{id}", Name = "GetGenre")]
    public async Task<IActionResult> GetGenre(int id)
    {
        return Ok();
    }
}