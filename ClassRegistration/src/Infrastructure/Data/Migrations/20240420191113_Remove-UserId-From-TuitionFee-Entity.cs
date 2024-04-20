using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClassRegistration.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemoveUserIdFromTuitionFeeEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TuitionFee_AspNetUsers_ApplicationUserId1",
                table: "TuitionFee");

            migrationBuilder.DropIndex(
                name: "IX_TuitionFee_ApplicationUserId1",
                table: "TuitionFee");

            migrationBuilder.DropColumn(
                name: "ApplicationUserId1",
                table: "TuitionFee");

            migrationBuilder.AlterColumn<string>(
                name: "ApplicationUserId",
                table: "TuitionFee",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateIndex(
                name: "IX_TuitionFee_ApplicationUserId",
                table: "TuitionFee",
                column: "ApplicationUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_TuitionFee_AspNetUsers_ApplicationUserId",
                table: "TuitionFee",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TuitionFee_AspNetUsers_ApplicationUserId",
                table: "TuitionFee");

            migrationBuilder.DropIndex(
                name: "IX_TuitionFee_ApplicationUserId",
                table: "TuitionFee");

            migrationBuilder.AlterColumn<int>(
                name: "ApplicationUserId",
                table: "TuitionFee",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ApplicationUserId1",
                table: "TuitionFee",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TuitionFee_ApplicationUserId1",
                table: "TuitionFee",
                column: "ApplicationUserId1");

            migrationBuilder.AddForeignKey(
                name: "FK_TuitionFee_AspNetUsers_ApplicationUserId1",
                table: "TuitionFee",
                column: "ApplicationUserId1",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
