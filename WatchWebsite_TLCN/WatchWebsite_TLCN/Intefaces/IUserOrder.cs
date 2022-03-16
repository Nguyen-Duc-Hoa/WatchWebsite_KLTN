using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WatchWebsite_TLCN.DTO;
using WatchWebsite_TLCN.Entities;

namespace WatchWebsite_TLCN.Intefaces
{
    public interface IUserOrder
    {
        IEnumerable<Order> GetByUser(int userid);
        IEnumerable<OrderDetailDTO> GetOrderDetails(int orderid);
        Order UpdateStatus(int orderid);
    }
}
