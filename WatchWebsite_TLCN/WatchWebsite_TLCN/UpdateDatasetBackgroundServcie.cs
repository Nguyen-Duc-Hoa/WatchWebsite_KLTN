using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace WatchWebsite_TLCN
{
    public class UpdateDatasetBackgroundServcie : BackgroundService
    {
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            int refreshTimeMs = 86400000; //24 hour
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    //call your function here
                    using (HttpClient httpclient = new HttpClient())
                    {
                        string domainname = "https://kltn-watchwebsite.herokuapp.com/";
                        await httpclient.GetAsync($"{domainname}/api/products/sendproductuser");
                    }


                    await Task.Delay(refreshTimeMs, stoppingToken);
                }
                catch(Exception ex)
                {
                    Console.WriteLine(ex);
                }
                
            }
        }

        

    }
}
