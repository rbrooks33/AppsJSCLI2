using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Flows
{
    public class SoftwareFileCode
    {
        public int SoftwareFileCodeID { get; set; }
        public int SoftwareFileID { get; set; }
        public string Name { get; set; }
        public SoftwareFileCodeTypes CodeType { get; set; }
        public string Contents { get; set; }
        public Microsoft.CodeAnalysis.SyntaxTree Tree { get; set; }
    }
}
