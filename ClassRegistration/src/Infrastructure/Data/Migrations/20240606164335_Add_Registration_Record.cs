using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClassRegistration.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class Add_Registration_Record : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserClasses_Humans_UserId",
                table: "UserClasses");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "UserClasses",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "RegistrationRecord",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserClassId = table.Column<int>(type: "int", nullable: true),
                    RegistrationScheduleId = table.Column<int>(type: "int", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    Result = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Message = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Dependency = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Created = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastModified = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    LastModifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RegistrationRecord", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RegistrationRecord_Humans_UserId",
                        column: x => x.UserId,
                        principalTable: "Humans",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_RegistrationRecord_RegistrationSchedules_RegistrationScheduleId",
                        column: x => x.RegistrationScheduleId,
                        principalTable: "RegistrationSchedules",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_RegistrationRecord_UserClasses_UserClassId",
                        column: x => x.UserClassId,
                        principalTable: "UserClasses",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_RegistrationRecord_RegistrationScheduleId",
                table: "RegistrationRecord",
                column: "RegistrationScheduleId");

            migrationBuilder.CreateIndex(
                name: "IX_RegistrationRecord_UserClassId",
                table: "RegistrationRecord",
                column: "UserClassId",
                unique: true,
                filter: "[UserClassId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_RegistrationRecord_UserId",
                table: "RegistrationRecord",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserClasses_Humans_UserId",
                table: "UserClasses",
                column: "UserId",
                principalTable: "Humans",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserClasses_Humans_UserId",
                table: "UserClasses");

            migrationBuilder.DropTable(
                name: "RegistrationRecord");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "UserClasses",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_UserClasses_Humans_UserId",
                table: "UserClasses",
                column: "UserId",
                principalTable: "Humans",
                principalColumn: "Id");
        }
    }
}
