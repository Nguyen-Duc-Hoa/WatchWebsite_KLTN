using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WatchWebsite_TLCN.Entities;

namespace WatchWebsite_TLCN.DTO
{
    public class CommentDTO
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string ProductId { get; set; }
        public string Content { get; set; }
        public DateTime Date { get; set; }
        public int? ReplyFrom { get; set; }
        public virtual ICollection<CommentDTO> Replies { get; set; }
        public UserCommentDTO User { get; set; }
    }
    public class UserCommentDTO
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Avatar { get; set; }
    }
}


