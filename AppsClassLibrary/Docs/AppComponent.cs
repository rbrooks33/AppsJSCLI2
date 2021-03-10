using System;
using System.Collections.Generic;
using System.Text;

namespace Brooksoft.Apps.Client.Docs
{
    public class AppComponent
    {
        public AppComponent()
        {
            Stories = new List<Story>(); //Populated using ComponentsStories lookup table
        }
        public int ID { get; set; }
        public int AppID { get; set; }
        public string AppComponentName { get; set; }
        public string AppComponentDescription { get; set; }
        public bool Archived { get; set; }
        public List<Story> Stories { get; set; }
    }
}
