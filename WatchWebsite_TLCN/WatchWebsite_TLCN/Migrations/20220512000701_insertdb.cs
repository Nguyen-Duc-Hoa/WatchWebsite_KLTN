using Microsoft.EntityFrameworkCore.Migrations;

namespace WatchWebsite_TLCN.Migrations
{
    public partial class insertdb : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Cookie",
                table: "UserTracking",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "Cookie",
                table: "UserTracking",
                type: "int",
                nullable: false,
                oldClrType: typeof(string));
        }
    }
}
