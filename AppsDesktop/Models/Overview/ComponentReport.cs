using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AppsDesktop.Models
{
    public class ComponentReport
    {
        public ComponentReport()
        {
            Components = new List<Component>();
        }
        public List<Component> Components { get; set; }
        public void DiskTest(string configComponentsFolder)
        {
            foreach (Component c in Components)
            {
                DiskTest(c, configComponentsFolder);
            }
        }
        public static bool DiskTest(Component c, string configComponentsFolder)
        {
            bool result = false;
            bool folderExists = System.IO.Directory.Exists(configComponentsFolder + "\\" + c.Name);
            bool jsExists = System.IO.File.Exists(configComponentsFolder + "\\" + c.Name + "\\" + c.Name + ".js");
            bool htmlExists = System.IO.File.Exists(configComponentsFolder + "\\" + c.Name + "\\" + c.Name + ".html");
            bool csExists = System.IO.File.Exists(configComponentsFolder + "\\" + c.Name + "\\" + c.Name + ".css");

            if (folderExists && jsExists && htmlExists && csExists)
                result = true;

            c.IsOnDisk = result;
            return result;
        }
    }
    public class Component
    {
        //Mystery: Looks like the JSON serializer uses this ctor and passes
        //in the params...wha??
        public Component(string name, string description)
        {
            Components = new List<Component>();
            Name = name;
            Description = description;
            Load = true;
            Initialize = true;
            Color = "blue";
            ModuleType = "require";
            Framework = "default";

            //Mystery: It looks like internal stuff like this doesn't work
            //during serialization either
            //IsOnDisk = DiskTest(Config.CurrentConfig.BaseComponentsFolder);
        }
        public string Name { get; set; }
        public string Version { get; set; }
        public string  Description { get; set; }
        public string ComponentFolder { get; set; }
        public string TemplateFolder { get; set; }
        public bool Load { get; set; }
        public bool Initialize { get; set; }
        public string Color { get; set; }
        public string ModuleType { get; set; }
        public string Framework { get; set; }
        public List<Component> Components { get; set; }
        public bool IsOnDisk { get; set; }
    }
}
