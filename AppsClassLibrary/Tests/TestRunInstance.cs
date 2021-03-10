using Brooksoft.Apps.Client.Tests;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Flows
{
    public class TestRunInstance
    {
        public TestRunInstance()
        {
            DateCreated = DateTime.Now;
        }
        [Key]
        public int ID { get; set; }
        public int UniqueID { get; set; }
        public TestRunInstanceType Type { get; set; }
        public DateTime DateCreated { get; set; }
    }
}