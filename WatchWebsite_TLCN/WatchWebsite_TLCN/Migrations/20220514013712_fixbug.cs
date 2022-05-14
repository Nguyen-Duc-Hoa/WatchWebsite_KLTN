using Microsoft.EntityFrameworkCore.Migrations;

namespace WatchWebsite_TLCN.Migrations
{
    public partial class fixbug : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SubImage_Product_ProductId",
                table: "SubImage");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SubImage",
                table: "SubImage");

            migrationBuilder.RenameTable(
                name: "SubImage",
                newName: "SubImages");

            migrationBuilder.RenameIndex(
                name: "IX_SubImage_ProductId",
                table: "SubImages",
                newName: "IX_SubImages_ProductId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SubImages",
                table: "SubImages",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SubImages_Product_ProductId",
                table: "SubImages",
                column: "ProductId",
                principalTable: "Product",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SubImages_Product_ProductId",
                table: "SubImages");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SubImages",
                table: "SubImages");

            migrationBuilder.RenameTable(
                name: "SubImages",
                newName: "SubImage");

            migrationBuilder.RenameIndex(
                name: "IX_SubImages_ProductId",
                table: "SubImage",
                newName: "IX_SubImage_ProductId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SubImage",
                table: "SubImage",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SubImage_Product_ProductId",
                table: "SubImage",
                column: "ProductId",
                principalTable: "Product",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
