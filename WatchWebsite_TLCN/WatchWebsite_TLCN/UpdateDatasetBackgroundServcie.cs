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
                //call your function here
                using (HttpClient httpClient = new HttpClient())
                {
                    string domainName = "https://kltn-watchwebsite.herokuapp.com/";
                    await httpClient.GetAsync($"{domainName}/api/products/sendProductUser");
                }

                await Task.Delay(refreshTimeMs, stoppingToken);
            }
        }
    }
}
