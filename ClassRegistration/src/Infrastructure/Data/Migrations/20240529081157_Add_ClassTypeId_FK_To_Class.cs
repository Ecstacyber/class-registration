using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClassRegistration.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class Add_ClassTypeId_FK_To_Class : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Classes_ClassType_ClassTypeId",
                table: "Classes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ClassType",
                table: "ClassType");

            migrationBuilder.RenameTable(
                name: "ClassType",
                newName: "ClassTypes");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ClassTypes",
                table: "ClassTypes",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Classes_ClassTypes_ClassTypeId",
                table: "Classes",
                column: "ClassTypeId",
                principalTable: "ClassTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.DropForeignKey(
            //    name: "FK_Classes_ClassTypes_ClassTypeId",
            //    table: "Classes");

            //migrationBuilder.DropPrimaryKey(
            //    name: "PK_ClassTypes",
            //    table: "ClassTypes");

            //migrationBuilder.RenameTable(
            //    name: "ClassTypes",
            //    newName: "ClassType");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ClassType",
                table: "ClassType",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Classes_ClassType_ClassTypeId",
                table: "Classes",
                column: "ClassTypeId",
                principalTable: "ClassType",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
