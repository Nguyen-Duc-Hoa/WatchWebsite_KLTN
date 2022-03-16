using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WatchWebsite_TLCN.Utilities
{
    // Declare constant variables in this class
    public static class Constant
    {
        public const string bestSelling = "Best Selling";
        public const string priceDesending = "Price, high to low";
        public const string priceAscending = "Price, low to high";
        public const string alphabetically = "Alphabetically, A-Z";
        public const string nonAlphabetically = "Alphabetically, Z-A";

        public static readonly string[] status = { "Waiting", "Confirmed", "Delivering", "Completed", "Canceled" };

        public const string adminRole = "Admin";
        public const string employeeRole = "Employee";
        public const string customerRole = "Customer";

        public static readonly string[] typeComment = { "Main", "Rep" };
    }
}
