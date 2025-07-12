using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GraduationProject.App.Migrations
{
    /// <inheritdoc />
    public partial class Second : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Gaze_Mode",
                table: "MindState",
                type: "nvarchar(30)",
                maxLength: 30,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Hnad_Mode",
                table: "MindState",
                type: "nvarchar(30)",
                maxLength: 30,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Gaze_Mode",
                table: "MindState");

            migrationBuilder.DropColumn(
                name: "Hnad_Mode",
                table: "MindState");
        }
    }
}
