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