using Microsoft.EntityFrameworkCore.Migrations;

namespace WatchWebsite_TLCN.Migrations
{
    public partial class codeVoucherNullableInOrder : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Order_Vouchers_CodeVoucher",
                table: "Order");

            migrationBuilder.AlterColumn<int>(
                name: "CodeVoucher",
                table: "Order",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Order_Vouchers_CodeVoucher",
                table: "Order",
                column: "CodeVoucher",
                principalTable: "Vouchers",
                principalColumn: "VoucherId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Order_Vouchers_CodeVoucher",
                table: "Order");

            migrationBuilder.AlterColumn<int>(
                name: "CodeVoucher",
                table: "Order",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Order_Vouchers_CodeVoucher",
                table: "Order",
                column: "CodeVoucher",
                principalTable: "Vouchers",
                principalColumn: "VoucherId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
