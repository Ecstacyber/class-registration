using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClassRegistration.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateClass : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DayOfWeek",
                table: "Classes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "EndPeriod",
                table: "Classes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "StartPeriod",
                table: "Classes",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DayOfWeek",
                table: "Classes");

            migrationBuilder.DropColumn(
                name: "EndPeriod",
                table: "Classes");

            migrationBuilder.DropColumn(
                name: "StartPeriod",
                table: "Classes");
        }
    }
}
