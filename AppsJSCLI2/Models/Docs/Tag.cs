using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace AppsJSDev.Models.Docs
{
    public class Tag
    {
        [Key]
        public int TagID { get; set; }
        public string Name { get; set; }
    }
}
