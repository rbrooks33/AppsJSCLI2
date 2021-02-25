using System;
using System.Collections.Generic;
using System.Text;

namespace Brooksoft.Apps.Client.Tests
{
    public enum TestMessageStatus
    {
        Info,       //(info) side info 
        Warning,    //(warning) fail but not whole test
        Success,    //(primary) using Primary for blue for intermittent success, not passed 
        Failed,     //(danger) failed whole test
        Passed      //(success) passed whole test
    }
}
