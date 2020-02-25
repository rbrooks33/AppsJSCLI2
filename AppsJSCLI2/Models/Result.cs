using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AppsJSCLI2.Models
{
    public class Result
    {
        public Result()
        {
            Messages = new List<string>();
        }
        public bool Success { get; set; }
        public List<string> Messages { get; set; }
        public object Data { get; set; }
    }
}
