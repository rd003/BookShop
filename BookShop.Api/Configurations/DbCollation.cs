namespace BookShop.Api.Configurations;

public static class DbCollations
{
    // Set this once based on the active provider, e.g. read from config/DI at startup
    public static string CaseInsensitive { get; set; } = "NOCASE"; // default for SQLite dev
}