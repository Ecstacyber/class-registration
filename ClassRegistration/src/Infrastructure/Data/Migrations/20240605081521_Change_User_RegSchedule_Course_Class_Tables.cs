﻿using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClassRegistration.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class Change_User_RegSchedule_Course_Class_Tables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Departments_DepartmentId",
                table: "AspNetUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_RegistrationSchedules_Semesters_SemesterId",
                table: "RegistrationSchedules");

            migrationBuilder.DropForeignKey(
                name: "FK_TuitionFees_AspNetUsers_ApplicationUserId",
                table: "TuitionFees");

            migrationBuilder.DropForeignKey(
                name: "FK_UserClasses_AspNetUsers_ApplicationUserId",
                table: "UserClasses");

            migrationBuilder.DropIndex(
                name: "IX_UserClasses_ApplicationUserId",
                table: "UserClasses");

            migrationBuilder.DropIndex(
                name: "IX_TuitionFees_ApplicationUserId",
                table: "TuitionFees");

            migrationBuilder.DropIndex(
                name: "IX_RegistrationSchedules_SemesterId",
                table: "RegistrationSchedules");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_DepartmentId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "ApplicationUserId",
                table: "UserClasses");

            migrationBuilder.DropColumn(
                name: "ApplicationUserId",
                table: "TuitionFees");

            migrationBuilder.DropColumn(
                name: "SemesterId",
                table: "RegistrationSchedules");

            migrationBuilder.DropColumn(
                name: "Credit",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "Fee",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "DepartmentId",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "UserClasses",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "TuitionFees",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "FeePerCredit",
                table: "RegistrationSchedules",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Credit",
                table: "Classes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "RegistrationScheduleId",
                table: "Classes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "HumanId",
                table: "AspNetUsers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Humans",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DepartmentId = table.Column<int>(type: "int", nullable: true),
                    Created = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastModified = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    LastModifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Humans", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Humans_Departments_DepartmentId",
                        column: x => x.DepartmentId,
                        principalTable: "Departments",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserClasses_UserId",
                table: "UserClasses",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_TuitionFees_UserId",
                table: "TuitionFees",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Classes_RegistrationScheduleId",
                table: "Classes",
                column: "RegistrationScheduleId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_HumanId",
                table: "AspNetUsers",
                column: "HumanId");

            migrationBuilder.CreateIndex(
                name: "IX_Humans_DepartmentId",
                table: "Humans",
                column: "DepartmentId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Humans_HumanId",
                table: "AspNetUsers",
                column: "HumanId",
                principalTable: "Humans",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Classes_RegistrationSchedules_RegistrationScheduleId",
                table: "Classes",
                column: "RegistrationScheduleId",
                principalTable: "RegistrationSchedules",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TuitionFees_Humans_UserId",
                table: "TuitionFees",
                column: "UserId",
                principalTable: "Humans",
                principalColumn: "Id");

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
                name: "FK_AspNetUsers_Humans_HumanId",
                table: "AspNetUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_Classes_RegistrationSchedules_RegistrationScheduleId",
                table: "Classes");

            migrationBuilder.DropForeignKey(
                name: "FK_TuitionFees_Humans_UserId",
                table: "TuitionFees");

            migrationBuilder.DropForeignKey(
                name: "FK_UserClasses_Humans_UserId",
                table: "UserClasses");

            migrationBuilder.DropTable(
                name: "Humans");

            migrationBuilder.DropIndex(
                name: "IX_UserClasses_UserId",
                table: "UserClasses");

            migrationBuilder.DropIndex(
                name: "IX_TuitionFees_UserId",
                table: "TuitionFees");

            migrationBuilder.DropIndex(
                name: "IX_Classes_RegistrationScheduleId",
                table: "Classes");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_HumanId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "UserClasses");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "TuitionFees");

            migrationBuilder.DropColumn(
                name: "FeePerCredit",
                table: "RegistrationSchedules");

            migrationBuilder.DropColumn(
                name: "Credit",
                table: "Classes");

            migrationBuilder.DropColumn(
                name: "RegistrationScheduleId",
                table: "Classes");

            migrationBuilder.DropColumn(
                name: "HumanId",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<string>(
                name: "ApplicationUserId",
                table: "UserClasses",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ApplicationUserId",
                table: "TuitionFees",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SemesterId",
                table: "RegistrationSchedules",
                type: "int",
                nullable: true);

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
                name: "DepartmentId",
                table: "AspNetUsers",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserClasses_ApplicationUserId",
                table: "UserClasses",
                column: "ApplicationUserId");

            migrationBuilder.CreateIndex(
                name: "IX_TuitionFees_ApplicationUserId",
                table: "TuitionFees",
                column: "ApplicationUserId");

            migrationBuilder.CreateIndex(
                name: "IX_RegistrationSchedules_SemesterId",
                table: "RegistrationSchedules",
                column: "SemesterId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_DepartmentId",
                table: "AspNetUsers",
                column: "DepartmentId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Departments_DepartmentId",
                table: "AspNetUsers",
                column: "DepartmentId",
                principalTable: "Departments",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_RegistrationSchedules_Semesters_SemesterId",
                table: "RegistrationSchedules",
                column: "SemesterId",
                principalTable: "Semesters",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TuitionFees_AspNetUsers_ApplicationUserId",
                table: "TuitionFees",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserClasses_AspNetUsers_ApplicationUserId",
                table: "UserClasses",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
