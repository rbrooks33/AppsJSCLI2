using System;
using System.Collections.Generic;
using System.Text;

namespace Brooksoft.Apps.Client.Docs
{
    public class Component
    {
        public Component()
        {
            Stories = new List<Story>(); //Populated using ComponentsStories lookup table
        }
        public int ID { get; set; }
        public string ComponentName { get; set; }
        public string ComponentDescription { get; set; }
        public List<Story> Stories { get; set; }
    }
}
