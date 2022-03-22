using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace WatchWebsite_TLCN.Migrations
{
    public partial class Update1703 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CodeVoucher",
                table: "Order",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "State",
                table: "Comment",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Rates",
                columns: table => new
                {
                    UserId = table.Column<int>(nullable: false),
                    ProductId = table.Column<string>(nullable: false),
                    Value = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rates", x => new { x.UserId, x.ProductId });
                    table.ForeignKey(
                        name: "FK_Rates_Product_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Product",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Rates_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SubImages",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductId = table.Column<string>(nullable: true),
                    Image = table.Column<byte[]>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SubImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SubImages_Product_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Product",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Vouchers",
                columns: table => new
                {
                    VoucherId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(nullable: false),
                    StartDate = table.Column<DateTime>(nullable: false),
                    EndDate = table.Column<DateTime>(nullable: false),
                    Discount = table.Column<float>(nullable: false),
                    Code = table.Column<string>(nullable: false),
                    State = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vouchers", x => x.VoucherId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Order_CodeVoucher",
                table: "Order",
                column: "CodeVoucher");

            migrationBuilder.CreateIndex(
                name: "IX_Rates_ProductId",
                table: "Rates",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_SubImages_ProductId",
                table: "SubImages",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Vouchers_Code",
                table: "Vouchers",
                column: "Code",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Order_Vouchers_CodeVoucher",
                table: "Order",
                column: "CodeVoucher",
                principalTable: "Vouchers",
                principalColumn: "VoucherId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Order_Vouchers_CodeVoucher",
                table: "Order");

            migrationBuilder.DropTable(
                name: "Rates");

            migrationBuilder.DropTable(
                name: "SubImages");

            migrationBuilder.DropTable(
                name: "Vouchers");

            migrationBuilder.DropIndex(
                name: "IX_Order_CodeVoucher",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "CodeVoucher",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "State",
                table: "Comment");
        }
    }
}
