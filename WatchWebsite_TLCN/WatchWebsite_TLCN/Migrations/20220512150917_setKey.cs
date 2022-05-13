using Microsoft.EntityFrameworkCore.Migrations;

namespace WatchWebsite_TLCN.Migrations
{
    public partial class setKey : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_UserTracking",
                table: "UserTracking");

            migrationBuilder.AlterColumn<string>(
                name: "ProductId",
                table: "UserTracking",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserTracking",
                table: "UserTracking",
                columns: new[] { "Cookie", "ProductId" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_UserTracking",
                table: "UserTracking");

            migrationBuilder.AlterColumn<string>(
                name: "ProductId",
                table: "UserTracking",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string));

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserTracking",
                table: "UserTracking",
                column: "Cookie");
        }
    }
}
