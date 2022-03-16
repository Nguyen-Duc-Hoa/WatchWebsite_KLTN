using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WatchWebsite_TLCN.DTO;
using WatchWebsite_TLCN.Entities;
using WatchWebsite_TLCN.Intefaces;
using WatchWebsite_TLCN.IRepository;
using WatchWebsite_TLCN.Models;

namespace WatchWebsite_TLCN.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICommentsRepository _comments;
        private readonly IMapper _mapper;
        public CommentsController(IUnitOfWork unitOfWork, ICommentsRepository comments, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _comments = comments;
            _mapper = mapper;
        }

        [HttpGet]
        [Route("GetCommentsWithPagination")]
        public async Task<IActionResult> GetCommentsWithPagination(int currentPage)
        {
            var result = await _unitOfWork.Comments.GetAllWithPagination(
                expression: null,
                includes: new List<string> { "User", "Product"},
                orderBy: x => x.OrderBy(a => a.ProductId),
                pagination: new Pagination { CurrentPage = currentPage });
            return Ok(new
            {
                Comments = result.Item1,
                CurrentPage = result.Item2.CurrentPage,
                TotalPage = result.Item2.TotalPage
            });
        }

        // GET: api/Comments
        [HttpGet]
        public async Task<IEnumerable<CommentDTO>> GetComments(string productId)
        {
            List<Comment> result = await _comments.GetAllComments(productId);
            var commentList = _mapper.Map<List<CommentDTO>>(result);
            return commentList.Where(c => c.ReplyFrom == null).ToList();
        }

        // POST: api/Comments/AddComment
        [Authorize]
        [Route("AddComment")]
        [HttpPost]
        public async Task<IActionResult> AddComment(Comment comment)
        {
            try
            {
                comment.Date = DateTime.Now.AddHours(15); // cộng thêm giờ => giờ VN
                await _unitOfWork.Comments.Insert(comment);
                await _unitOfWork.Save();
                return RedirectToAction(nameof(GetComments), new { productId = comment.ProductId });
            }
            catch
            {
                return StatusCode(500);
            }
        }


        //reply comment
        [Route("ReplyComment")]
        [HttpPost]
        public async Task<IActionResult> Reply(int commentid, Comment comment)
        {
            var userComment = await _unitOfWork.Comments.Get(x => x.Id == commentid);
            if(userComment != null)
            {
                int? ReplyFrom = userComment.ReplyFrom;
                if(ReplyFrom == null)
                {
                    comment.ReplyFrom = userComment.Id;
                }
                else
                {
                    comment.ReplyFrom = userComment.ReplyFrom;
                }

                try
                {
                    await _unitOfWork.Comments.Insert(comment);
                    await _unitOfWork.Save();
                    return RedirectToAction(nameof(GetComments), new { productId = comment.ProductId });
                }
                catch
                {
                    return StatusCode(500);
                }
            }

            return StatusCode(500);

        }

        [Authorize(Roles = "Admin,Employee")]
        [Route("Delete")]
        [HttpDelete]
        public async Task<ActionResult<Comment>> DeleteComment(List<int> keys)
        {
            List<int> childKeys = new List<int>();
            try
            {
                foreach (var id in keys.ToList())
                {
                    if(childKeys.Any(childKey => childKey == id))
                    {
                        continue;
                    }
                    var comment = await _unitOfWork.Comments.Get(b => b.Id == id);
                    if (comment == null)
                    {
                        return NotFound();
                    }
                    else
                    {
                        if (comment.ReplyFrom == null)
                        {
                            // Comment cha
                            // Xoa tat ca cac comment con
                            List<Comment> repComment = await _comments.GetAllRepComments(id);

                            // If child comment exists in keys, remove it from keys
                            foreach (var item in repComment)
                            {
                                if (keys.Any(key => key == item.Id))
                                {
                                    childKeys.Add(item.Id);
                                }
                            }

                            if (repComment != null)
                            {
                                foreach (Comment item in repComment)
                                {
                                    await _unitOfWork.Comments.Delete(item.Id);
                                    await _unitOfWork.Save();
                                }
                            }
                        }
                    }
                    await _unitOfWork.Comments.Delete(id);
                    await _unitOfWork.Save();
                }

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500);
            }
        }

        private Task<bool> CommentExists(int id)
        {
            return _unitOfWork.Comments.IsExist<int>(id);
        }
    }
}
