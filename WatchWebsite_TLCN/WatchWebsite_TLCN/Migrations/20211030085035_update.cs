using Microsoft.EntityFrameworkCore.Migrations;

namespace WatchWebsite_TLCN.Migrations
{
    public partial class update : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comment_Comment_RepyFrom",
                table: "Comment");

            migrationBuilder.DropIndex(
                name: "IX_Comment_RepyFrom",
                table: "Comment");

            migrationBuilder.DropColumn(
                name: "RepyFrom",
                table: "Comment");

            migrationBuilder.CreateIndex(
                name: "IX_Comment_ReplyFrom",
                table: "Comment",
                column: "ReplyFrom");

            migrationBuilder.AddForeignKey(
                name: "FK_Comment_Comment_ReplyFrom",
                table: "Comment",
                column: "ReplyFrom",
                principalTable: "Comment",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comment_Comment_ReplyFrom",
                table: "Comment");

            migrationBuilder.DropIndex(
                name: "IX_Comment_ReplyFrom",
                table: "Comment");

            migrationBuilder.AddColumn<int>(
                name: "RepyFrom",
                table: "Comment",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Comment_RepyFrom",
                table: "Comment",
                column: "RepyFrom");

            migrationBuilder.AddForeignKey(
                name: "FK_Comment_Comment_RepyFrom",
                table: "Comment",
                column: "RepyFrom",
                principalTable: "Comment",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
