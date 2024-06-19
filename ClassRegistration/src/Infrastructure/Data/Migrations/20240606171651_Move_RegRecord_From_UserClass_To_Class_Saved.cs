using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClassRegistration.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class Move_RegRecord_From_UserClass_To_Class_Saved : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RegistrationRecord_UserClasses_UserClassId",
                table: "RegistrationRecord");

            migrationBuilder.DropIndex(
                name: "IX_RegistrationRecord_UserClassId",
                table: "RegistrationRecord");

            migrationBuilder.RenameColumn(
                name: "UserClassId",
                table: "RegistrationRecord",
                newName: "ClassId");

            migrationBuilder.CreateIndex(
                name: "IX_RegistrationRecord_ClassId",
                table: "RegistrationRecord",
                column: "ClassId");

            migrationBuilder.AddForeignKey(
                name: "FK_RegistrationRecord_Classes_ClassId",
                table: "RegistrationRecord",
                column: "ClassId",
                principalTable: "Classes",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RegistrationRecord_Classes_ClassId",
                table: "RegistrationRecord");

            migrationBuilder.DropIndex(
                name: "IX_RegistrationRecord_ClassId",
                table: "RegistrationRecord");

            migrationBuilder.RenameColumn(
                name: "ClassId",
                table: "RegistrationRecord",
                newName: "UserClassId");

            migrationBuilder.CreateIndex(
                name: "IX_RegistrationRecord_UserClassId",
                table: "RegistrationRecord",
                column: "UserClassId",
                unique: true,
                filter: "[UserClassId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_RegistrationRecord_UserClasses_UserClassId",
                table: "RegistrationRecord",
                column: "UserClassId",
                principalTable: "UserClasses",
                principalColumn: "Id");
        }
    }
}
