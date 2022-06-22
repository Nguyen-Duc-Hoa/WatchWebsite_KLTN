using Microsoft.EntityFrameworkCore.Migrations;

namespace WatchWebsite_TLCN.Migrations
{
    public partial class addVoucherNameAndDiscountnOrder : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<float>(
                name: "Discount",
                table: "Order",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "VoucherName",
                table: "Order",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Discount",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "VoucherName",
                table: "Order");
        }
    }
}
