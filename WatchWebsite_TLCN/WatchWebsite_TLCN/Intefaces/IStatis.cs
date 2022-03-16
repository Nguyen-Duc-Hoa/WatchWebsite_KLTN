using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WatchWebsite_TLCN.DTO;
using WatchWebsite_TLCN.Models;

namespace WatchWebsite_TLCN.Intefaces
{
    public interface IStatis
    {
        IEnumerable<Chart1DTO> Statis1ByDate(Statis statis);
        IEnumerable<Chart1DTO> Statis1ByMonth(Statis statis);
        IEnumerable<Chart1DTO> Statis1ByYear(Statis statis);

        IEnumerable<Chart2DTO> Statis2ByMonth(Statis statis);
        IEnumerable<Chart2DTO> Statis2ByYear(Statis statis);

    }
}
