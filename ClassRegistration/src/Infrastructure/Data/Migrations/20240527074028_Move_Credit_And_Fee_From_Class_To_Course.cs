using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClassRegistration.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class Move_Credit_And_Fee_From_Class_To_Course : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Fee",
                table: "Classes");

            migrationBuilder.RenameColumn(
                name: "Credit",
                table: "Classes",
                newName: "StartPeriod");

            migrationBuilder.AddColumn<int>(
                name: "Credit",
                table: "Courses",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<long>(
                name: "Fee",
                table: "Courses",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Credit",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "Fee",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "DayOfWeek",
                table: "Classes");

            migrationBuilder.DropColumn(
                name: "EndPeriod",
                table: "Classes");

            migrationBuilder.RenameColumn(
                name: "StartPeriod",
                table: "Classes",
                newName: "Credit");

            migrationBuilder.AddColumn<string>(
                name: "Fee",
                table: "Classes",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
