using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WatchWebsite_TLCN.DTO
{
    public class Chart2DTO
    {
        public string Name { get; set; }
        public int Quantity { get; set; } //So lượng sản phẩm bán theo thời gian
        public float Value { get; set; } //Tong tien ban được
        public float Percent { get; set; } //% so với tổng số các sản phẩm trong cùng thời gian
        public float AveragePrice { get; set; }  //Giá trung bình = Value / Quantity

    }
}
