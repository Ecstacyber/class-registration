using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClassRegistration.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class Remove_UserId_From_UserClass : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserClasses_Humans_UserId1",
                table: "UserClasses");

            migrationBuilder.DropIndex(
                name: "IX_UserClasses_UserId1",
                table: "UserClasses");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "UserClasses");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "UserClasses",
                type: "int",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserClasses_UserId",
                table: "UserClasses",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserClasses_Humans_UserId",
                table: "UserClasses",
                column: "UserId",
                principalTable: "Humans",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserClasses_Humans_UserId",
                table: "UserClasses");

            migrationBuilder.DropIndex(
                name: "IX_UserClasses_UserId",
                table: "UserClasses");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "UserClasses",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId1",
                table: "UserClasses",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserClasses_UserId1",
                table: "UserClasses",
                column: "UserId1");

            migrationBuilder.AddForeignKey(
                name: "FK_UserClasses_Humans_UserId1",
                table: "UserClasses",
                column: "UserId1",
                principalTable: "Humans",
                principalColumn: "Id");
        }
    }
}
