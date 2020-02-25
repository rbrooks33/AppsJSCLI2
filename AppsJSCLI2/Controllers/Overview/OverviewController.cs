using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AppsJSCLI2.Models;
using AppsJSCLI2.Models.Configs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;

namespace AppsJSCLI2.Controllers.Overview
{
    [Route("api/[controller]")]
    [ApiController]
    public class OverviewController : ControllerBase
    {
        IHubContext<DesktopHub> _hubContext;
        public OverviewController(IHubContext<DesktopHub> hubContext)
        {
            _hubContext = hubContext;
        }

        [HttpGet]
        [Route("GetFoundDirectories")]
        public Result GetFoundDirectories()
        {
            var result = new Result();
            try
            {
                
                Config.LoadFoundDirectoriesConfig(ref result);
                result.Success = true;
            }
            catch (Exception ex)
            {
                result.Data = ex;
            }
            return result;
        }

        [HttpGet]
        [Route("ArchiveFoundDirectory")]
        public Result ArchiveFoundDirectory(string path)
        {
            var result = new Result();
            try
            {
                Config.LoadFoundDirectoriesConfig(ref result);
                var foundDirs = (FoundDirectories)result.Data;
                foundDirs.Directories.Where(fd => fd.Path == path).Single().Archived = true;
                Config.SaveFoundDirectoriesConfig(foundDirs);

                result.Success = true;
            }
            catch (Exception ex)
            {
                result.Data = ex;
            }
            return result;
        }

        [HttpGet]
        [Route("SearchCDrive")]
        public Result SearchCDrive()
        {
            var result = new Result();
            try
            {
                //_hubContext.Clients.All.SendAsync("SendMessage", "hiya!"); 

                var search = new SearchHelper(_hubContext);
                var foundDirectories = search.Find("c:\\");
                Config.SaveFoundDirectoriesConfig(foundDirectories);

                result.Success = true;
            }
            catch (Exception ex)
            {
                result.Data = ex;
            }
            return result;
        }

        //[HttpGet]
        //[Route("GetOpened")]
        //public Result GetOpened()
        //{
        //    var result = new Result();
        //    try
        //    {
        //        result.Data = ConfigHelper.LoadConfig().BaseWebRootFolder;
        //        result.Success = true;
        //    }
        //    catch(Exception ex)
        //    {
        //        result.Data = ex;
        //    }
        //    return result;
        //}
        [HttpGet]
        [Route("FolderExists")]
        public Result FolderExists(string folderPath)
        {
            var result = new Result();
            try
            {
                if (Directory.Exists(folderPath))
                    result.Success = true;
            }
            catch (Exception ex)
            {
                result.Data = ex;
            }
            return result;
        }
        /// <summary>
        /// Validates incoming folder for the "Scripts/Apps" folder structure
        /// and looks for various other conventions to validate an AppsJS project
        /// 
        /// NOTE: Important that this method establishes the config singleton
        /// 
        /// </summary>
        /// <param name="webRootFolder"></param>
        /// <returns>Config object containing the validation steps and the validated folders and other values</returns>
        [HttpGet][Route("View")]
        public Result View(string webRootFolder)
        {
            var result = new Result();
            Config.LoadConfig(); //Creates a new config in memory

            try
            {
                string scriptsPath = webRootFolder + "\\Scripts";
                string appsPath = scriptsPath + "\\Apps";
                string appsFilePath = appsPath + "\\Apps.js";
                string componentsPath = appsPath + "\\Components";
                string componentsFilePath = componentsPath + "\\components.json";
                string resourcesPath = appsPath + "\\Resources";
                string resourcesFilePath = resourcesPath + "\\resources.json";
                string templatesPath = appsPath + "\\Templates";
                string templatesDefaultPath = templatesPath + "\\Default";
                string cssTemplateFilePath = templatesDefaultPath + "\\empty.css";
                string htmlTemplateFilePath = templatesDefaultPath + "\\empty.html";
                string jsTemplateFilePath = templatesDefaultPath + "\\empty.js";

                result.Messages.Add("Starting folder validation.");

                var webRootExists = new ValidationStep { Step = "Web root directory exists." };
                var scriptsExists = new ValidationStep { Step = "Scripts subfolder exists." };
                var appsExists = new ValidationStep { Step = "Apps subfolder exists." };
                var appsFileExists = new ValidationStep { Step = "AppsJS file exists." };
                var componentsExists = new ValidationStep { Step = "Components subfolder exists." };
                var componentFileExists = new ValidationStep { Step = "Components JSON file." };
                var resourcesExists = new ValidationStep { Step = "Resources subfolder exists." };
                var resourcesFileExists = new ValidationStep { Step = "Resources JSON file." };
                var templatesExists = new ValidationStep { Step = "Main templates folder exists." };
                var templateDefaultExists = new ValidationStep { Step = "Default folder with default template files." };
                var templateDefaultFilesExist = new ValidationStep { Step = "Default template files." };

                Config.CurrentConfig.ValidationSteps.Clear();

                Config.CurrentConfig.ValidationSteps.AddRange(new ValidationStep[]
                {
                    webRootExists, scriptsExists, appsExists, appsFileExists, 
                    componentsExists, componentFileExists, templateDefaultExists, templateDefaultFilesExist,
                    resourcesExists, resourcesFileExists, templatesExists
                });

                if (Directory.Exists(webRootFolder))
                {
                    SetValidationStepTrue(webRootExists);
                    Config.CurrentConfig.BaseWebRootFolder = webRootFolder;

                    if(Directory.Exists(scriptsPath))
                    {
                        SetValidationStepTrue(scriptsExists);

                        if (Directory.Exists(appsPath))
                        {
                            SetValidationStepTrue(appsExists);
                            Config.CurrentConfig.BaseAppsFolder = appsPath;

                            if(System.IO.File.Exists(appsFilePath))
                                SetValidationStepTrue(appsFileExists);

                            if (Directory.Exists(componentsPath))
                            {
                                SetValidationStepTrue(componentsExists);
                                Config.CurrentConfig.BaseComponentsFolder = componentsPath;

                                if (System.IO.File.Exists(componentsFilePath))
                                {
                                    SetValidationStepTrue(componentFileExists);
                                    Config.CurrentConfig.BaseComponentsFilePath = componentsFilePath;
                                }
                                
                                if (Directory.Exists(resourcesPath))
                                {
                                    SetValidationStepTrue(resourcesExists);
                                    Config.CurrentConfig.BaseResourcesFolder = resourcesPath;

                                    if (System.IO.File.Exists(resourcesFilePath))
                                    {
                                        SetValidationStepTrue(resourcesFileExists);
                                        Config.CurrentConfig.BaseResourcesFilePath = resourcesFilePath;
                                    }
                                    if(Directory.Exists(templatesPath))
                                    {
                                        SetValidationStepTrue(templatesExists);

                                        if(Directory.Exists(templatesDefaultPath))
                                        {
                                            SetValidationStepTrue(templateDefaultExists);
                                            Config.CurrentConfig.BaseTemplatesFolder = templatesDefaultPath;
                                            
                                            if(System.IO.File.Exists(cssTemplateFilePath) 
                                                && System.IO.File.Exists(htmlTemplateFilePath) 
                                                && System.IO.File.Exists(jsTemplateFilePath))
                                            {
                                                SetValidationStepTrue(templateDefaultFilesExist);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                result.Data = Config.CurrentConfig;
                result.Success = Config.IsValid; 
            }
            catch(Exception ex)
            {
                result.Data = ex; //TODO: change to logging
            }

            return result;
        }
        /// <summary>
        /// Helper method to set to true. 
        /// Assumes config is populated and filled with steps
        /// </summary>
        /// <param name="step"></param>
        private void SetValidationStepTrue(ValidationStep step)
        {
            Config.CurrentConfig.ValidationSteps.Where(s => s == step).Single().Passed = true;
        }
        //public void SaveWebRoot(string webRoot)
        //{
        //    var config = ConfigHelper.LoadConfig();
        //    config.BaseWebRootFolder = webRoot;
        //    ConfigHelper.SaveConfig(config);
        //}
        [HttpGet]
        [Route("GetComponentReport")]
        public Result GetComponentReport()
        {
            var result = new Result();
            try
            {
                if (Config.IsValid)
                {
                     using (StreamReader r = new StreamReader(Config.CurrentConfig.BaseComponentsFilePath))
                    {
                        var json = r.ReadToEnd();
                        var components = JsonConvert.DeserializeObject<ComponentReport>(json);
                        components.DiskTest(Config.CurrentConfig.BaseComponentsFolder); //Checks each component whether actually on disk

                        result.Data = components;
                        result.Success = true;
                    }
                }
                else
                    result.Messages.Add("Config was not valid.");
            }
            catch (Exception ex)
            {
                result.Data = ex;
            }
            return result;
        }
        [HttpGet]
        [Route("GetResourceReport")]
        public Result GetResourceReport()
        {
            var result = new Result();
            try
            {
                if (Config.IsValid)
                {
                    using (StreamReader r = new StreamReader(Config.CurrentConfig.BaseResourcesFilePath))
                    {
                        var json = r.ReadToEnd();
                        result.Data = JsonConvert.DeserializeObject<ResourceReport>(json);
                        result.Success = true;
                    }
                }
                else
                    result.Messages.Add("Config was not valid getting resource report.");
            }
            catch (Exception ex)
            {
                result.Data = ex;
            }
            return result;
        }


    }
}