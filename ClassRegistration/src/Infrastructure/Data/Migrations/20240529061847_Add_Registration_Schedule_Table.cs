using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClassRegistration.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class Add_Registration_Schedule_Table : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TuitionFees_Semesters_SemesterId",
                table: "TuitionFees");

            migrationBuilder.DropForeignKey(
                name: "FK_UserClasses_Semesters_SemesterId",
                table: "UserClasses");

            migrationBuilder.DropIndex(
                name: "IX_UserClasses_SemesterId",
                table: "UserClasses");

            migrationBuilder.DropIndex(
                name: "IX_TuitionFees_SemesterId",
                table: "TuitionFees");

            migrationBuilder.AddColumn<int>(
                name: "RegistrationScheduleId",
                table: "UserClasses",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RegistrationScheduleId",
                table: "TuitionFees",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ClassTypeId",
                table: "Classes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "ClassType",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Created = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastModified = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    LastModifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClassType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RegistrationSchedules",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    SemesterId = table.Column<int>(type: "int", nullable: false),
                    Created = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastModified = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    LastModifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RegistrationSchedules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RegistrationSchedules_Semesters_SemesterId",
                        column: x => x.SemesterId,
                        principalTable: "Semesters",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserClasses_RegistrationScheduleId",
                table: "UserClasses",
                column: "RegistrationScheduleId");

            migrationBuilder.CreateIndex(
                name: "IX_TuitionFees_RegistrationScheduleId",
                table: "TuitionFees",
                column: "RegistrationScheduleId");

            migrationBuilder.CreateIndex(
                name: "IX_Classes_ClassTypeId",
                table: "Classes",
                column: "ClassTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_RegistrationSchedules_SemesterId",
                table: "RegistrationSchedules",
                column: "SemesterId");

            migrationBuilder.AddForeignKey(
                name: "FK_Classes_ClassType_ClassTypeId",
                table: "Classes",
                column: "ClassTypeId",
                principalTable: "ClassType",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TuitionFees_RegistrationSchedules_RegistrationScheduleId",
                table: "TuitionFees",
                column: "RegistrationScheduleId",
                principalTable: "RegistrationSchedules",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserClasses_RegistrationSchedules_RegistrationScheduleId",
                table: "UserClasses",
                column: "RegistrationScheduleId",
                principalTable: "RegistrationSchedules",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Classes_ClassType_ClassTypeId",
                table: "Classes");

            migrationBuilder.DropForeignKey(
                name: "FK_TuitionFees_RegistrationSchedules_RegistrationScheduleId",
                table: "TuitionFees");

            migrationBuilder.DropForeignKey(
                name: "FK_UserClasses_RegistrationSchedules_RegistrationScheduleId",
                table: "UserClasses");

            migrationBuilder.DropTable(
                name: "ClassType");

            migrationBuilder.DropTable(
                name: "RegistrationSchedules");

            migrationBuilder.DropIndex(
                name: "IX_UserClasses_RegistrationScheduleId",
                table: "UserClasses");

            migrationBuilder.DropIndex(
                name: "IX_TuitionFees_RegistrationScheduleId",
                table: "TuitionFees");

            migrationBuilder.DropIndex(
                name: "IX_Classes_ClassTypeId",
                table: "Classes");

            migrationBuilder.DropColumn(
                name: "RegistrationScheduleId",
                table: "UserClasses");

            migrationBuilder.DropColumn(
                name: "RegistrationScheduleId",
                table: "TuitionFees");

            migrationBuilder.DropColumn(
                name: "ClassTypeId",
                table: "Classes");

            migrationBuilder.CreateIndex(
                name: "IX_UserClasses_SemesterId",
                table: "UserClasses",
                column: "SemesterId");

            migrationBuilder.CreateIndex(
                name: "IX_TuitionFees_SemesterId",
                table: "TuitionFees",
                column: "SemesterId");

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
    }
}
