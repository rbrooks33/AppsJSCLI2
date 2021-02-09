using AppsClient;
using AppsJSCLI2.Models;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using RouteAttribute = Microsoft.AspNetCore.Mvc.RouteAttribute;

namespace AppsDesktop.Controllers.Templates
{
    public class TemplatesController : Controller
    {
        [HttpGet]
        [Route("api/{controller}/GetSearchParams")]
        public AppsResult GetSearchParams()
        {
            var result = new AppsResult();
            try
            {
                result.Data = new SearchParams();
                result.Success = true;
            }
            catch(System.Exception ex)
            {
                result.FailMessages.Add("Components map exception: " + ex.Message);
            }
            return result;
        }
        
        [HttpGet]
        [Route("api/{controller}/Create")]
        public AppsResult Create()
        {
            var result = new AppsResult();
            try
            {
                string sourceFolder = @"D:\Work\Brooksoft\AppsJS\AppsJSCLI2\AppsJSCLI2\Templates\TemplateSources\SPA\Default\SelfHosted\DefaultSelfHosted\DefaultSelfHosted";
                string destinationFolder = @"D:\Work\Brooksoft\AppsJS\AppsJSCLI2\AppsJSCLI2\Templates\TemplateDestinations\SPA\Default\SelfHosted\DefaultSelfHosted\DefaultSelfHosted";
                string portNumber = "45678";

                var searchParams = new SearchParams();

                var searchPortNumbers = new SearchReplace()
                {
                    SearchWord = "https://localhost:44326/index.html",
                    SearchFileName = "Program.cs",
                    ReplaceWord = "https://localhost:" + portNumber + "/index.html"
                };

                searchParams.SearchReplaces = new List<SearchReplace>() { searchPortNumbers };

                var components = new List<ComponentTemplate>();
                components.Add(new ComponentTemplate() { 
                    ComponentName = "Level1_1",
                    Components = new List<ComponentTemplate>()
                    {
                        new ComponentTemplate()
                        {
                            ComponentName = "Level2_1",
                            Components = new List<ComponentTemplate>()
                        },
                        new ComponentTemplate()
                        {
                            ComponentName = "Level2_2",
                            Components = new List<ComponentTemplate>()
                            {
                                new ComponentTemplate()
                                {
                                    ComponentName = "Level3_1",
                                    Components = new List<ComponentTemplate>()
                                }
                            }
                        }
                    }
                });
                components.Add(new ComponentTemplate()
                {
                    ComponentName = "Level1_2",
                    Components = new List<ComponentTemplate>()
                });
                searchParams.ComponentTemplates = components;
                
                
                if(Directory.Exists(destinationFolder))
                {
                    Directory.Delete(destinationFolder, true);
                }

                if(Directory.Exists(destinationFolder))
                    Directory.Delete(destinationFolder, true);

                DirectoryCopy(sourceFolder, destinationFolder, true, searchParams, ref result);

                DirectorySearch(destinationFolder, true, searchParams, ref result);

                result.Success = true;
            }
            catch (System.Exception ex)
            {
                result.FailMessages.Add("Test exception: " + ex.Message);
            }

            return result;
        }
        public class SearchParams
        {
            public SearchParams()
            {
                SearchReplaces = new List<SearchReplace>();
                ComponentTemplates = new List<ComponentTemplate>();
            }
            public List<SearchReplace> SearchReplaces;
            public List<ComponentTemplate> ComponentTemplates;
        }
        public class SearchReplace
        {
            public string SearchFileName;
            public string SearchWord;
            public string ReplaceWord;
        }
        public class ComponentTemplate
        {
            public string ComponentName;
            public List<ComponentTemplate> Components;
        }
        private static void DirectoryCopy(string sourceDirName, string destDirName, bool copySubDirs, SearchParams searchParams, ref AppsResult result)
        {
            // Get the subdirectories for the specified directory.
            DirectoryInfo dir = new DirectoryInfo(sourceDirName);
            //DirectoryInfo destDir = new DirectoryInfo(destDirName);

            if (!dir.Exists)
            {
                throw new DirectoryNotFoundException(
                    "Source directory does not exist or could not be found: "
                    + sourceDirName);
            }

            DirectoryInfo[] dirs = dir.GetDirectories();
            //DirectoryInfo[] destDirs = destDir.GetDirectories();

            //recreate destination directory
            Directory.CreateDirectory(destDirName);

            // Get the files in the directory and copy them to the new location.
            FileInfo[] files = dir.GetFiles();
            foreach (FileInfo file in files)
            {
                string tempPath = Path.Combine(destDirName, file.Name);
                file.CopyTo(tempPath, false);

                //Search/replace words
                var words = searchParams.SearchReplaces.Where(sw => sw.SearchFileName == file.Name);
                if (words.Count() == 1)
                {
                    string searchWord = words.Single().SearchWord;
                    string replaceWord = words.Single().ReplaceWord;
                    string tempPathContent = System.IO.File.ReadAllText(tempPath);
                    string newContent = tempPathContent.Replace(searchWord, replaceWord);
                    System.IO.File.WriteAllText(tempPath, newContent);

                    result.SuccessMessages.Add("Replaced " + searchWord + " in file " + file.Name);
                }
                else if (words.Count() > 1)
                    result.FailMessages.Add("More than one search files matched the current file " + file.Name);
            }

            // If copying subdirectories, copy them and their contents to new location.
            if (copySubDirs)
            {
                foreach (DirectoryInfo subdir in dirs)
                {
                    string tempPath = Path.Combine(destDirName, subdir.Name);
                    DirectoryCopy(subdir.FullName, tempPath, copySubDirs, searchParams, ref result);
                }
            }
        }
        private static void DirectorySearch(string destDirName, bool copySubDirs, SearchParams searchParams, ref AppsResult result)
        {
            DirectoryInfo destDir = new DirectoryInfo(destDirName);
            DirectoryInfo[] destDirs = destDir.GetDirectories();

            //Create AppsJS Components
            if (destDir.FullName.IndexOf("wwwroot\\Scripts\\Apps\\Components") > -1)
            {
                foreach (var component1 in searchParams.ComponentTemplates)
                {
                    var di1 = destDir.CreateSubdirectory(component1.ComponentName);

                    foreach (var component2 in component1.Components)
                    {
                        var di2 = di1.CreateSubdirectory(component2.ComponentName);

                        foreach(var component3 in component2.Components)
                        {
                            var di3 = di2.CreateSubdirectory(component3.ComponentName);
                        }
                    }
                }
            }

            // If copying subdirectories, copy them and their contents to new location.
            if (copySubDirs)
            {
                foreach (DirectoryInfo subdir in destDirs)
                {
                    string tempPath = Path.Combine(destDirName, subdir.Name);
                    DirectorySearch(tempPath, copySubDirs, searchParams, ref result);
                }
            }
        }
    }
}
