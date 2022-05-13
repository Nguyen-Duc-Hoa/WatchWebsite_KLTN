using Microsoft.EntityFrameworkCore.Migrations;

namespace WatchWebsite_TLCN.Migrations
{
    public partial class test : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_UserTracking",
                table: "UserTracking");

            migrationBuilder.AlterColumn<string>(
                name: "ProductId",
                table: "UserTracking",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserTracking",
                table: "UserTracking",
                column: "Cookie");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_UserTracking",
                table: "UserTracking");

            migrationBuilder.AlterColumn<string>(
                name: "ProductId",
                table: "UserTracking",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserTracking",
                table: "UserTracking",
                columns: new[] { "Cookie", "ProductId" });
        }
    }
}
