using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Flows
{
    public class TestScenario
    {
        [Key]
        public int TestScenarioID { get; set; }
        public int TestPlanID { get; set; }
        public string Scenario { get; set; }
    }
}
