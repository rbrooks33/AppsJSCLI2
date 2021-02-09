using AppsDesktop.Models.Configs;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;
using System.IO;

namespace AppsDesktop.Controllers.Overview
{
    public class SearchHelper
    {
        IHubContext<AppsHub> _hubContext;

        private FoundDirectories FoundDirectories { get; set; }
        public List<string> Messages { get; set; }

        public SearchHelper(IHubContext<AppsHub> hubContext)
        {
            _hubContext = hubContext;
            FoundDirectories = new FoundDirectories();
            Messages = new List<string>();
        }
        public FoundDirectories Find(string startingDir)
        {
            _hubContext.Clients.All.SendAsync("FoundAppsJSFolder", "Starting search...");

            DirSearch(startingDir);
            _hubContext.Clients.All.SendAsync("FoundAppsJSFolder", "Finished search...");
            return this.FoundDirectories;
        }
        private void DirSearch(string sDir)
        {
            try
            {
                //_hubContext.Clients.All.SendAsync("FoundAppsJSFolder", "Searching " + sDir);

                foreach (string d in Directory.GetDirectories(sDir))
                {
                    if (new DirectoryInfo(d).Name == "Scripts")
                    {
                        foreach (string subd in Directory.GetDirectories(sDir + "\\Scripts"))
                        {
                            if (new DirectoryInfo(subd).Name == "Apps")
                            {
                                _hubContext.Clients.All.SendAsync("FoundAppsJSFolder", "Found one!" + sDir);

                                FoundDirectories.Directories.Add(new FoundDirectory { Path = sDir });
                            }
                        }
                    }
                    //FileSearch(d, nodes, links, startIndex, startId, log, methodName);
                    DirSearch(d);
                }
            }
            catch (System.Exception excpt)
            {
                Messages.Add(excpt.Message);
            }
        }
        //public void FileSearch(string d, List<JsonDataNode> nodes, List<JsonLinkNode> links, int startIndex, int startId, List<string> log, string methodName)
        //{
        //    try
        //    {
        //        foreach (string f in Directory.GetFiles(d))
        //        {
        //            var fileInfo = new FileInfo(f);
        //            if (fileInfo.Extension == ".sln")
        //            {
        //                var objectNode = new JsonDataNode(startIndex, startId, type.FullName, type.Name, 3, 15, 15, 15, 15);
        //                nodes.Add(objectNode);

        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        log.Add("Problem doing a file search and parse of directory: " + d + ": " + ex.Message + ". Stack: " + ex.StackTrace);
        //    }
        //}

    }
}
