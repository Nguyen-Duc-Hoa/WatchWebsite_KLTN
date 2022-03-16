
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WatchWebsite_TLCN.Entities
{
    [Table("User")]
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public string Email { get; set; }

        public string Name { get; set; } 

        public string Address { get; set; }

        public bool State { get; set; } = false;

        [Required]
        public string Phone { get; set; }

        public string Birthday { get; set; }

        public byte[] Avatar { get; set; }

        public virtual ICollection<Comment> Comments { get; set; }

        //public virtual ICollection<ReplyComment> ReplyComments { get; set; }

        public virtual ICollection<Cart> Carts { get; set; }

        public virtual ICollection<User_Role> UserRole { get; set; }
    }
}
