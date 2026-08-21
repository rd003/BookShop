namespace BookShop.Api.Exceptions;

public class ConflictException : Exception
{
    public ConflictException(string message) : base(message) { }
}

public class UnAuthorizedException : Exception
{
    public UnAuthorizedException(string message) : base(message)
    {

    }
}

public class BadRequestException : Exception
{
    public BadRequestException(string message) : base(message)
    {
    }
}

// NotFoundException.cs
public class NotFoundException : Exception
{
    public NotFoundException(string message) : base(message)
    {
    }
}