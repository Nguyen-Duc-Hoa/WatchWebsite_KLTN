using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WatchWebsite_TLCN.Entities;

namespace WatchWebsite_TLCN.Intefaces
{
    public interface ICommentsRepository
    {
        Task<List<Comment>> GetAllComments(string productId);

        Task<List<Comment>> GetAllRepComments(int replyFrom);
    }
}
