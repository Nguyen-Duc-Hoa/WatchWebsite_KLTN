using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WatchWebsite_TLCN.Entities;
using WatchWebsite_TLCN.Intefaces;

namespace WatchWebsite_TLCN.Repository
{
    public class CommentsRepository : ICommentsRepository
    {
        private readonly MyDBContext _context;
        public CommentsRepository(MyDBContext context)
        {
            _context = context;
        }
        public async Task<List<Comment>> GetAllComments(string productId)
        {
            return await _context.Comments.Where(c => c.ProductId == productId).Include("User").ToListAsync();
        }

        public async Task<List<Comment>> GetAllRepComments(int replyFrom)
        {
            return await _context.Comments.Where(c => c.ReplyFrom == replyFrom).Include("User").ToListAsync();
        }
    }
}
