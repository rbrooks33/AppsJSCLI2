using AppsClient;
using AppsDesktop.Models;
using AppsJSCLI2.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace AppsDesktop.Controllers.CLI
{
    [Route("api/[controller]")]
    [ApiController]
    public class CLIController : ControllerBase
    {
        IHubContext<AppsHub> _hubContext;
        public CLIController(IHubContext<AppsHub> hubContext)
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
        public AppsResult AddComponent(Component component)
        {
            var result = new AppsResult();
            try
            {
                if (Config.IsValid)
                {
                    M("Loading existing components from config...", ref result);
                    
                    var components = Config.LoadComponentsConfig();

                    M("Got " + components.Components.Count().ToString() + " components from config. Adding component.", ref result);

                    components.Components.Add(component);

                    M("Added component " + component.Name, ref result);

                    Config.SaveComponentsConfig(components);

                    M("Saved to config. Refreshing component on disk.", ref result);

                    RefreshComponents(ref result);

                    result.Success = true;
                }
                else
                    M("Config was not valid for AddComponent.", ref result);
            }
            catch (System.Exception ex)
            {
                M("Exception for AddComponent: " + ex.Message + ". Stack: " + ex.StackTrace, ref result);
                //result.Data = ex;
            }
            return result;
        }

        private void M(string message, ref AppsResult result)
        {
            result.Messages.Add(message);
        }

        [HttpPost]
        [Route("DeleteComponent")]
        public AppsResult DeleteComponent(Component component)
        {
            var result = new AppsResult();
            try
            {
                if (Config.IsValid)
                {
                    M("Config is valid, loading components from config...", ref result);
                    var components = Config.LoadComponentsConfig();

                    M("Got components (" + components.Components.Count().ToString() + "). Removing component from config:" + component.Name, ref result);
                    components.Components.RemoveAll(c => c.Name == component.Name);

                    M("Removed components. New component count is " + components.Components.Count().ToString() + ". Saving components...", ref result);
                    Config.SaveComponentsConfig(components);

                    M("Component removed from config. Removing from disk...", ref result);
                    string componentFolderPath = Config.CurrentConfig.BaseComponentsFolder + "\\" + component.Name;

                    M("Got full component path: " + componentFolderPath + ". Checking if folder exists...", ref result);
                    bool folderExists = Directory.Exists(componentFolderPath);
                    if (folderExists)
                    {
                        M("Folder exists. Deleting...", ref result);
                        Directory.Delete(componentFolderPath, true);

                        M("Component folder deleted.", ref result);
                    }
                    else
                        M("Component folder was not on disk.", ref result);

                    result.Success = true;
                }
                else
                    M("Config was not valid (DeleteComponent).", ref result);
            }
            catch (System.Exception ex)
            {
                M("Exception in DeleteComponent: " + ex.Message + ". Stack: " + ex.StackTrace, ref result);
                //result.Data = ex;
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
        public void RefreshComponents(ref AppsResult result)
        {
            try
            {
                M("Getting current config...", ref result);
                var config = Config.CurrentConfig;

                M("Loading components from config...", ref result);
                var components = Config.LoadComponentsConfig().Components;

                M("Loading base component folder...", ref result);
                var componentFolder = new DirectoryInfo(config.BaseComponentsFolder);

                M("Got base component folder " + componentFolder.FullName + ". Getting templates folder...", ref result);
                //var templateFolder = new DirectoryInfo(config.BaseTemplatesFolder);

               // M("Got base template folder " + templateFolder.FullName + ". Creating components as needed...", ref result);
                //CreateComponents(components, componentFolder, templateFolder, ref result);

                //result.Success = true;
            }
            catch (System.Exception ex)
            {
                M("Exception creating component: " + ex.Message + ". Stack: " + ex.StackTrace, ref result);
                //result.Data = ex;
            }
        }

        private void CreateComponents(List<Component> componentList, DirectoryInfo componentFolder, DirectoryInfo templateFolder, ref AppsResult result)
        {
            M("Getting current config...", ref result);
            var config = Config.CurrentConfig;

            M("Going through component list of " + componentList.Count().ToString(), ref result);
            foreach (Component c in componentList)
            {
                M("Checking if component folder alread exists...", ref result);
                if (Directory.Exists(c.ComponentFolder))
                {
                    M("Exists. ", ref result);
                    componentFolder = new DirectoryInfo(c.ComponentFolder);
                }
                M("Checking if main template folder exists...", ref result);
                if (Directory.Exists(c.TemplateFolder))
                {
                    M("Template folder exists.", ref result);
                    templateFolder = new DirectoryInfo(c.TemplateFolder);
                }
                M("Creating component...", ref result);
                CreateComponent(componentFolder.FullName + "\\" + c.Name, templateFolder.FullName, c.Name, ref result);

                M("Checking for sub-components...", ref result);
                if (c.Components.Count > 0)
                {
                    M("Sub-component found: " + c.Components.Count.ToString() + ". Getting sub component folder...", ref result);
                    string subComponentFolderPath = componentFolder.FullName + "\\" + c.Name + "\\Components";

                    M("Got folder: " + subComponentFolderPath + ". Checking if already exists...", ref result);
                    if (!Directory.Exists(subComponentFolderPath))
                    {
                        M("Doesn't exist, creating...", ref result);
                        Directory.CreateDirectory(subComponentFolderPath);
                    }
                    var subComponentFolder = new DirectoryInfo(subComponentFolderPath);

                    M("Calling myself (CreateComponents) for any deeper sub-components...", ref result);
                    CreateComponents(c.Components, subComponentFolder, templateFolder, ref result);
                }
            }
        }
        private void CreateComponent(string componentPath, string templatesPath, string componentName, ref AppsResult result)
        {
            M("Checking if component path exists...", ref result);
            if (!Directory.Exists(componentPath))
            {
                M("Didn't exist, creating...", ref result);
                Directory.CreateDirectory(componentPath);

                M("Creating all template files...", ref result);
                CreateComponentPage(templatesPath + "\\empty.js", componentPath + "\\" + componentName + ".js", componentName, ref result);
                CreateComponentPage(templatesPath + "\\empty.html", componentPath + "\\" + componentName + ".html", componentName,ref result);
                CreateComponentPage(templatesPath + "\\empty.css", componentPath + "\\" + componentName + ".css", componentName, ref result);
            }
            else
                M("Directory " + componentPath + " already exists. No need to create.", ref result);
        }
        private void CreateComponentPage(string templatePath, string componentPagePath, string componentName, ref AppsResult result)
        {
            M("Checking if file exists: " + componentPagePath, ref result);
            if (!System.IO.File.Exists(componentPagePath))
            {
                M("Exists. Correcting relative file paths...", ref result);
                string relativePath = componentPagePath.Replace(Config.CurrentConfig.BaseComponentsFolder, "");
                relativePath = relativePath.Replace("\\", "/"); //switch to html delimiters
                relativePath = relativePath.Replace(componentName + ".js", ""); //remove trailing file
                if(relativePath.Length > 5)
                    relativePath = relativePath.Substring(1, relativePath.Length - 2); //remove before and after slashes

                M("Reading contents...", ref result);
                string htmlText = System.IO.File.ReadAllText(templatePath);
                M("Replacing component name...", ref result);
                htmlText = htmlText.Replace("MyTemplate", componentName);
                M("Replacing file paths...", ref result);
                htmlText = htmlText.Replace("MyRelativePath", relativePath);
                M("Writing file...", ref result);
                System.IO.File.WriteAllText(componentPagePath, htmlText);
            }
            else
                M("Page " + componentPagePath + " already exists, no need to create.", ref result);
        }
    }
}
