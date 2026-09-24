using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookShop.Api.Migrations
{
    /// <inheritdoc />
    public partial class RemoveSoftDeleteUniqeFromGenreAndPublisher : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Publishers_Name",
                table: "Publishers");

            migrationBuilder.DropIndex(
                name: "IX_GenreName",
                table: "Genres");

            migrationBuilder.CreateIndex(
                name: "IX_Publishers_Name",
                table: "Publishers",
                column: "Name",
                unique: true,
                filter: "\"Deleted\" IS NULL");

            migrationBuilder.CreateIndex(
                name: "IX_GenreName",
                table: "Genres",
                column: "Name",
                unique: true,
                filter: "\"Deleted\" IS NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Publishers_Name",
                table: "Publishers");

            migrationBuilder.DropIndex(
                name: "IX_GenreName",
                table: "Genres");

            migrationBuilder.CreateIndex(
                name: "IX_Publishers_Name",
                table: "Publishers",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GenreName",
                table: "Genres",
                column: "Name",
                unique: true);
        }
    }
}
