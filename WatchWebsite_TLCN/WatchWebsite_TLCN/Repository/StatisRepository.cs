using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WatchWebsite_TLCN.DTO;
using WatchWebsite_TLCN.Entities;
using WatchWebsite_TLCN.Intefaces;
using WatchWebsite_TLCN.Models;
using WatchWebsite_TLCN.Utilities;

namespace WatchWebsite_TLCN.Repository
{
    public class StatisRepository : IStatis
    {

        private readonly MyDBContext _context;
        public StatisRepository(MyDBContext context)
        {
            _context = context;
        }

        //Flag = 1
        public IEnumerable<Chart1DTO> Statis1ByDate(Statis statis)
        {

            var list = (from order in _context.Orders
                        where order.OrderDate >= statis.date[0].Date && order.OrderDate <= statis.date[1].Date           
                        group order by order.OrderDate.Date into g
                        orderby g.Key ascending
                        select new Chart1DTO
                        {
                            Time = g.Key.ToString("dd-MM-yyyy"),
                            TurnOver = g.Sum(x=> x.Total)
                        }).ToList();
            return list;
        }

        public IEnumerable<Chart1DTO> Statis1ByMonth(Statis statis)
        {
            //get firstDay and lastDay of Month
            DateTime date0 = firstDayOfMonth(statis.date[0]);
            DateTime date1 = lastDayOfMonth(statis.date[1]);


            var list = (from order in _context.Orders
                        where order.OrderDate >= date0 && order.OrderDate <= date1
                        orderby order.OrderDate ascending
                        group order by new { month = order.OrderDate.Month, year = order.OrderDate.Year } into g
                        select new Chart1DTO
                        {
                            Time = string.Format("{0}/{1}", g.Key.month, g.Key.year),
                            TurnOver = g.Sum(x => x.Total)
                        }).ToList();
            
            return list;
        }

        public IEnumerable<Chart1DTO> Statis1ByYear(Statis statis)
        {
            var list = (from order in _context.Orders
                        where order.OrderDate.Year >= statis.date[0].Year && order.OrderDate.Year <= statis.date[1].Year
                        group order by order.OrderDate.Year into g
                        orderby g.Key ascending
                        select new Chart1DTO
                        {
                            Time = g.Key.ToString(),
                            TurnOver = g.Sum(x => x.Total)
                        }).ToList();
            return list;
        }


        public IEnumerable<Chart2DTO> Statis2ByMonth(Statis statis)
        {
            float Total = 0;

            var list = (from x in (from o in _context.Orders
                                   join d in _context.OrderDetails on o.OrderId equals d.OrderId
                                   join p in _context.Products on d.ProductId equals p.Id
                                   where o.OrderDate.Month == statis.date[0].Month && o.OrderDate.Year == statis.date[0].Year
                                   select new
                                   {
                                       name = p.Name,
                                       count = d.Count,
                                       price = d.Price,
                                   })
                        group x by new { x.name } into g
                        orderby g.Sum(x => x.price) ascending
                        select new Chart2DTO
                        {
                            Name = g.Key.name,
                            Quantity = g.Sum(count => count.count),
                            Value = g.Sum(g => g.price),
                            AveragePrice = (float)(g.Sum(g => g.price) / Convert.ToDouble(g.Sum(count => count.count)))

                        }).ToList();

            //Tính tổng tiền bán được theo mốc thời gian để tính % && gop cac san pham con laij thanh 1
            if (list != null)
            {
                int i = 0;
                Chart2DTO newItem = new Chart2DTO();
                
                foreach (var item in list)
                {
                    Total += item.Value;
                    
                    //Lay 5 san pham dau
                    if( i > 5)
                    {
                        newItem.Name = "Others product";
                        newItem.Quantity += item.Quantity;
                        newItem.Value += item.Value;
                        newItem.AveragePrice = (float)(newItem.Value / Convert.ToDouble(newItem.Quantity));

                        list.Remove(item);
                    }
                }

                if(newItem.Name != null)
                    list.Add(newItem);

                foreach (var item in list)
                {
                    item.Percent = (float)Math.Round(item.Value / Total * 100, 2);
                }
            }

            return list;
        }

        public IEnumerable<Chart2DTO> Statis2ByYear(Statis statis)
        {
            float Total = 0;

            var list = (from x in (from o in _context.Orders
                                   join d in _context.OrderDetails on o.OrderId equals d.OrderId
                                   join p in _context.Products on d.ProductId equals p.Id
                                   where o.OrderDate.Year == statis.date[0].Year 
                                   select new
                                   {
                                       name = p.Name,
                                       count = d.Count,
                                       price = d.Price,
                                   })
                        group x by new { x.name } into g
                        orderby g.Sum(x => x.price) ascending
                        select new Chart2DTO
                        {
                            Name = g.Key.name,
                            Quantity = g.Sum(count => count.count),
                            Value = g.Sum(g => g.price),
                            AveragePrice = (float)(g.Sum(g => g.price) / Convert.ToDouble(g.Sum(count => count.count)))
                        }).ToList();

            //Tính tổng tiền bán được theo mốc thời gian để tính % && gop cac san pham con laij thanh 1
            if (list != null)
            {
                int i = 0;
                Chart2DTO newItem = new Chart2DTO();

                foreach (var item in list)
                {
                    Total += item.Value;

                    //Lay 5 san pham dau
                    if (i > 5)
                    {
                        newItem.Name = "Others product";
                        newItem.Quantity += item.Quantity;
                        newItem.Value += item.Value;
                        newItem.AveragePrice = (float)(newItem.Value / Convert.ToDouble(newItem.Quantity));

                        list.Remove(item);
                    }
                }

                if (newItem.Name != null)
                    list.Add(newItem);

                foreach (var item in list)
                {
                    item.Percent = (float)Math.Round(item.Value / Total * 100, 2);
                }
            }

            return list;
        }

        public DateTime firstDayOfMonth(DateTime date)
        {
            DateTime firstDay;
            firstDay = new DateTime(date.Year, date.Month, 1);
            return firstDay;
        }

        public DateTime lastDayOfMonth(DateTime date)
        {
            DateTime lastDay = firstDayOfMonth(date).AddMonths(1).AddDays(-1);
            return lastDay;
        }

    }
}
