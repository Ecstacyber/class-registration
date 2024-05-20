using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClassRegistration.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddDepartmentIdToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TuitionFee_AspNetUsers_ApplicationUserId",
                table: "TuitionFee");

            migrationBuilder.DropForeignKey(
                name: "FK_TuitionFee_Semester_SemesterId",
                table: "TuitionFee");

            migrationBuilder.DropForeignKey(
                name: "FK_UserClasses_Semester_SemesterId",
                table: "UserClasses");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TuitionFee",
                table: "TuitionFee");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Semester",
                table: "Semester");

            migrationBuilder.RenameTable(
                name: "TuitionFee",
                newName: "TuitionFees");

            migrationBuilder.RenameTable(
                name: "Semester",
                newName: "Semesters");

            migrationBuilder.RenameIndex(
                name: "IX_TuitionFee_SemesterId",
                table: "TuitionFees",
                newName: "IX_TuitionFees_SemesterId");

            migrationBuilder.RenameIndex(
                name: "IX_TuitionFee_ApplicationUserId",
                table: "TuitionFees",
                newName: "IX_TuitionFees_ApplicationUserId");

            migrationBuilder.AddColumn<int>(
                name: "DepartmentId",
                table: "AspNetUsers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_TuitionFees",
                table: "TuitionFees",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Semesters",
                table: "Semesters",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_DepartmentId",
                table: "AspNetUsers",
                column: "DepartmentId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Departments_DepartmentId",
                table: "AspNetUsers",
                column: "DepartmentId",
                principalTable: "Departments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TuitionFees_AspNetUsers_ApplicationUserId",
                table: "TuitionFees",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TuitionFees_Semesters_SemesterId",
                table: "TuitionFees",
                column: "SemesterId",
                principalTable: "Semesters",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserClasses_Semesters_SemesterId",
                table: "UserClasses",
                column: "SemesterId",
                principalTable: "Semesters",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Departments_DepartmentId",
                table: "AspNetUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_TuitionFees_AspNetUsers_ApplicationUserId",
                table: "TuitionFees");

            migrationBuilder.DropForeignKey(
                name: "FK_TuitionFees_Semesters_SemesterId",
                table: "TuitionFees");

            migrationBuilder.DropForeignKey(
                name: "FK_UserClasses_Semesters_SemesterId",
                table: "UserClasses");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_DepartmentId",
                table: "AspNetUsers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TuitionFees",
                table: "TuitionFees");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Semesters",
                table: "Semesters");

            migrationBuilder.DropColumn(
                name: "DepartmentId",
                table: "AspNetUsers");

            migrationBuilder.RenameTable(
                name: "TuitionFees",
                newName: "TuitionFee");

            migrationBuilder.RenameTable(
                name: "Semesters",
                newName: "Semester");

            migrationBuilder.RenameIndex(
                name: "IX_TuitionFees_SemesterId",
                table: "TuitionFee",
                newName: "IX_TuitionFee_SemesterId");

            migrationBuilder.RenameIndex(
                name: "IX_TuitionFees_ApplicationUserId",
                table: "TuitionFee",
                newName: "IX_TuitionFee_ApplicationUserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TuitionFee",
                table: "TuitionFee",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Semester",
                table: "Semester",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TuitionFee_AspNetUsers_ApplicationUserId",
                table: "TuitionFee",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TuitionFee_Semester_SemesterId",
                table: "TuitionFee",
                column: "SemesterId",
                principalTable: "Semester",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserClasses_Semester_SemesterId",
                table: "UserClasses",
                column: "SemesterId",
                principalTable: "Semester",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
