using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace WatchWebsite_TLCN.Migrations
{
    public partial class addLimitDateInRate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "LimitDate",
                table: "Rates",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LimitDate",
                table: "Rates");
        }
    }
}
