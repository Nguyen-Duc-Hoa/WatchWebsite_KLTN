using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WatchWebsite_TLCN.DTO
{
    // danh sach hien thi lich su mua hang trang nguoi dung
    public class ListOrderDTO
    {
        public int OrderId { get; set; }
        public int UserId { get; set; }
        public DateTime OrderDate { get; set; }
        public float Total { get; set; }
        public string Name { get; set; }
        public string DeliveryStatus { get; set; }
    }
}
