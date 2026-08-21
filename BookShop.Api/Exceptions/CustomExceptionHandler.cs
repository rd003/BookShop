using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace BookShop.Api.Exceptions;

public class CustomExceptionHandler : IExceptionHandler
{
    private readonly IProblemDetailsService _problemDetailService;
    private readonly ILogger<CustomExceptionHandler> _logger;

    public CustomExceptionHandler(IProblemDetailsService problemDetailService, ILogger<CustomExceptionHandler> logger)
    {
        _problemDetailService = problemDetailService;
        _logger = logger;
    }
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        _logger.LogError(exception.Message);

        // determining status code on the basis of exception
        var (statusCode, problemDetails) = GetProblemDetailsAndStatusCode(exception);

        httpContext.Response.StatusCode = statusCode;

        return await _problemDetailService.TryWriteAsync(new ProblemDetailsContext
        {
            HttpContext = httpContext,
            ProblemDetails = problemDetails,
            Exception = exception
        });

    }

    private (int, ProblemDetails) GetProblemDetailsAndStatusCode(Exception exception)
    {
        return exception switch
        {
            BadRequestException =>
            (
                StatusCodes.Status400BadRequest,
                new ProblemDetails
                {
                    Status = StatusCodes.Status400BadRequest,
                    Title = "Bad request",
                    Detail = exception.Message,
                    Type = "https://tools.ietf.org/html/rfc7231#section-6.5.1"
                }),
            NotFoundException => (
                StatusCodes.Status404NotFound,
                new ProblemDetails
                {
                    Status = StatusCodes.Status404NotFound,
                    Title = "Resource not found",
                    Detail = exception.Message,
                    Type = "https://tools.ietf.org/html/rfc7231#section-6.5.4"
                }
            ),
            UnAuthorizedException => (
                StatusCodes.Status401Unauthorized,
                new ProblemDetails
                {
                    Status = StatusCodes.Status401Unauthorized,
                    Title = "Authauthorized access",
                    Detail = exception.Message,
                    Type = "Aunauthorized access"
                }
            ),
            ConflictException => (
                StatusCodes.Status409Conflict,
                new ProblemDetails
                {
                    Status = StatusCodes.Status409Conflict,
                    Title = "Conflict exception",
                    Detail = exception.Message,
                    Type = "Conflict exception"
                }
            ),
            _ => (
                StatusCodes.Status500InternalServerError,
                new ProblemDetails
                {
                    Status = StatusCodes.Status500InternalServerError,
                    Title = "Server error",
                    Detail = exception.Message,
                    Type = "https://tools.ietf.org/html/rfc7231#section-6.6.1"
                }
           )
        };
    }

}