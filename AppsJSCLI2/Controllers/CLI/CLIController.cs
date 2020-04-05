using AppsJSCLI2.Controllers.Overview;
using AppsJSCLI2.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace AppsJSCLI2.Controllers.CLI
{
    [Route("api/[controller]")]
    [ApiController]
    public class CLIController : ControllerBase
    {
        IHubContext<DesktopHub> _hubContext;
        public CLIController(IHubContext<DesktopHub> hubContext)
        {
            _hubContext = hubContext;
        }

        /// <summary>
        /// Add a component to the current view (current config)
        /// SMELL: Assumes user has selected a project to view
        /// </summary>
        /// <param name="componentResult"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("AddComponent")]
        public Result AddComponent(Component component)
        {
            var result = new Result();
            try
            {
                if (Config.IsValid)
                {
                    var components = Config.LoadComponentsConfig();
                    components.Components.Add(component);
                    Config.SaveComponentsConfig(components);

                    result = RefreshComponents();
                }
                else
                    result.Messages.Add("Config was not valid for AddComponent.");
            }
            catch (Exception ex)
            {
                result.Data = ex;
            }
            return result;
        }
        [HttpPost]
        [Route("DeleteComponent")]
        public Result DeleteComponent(Component component)
        {
            var result = new Result();
            try
            {
                if (Config.IsValid)
                {
                    result.Messages.Add("Config is valid, starting delete for '" + component.Name + "'...");
                    
                    //Load components from config
                    var components = Config.LoadComponentsConfig();
                    
                    //Remove from config
                    components.Components.RemoveAll(c => c.Name == component.Name);
                    Config.SaveComponentsConfig(components);

                    result.Messages.Add("Component removed from config.");

                    //Remove from disk
                    string componentFolderPath = Config.CurrentConfig.BaseComponentsFolder + "\\" + component.Name;

                    bool folderExists = Directory.Exists(componentFolderPath);
                    if (folderExists)
                    {
                        Directory.Delete(componentFolderPath, true);
                        result.Messages.Add("Component folder existed on disk and was deleted.");
                    }
                    else
                        result.Messages.Add("Component folder was not on disk.");

                    result.Success = true;
                }
                else
                    result.Messages.Add("Config was not valid (DeleteComponent).");
            }
            catch (Exception ex)
            {
                result.Data = ex;
            }
            return result;
        }
        [HttpGet]
        [Route("RefreshAllComponents")]
        public Result RefreshAllComponents()
        {
            var result = new Result();
            try
            {
                if (Config.IsValid)
                {
                    result = RefreshComponents();
                    result.Success = true;
                }
                else
                    result.Messages.Add("Config was not valid for Refresh All Components.");
            }
            catch (Exception ex)
            {
                result.Data = ex;
            }
            return result;
        }

        /// <summary>
        /// Makes sure all config components are created on disk
        /// </summary>
        /// <returns></returns>
        public Result RefreshComponents()
        {
            var result = new Result();
            try
            {
                var config = Config.CurrentConfig;
                var components = Config.LoadComponentsConfig().Components;
                var componentFolder = new DirectoryInfo(config.BaseComponentsFolder);
                var templateFolder = new DirectoryInfo(config.BaseTemplatesFolder);

                CreateComponents(components, componentFolder, templateFolder, ref result);

                result.Success = true;
            }
            catch (Exception ex)
            {
                result.Data = ex;
            }
            return result;
        }

        private void CreateComponents(List<Component> componentList, DirectoryInfo componentFolder, DirectoryInfo templateFolder, ref Result result)
        {
            var config = Config.CurrentConfig;

            foreach (Component c in componentList)
            {
                if (Directory.Exists(c.ComponentFolder))
                    componentFolder = new DirectoryInfo(c.ComponentFolder);

                if (Directory.Exists(c.TemplateFolder))
                    templateFolder = new DirectoryInfo(c.TemplateFolder);

                CreateComponent(componentFolder.FullName + "\\" + c.Name, templateFolder.FullName, c.Name, ref result);

                if (c.Components.Count > 0)
                {
                    string subComponentFolderPath = componentFolder.FullName + "\\" + c.Name + "\\Components";

                    if (!Directory.Exists(subComponentFolderPath))
                        Directory.CreateDirectory(subComponentFolderPath);

                    var subComponentFolder = new DirectoryInfo(subComponentFolderPath);

                    CreateComponents(c.Components, subComponentFolder, templateFolder, ref result);
                }
            }
        }
        private void CreateComponent(string componentPath, string templatesPath, string componentName, ref Result result)
        {
            if (!Directory.Exists(componentPath))
            {
                Directory.CreateDirectory(componentPath);

                CreateComponentPage(templatesPath + "\\empty.js", componentPath + "\\" + componentName + ".js", componentName, ref result);
                CreateComponentPage(templatesPath + "\\empty.html", componentPath + "\\" + componentName + ".html", componentName,ref result);
                CreateComponentPage(templatesPath + "\\empty.css", componentPath + "\\" + componentName + ".css", componentName, ref result);
            }
            else
                result.Messages.Add("Directory " + componentPath + " already exists. No need to create.");
        }
        private void CreateComponentPage(string templatePath, string componentPagePath, string componentName, ref Result result)
        {
            if (!System.IO.File.Exists(componentPagePath))
            {
                string relativePath = componentPagePath.Replace(Config.CurrentConfig.BaseComponentsFolder, "");
                relativePath = relativePath.Replace("\\", "/"); //switch to html delimiters
                relativePath = relativePath.Replace(componentName + ".js", ""); //remove trailing file
                if(relativePath.Length > 5)
                    relativePath = relativePath.Substring(1, relativePath.Length - 2); //remove before and after slashes

                string htmlText = System.IO.File.ReadAllText(templatePath);
                htmlText = htmlText.Replace("MyTemplate", componentName);
                htmlText = htmlText.Replace("MyRelativePath", relativePath);

                System.IO.File.WriteAllText(componentPagePath, htmlText);
            }
            else
                result.Messages.Add("Page " + componentPagePath + " already exists, no need to create.");
        }
    }
}
