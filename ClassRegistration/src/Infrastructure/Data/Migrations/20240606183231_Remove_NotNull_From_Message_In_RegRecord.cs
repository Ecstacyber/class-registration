using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClassRegistration.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class Remove_NotNull_From_Message_In_RegRecord : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RegistrationRecord_Classes_ClassId",
                table: "RegistrationRecord");

            migrationBuilder.DropForeignKey(
                name: "FK_RegistrationRecord_Humans_UserId",
                table: "RegistrationRecord");

            migrationBuilder.DropForeignKey(
                name: "FK_RegistrationRecord_RegistrationSchedules_RegistrationScheduleId",
                table: "RegistrationRecord");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RegistrationRecord",
                table: "RegistrationRecord");

            migrationBuilder.RenameTable(
                name: "RegistrationRecord",
                newName: "RegistrationRecords");

            migrationBuilder.RenameIndex(
                name: "IX_RegistrationRecord_UserId",
                table: "RegistrationRecords",
                newName: "IX_RegistrationRecords_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_RegistrationRecord_RegistrationScheduleId",
                table: "RegistrationRecords",
                newName: "IX_RegistrationRecords_RegistrationScheduleId");

            migrationBuilder.RenameIndex(
                name: "IX_RegistrationRecord_ClassId",
                table: "RegistrationRecords",
                newName: "IX_RegistrationRecords_ClassId");

            migrationBuilder.AlterColumn<string>(
                name: "Message",
                table: "RegistrationRecords",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RegistrationRecords",
                table: "RegistrationRecords",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_RegistrationRecords_Classes_ClassId",
                table: "RegistrationRecords",
                column: "ClassId",
                principalTable: "Classes",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_RegistrationRecords_Humans_UserId",
                table: "RegistrationRecords",
                column: "UserId",
                principalTable: "Humans",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_RegistrationRecords_RegistrationSchedules_RegistrationScheduleId",
                table: "RegistrationRecords",
                column: "RegistrationScheduleId",
                principalTable: "RegistrationSchedules",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RegistrationRecords_Classes_ClassId",
                table: "RegistrationRecords");

            migrationBuilder.DropForeignKey(
                name: "FK_RegistrationRecords_Humans_UserId",
                table: "RegistrationRecords");

            migrationBuilder.DropForeignKey(
                name: "FK_RegistrationRecords_RegistrationSchedules_RegistrationScheduleId",
                table: "RegistrationRecords");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RegistrationRecords",
                table: "RegistrationRecords");

            migrationBuilder.RenameTable(
                name: "RegistrationRecords",
                newName: "RegistrationRecord");

            migrationBuilder.RenameIndex(
                name: "IX_RegistrationRecords_UserId",
                table: "RegistrationRecord",
                newName: "IX_RegistrationRecord_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_RegistrationRecords_RegistrationScheduleId",
                table: "RegistrationRecord",
                newName: "IX_RegistrationRecord_RegistrationScheduleId");

            migrationBuilder.RenameIndex(
                name: "IX_RegistrationRecords_ClassId",
                table: "RegistrationRecord",
                newName: "IX_RegistrationRecord_ClassId");

            migrationBuilder.AlterColumn<string>(
                name: "Message",
                table: "RegistrationRecord",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_RegistrationRecord",
                table: "RegistrationRecord",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_RegistrationRecord_Classes_ClassId",
                table: "RegistrationRecord",
                column: "ClassId",
                principalTable: "Classes",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_RegistrationRecord_Humans_UserId",
                table: "RegistrationRecord",
                column: "UserId",
                principalTable: "Humans",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_RegistrationRecord_RegistrationSchedules_RegistrationScheduleId",
                table: "RegistrationRecord",
                column: "RegistrationScheduleId",
                principalTable: "RegistrationSchedules",
                principalColumn: "Id");
        }
    }
}
