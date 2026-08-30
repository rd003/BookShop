using BookShop.Api.Exceptions;
using BookShop.Api.Helpers;
using BookShop.Api.Mappers;
using BookShop.Api.Models;
using BookShop.Api.Models.DTOs;
using BookShop.Api.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace BookShop.Api.Controllers;

// TODO: Protect the controler
// [Publisherize(Roles = Roles.Admin)]
[ApiController]
[Route("/api/[controller]")]
public class PublisherController(AppDbContext context, SortHelper<Publisher> sortHelper) : ControllerBase
{
    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> GetPublishers([FromQuery] QueryParameters queryParameters)
    {
        IQueryable<Publisher> publishersQuery = context.Publishers;

        // filter by search term
        if (!string.IsNullOrEmpty(queryParameters.SearchTerm))
        {
            publishersQuery = publishersQuery.Where(a => a.Name.ToLower().StartsWith(queryParameters.SearchTerm));
        }
        if (!string.IsNullOrEmpty(queryParameters.SortBy))
        {
            publishersQuery = sortHelper.ApplySort(publishersQuery, queryParameters.SortBy);
        }
        var pagedPublishers = await PagedList<Publisher>.ToPagedListAsync(publishersQuery, queryParameters.PageNumber, queryParameters.PageSize);
        var pagedPublisherDtos = pagedPublishers.ToPagedList(a => a.ToDto());
        return Ok(pagedPublisherDtos);
    }


    [HttpPost]
    public async Task<IActionResult> CreatePublisher(CreatePublisherDto createPublisher)
    {
        var genre = createPublisher.ToDomain();
        context.Publishers.Add(genre);
        await context.SaveChangesAsync();
        return CreatedAtRoute(nameof(GetPublisher), new { id = genre.Id }, genre.ToDto());
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdatePublisher(int id, UpdatePublisherDto updatePublisher)
    {
        if (id != updatePublisher.Id)
        {
            throw new BadRequestException("Id in url and body does not match");
        }
        var existingPublisher = await context.Publishers.AsNoTracking().SingleOrDefaultAsync(x => x.Id == id) ?? throw new NotFoundException("Publisher does not found.");

        var genre = updatePublisher.ToDomain();
        genre.Updated = DateTime.UtcNow;
        context.Publishers.Update(genre);
        await context.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("{id:int}", Name = nameof(GetPublisher))]
    public async Task<IActionResult> GetPublisher(int id)
    {
        var genre = await context.Publishers.FindAsync(id) ?? throw new NotFoundException("Publisher does not found");
        return Ok(genre.ToDto());
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeletePublisher(int id)
    {
        var genre = await context.Publishers.FindAsync(id) ?? throw new NotFoundException("Publisher does not found");
        genre.Deleted = DateTime.UtcNow;
        await context.SaveChangesAsync();
        return NoContent();
    }
}