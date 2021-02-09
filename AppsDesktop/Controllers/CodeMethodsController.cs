using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Web;
using System.Linq;
using System.Diagnostics;
using System.CodeDom.Compiler;
using System.Xml;
using Microsoft.AspNetCore.Mvc;

namespace AppsDesktop.Controllers
{
    public class CodeMethodsController : Controller
    {

        public class Result
        {
            public Result()
            {
                Logs = new List<string>();
            }
            public bool Success { get; set; }
            public string Message { get; set; }
            public object Data { get; set; }
            public List<string> Logs { get; set; }
        }
        public class SolutionNodesAndLinks
        {
            public List<JsonDataNode> nodes = new List<JsonDataNode>();
            public List<JsonLinkNode> links = new List<JsonLinkNode>();
        }
        public class JsonDataNode
        {
            public JsonDataNode(int indexParam, int idParam, string htmlParam, string nameParam, int typeidParam, int wParam, int xParam, int yParam, int zParam)
            {
                index = indexParam; id = idParam; name = nameParam; html = htmlParam; typeid = typeidParam; w = wParam; x = xParam; y = yParam; z = zParam;
            }
            public int index;
            public int id;
            public string html;
            public string name;
            public int typeid;
            public int w;
            public int z;
            public int x;
            public int y;
        }
        public class JsonLinkNode
        {
            public JsonLinkNode(int s, int t)
            {
                source = s; target = t;
            }
            public int source; //id
            public int target; //id
        }
        [Route("api/CodeMethods/GetOne")]
        [HttpGet]
        public Result GetOne(string methodName)
        {
            var result = new Result();
            var solutionNodesAndLinks = new SolutionNodesAndLinks();

            try
            {
                string gitFolder = @"D:\Work\Brooksoft\AppsJS\AppsJSCLI2\AppsDesktop"; //Physical path of apps folder

                result.Logs.Add("Got git folder: " + gitFolder);

                if (Directory.Exists(gitFolder))
                {
                    var jsonDataNodes = new List<JsonDataNode>();
                    var jsonLinkNodes = new List<JsonLinkNode>();

                    int startIndex = 0; int startId = 1;

                    //result.Logs.Add("Getting the files for the root folder.");

                    FileSearch(gitFolder, jsonDataNodes, jsonLinkNodes, startIndex, startId, result.Logs, methodName);
                    DirSearch(gitFolder, jsonDataNodes, jsonLinkNodes, startIndex, startId, result.Logs, methodName);

                    solutionNodesAndLinks.nodes = jsonDataNodes;
                    solutionNodesAndLinks.links = jsonLinkNodes;

                    result.Data = solutionNodesAndLinks;
                    result.Success = true;
                }
                else
                    result.Logs.Add("Git folder not found.");
            }
            catch (System.Exception ex)
            {
                result.Data = ex;
            }
            return result;
        }
        private void DirSearch(string sDir, List<JsonDataNode> nodes, List<JsonLinkNode> links, int startIndex, int startId, List<string> log, string methodName)
        {
            try
            {
                foreach (string d in Directory.GetDirectories(sDir))
                {
                    FileSearch(d, nodes, links, startIndex, startId, log, methodName);
                    DirSearch(d, nodes, links, startIndex, startId, log, methodName);
                }
            }
            catch (System.Exception excpt)
            {
                Console.WriteLine(excpt.Message);
            }
        }
        public void FileSearch(string d, List<JsonDataNode> nodes, List<JsonLinkNode> links, int startIndex, int startId, List<string> log, string methodName)
        {
            try
            {
                //log.Add("Starting iteration of solution files in this directory. Looking for solutions: " + solutionsIncluded);

                foreach (string f in Directory.GetFiles(d))
                {
                    var fileInfo = new FileInfo(f);
                    if (fileInfo.Extension == ".sln")
                    {

                        if (1 ==1) //solutionsIncluded.ToLower().IndexOf(fileInfo.Name.ToLower()) > -1 || onlySolutionNames)
                        {
                            log.Add("Parsing solution file: " + fileInfo.FullName);

                            Solution sln = new Solution(f);

                            int solutionStartIndex = startIndex; int solutionStartId = startId;

                            var solutionNode = new JsonDataNode(solutionStartIndex, solutionStartId, "", fileInfo.Name, 1, 20, 20, 20, 20);
                            //nodes.Add(solutionNode);

                            startIndex++; startId++;


                            if (1 == 1) //returnProjects && !onlySolutionNames)
                            {
                                foreach (var p in sln.Projects)
                                {
                                    if (1==1) //projectsIncluded.ToLower().IndexOf(p.ProjectName.ToLower()) > -1 || projectsIncluded == "all")
                                    {
                                        try
                                        {
                                            int projectIndex = startIndex; //Used for methods etc. below

                                            var projectNode = new JsonDataNode(startIndex, startId, "", p.ProjectName, 2, 10, 20, 20, 20);
                                            //nodes.Add(projectNode);

                                            //add link
                                            var projectLink = new JsonLinkNode(solutionStartIndex, startIndex);
                                            //links.Add(projectLink);

                                            startIndex++; startId++;

                                            if (1 == 1) //returnTypes) //only return methods when partial project list
                                            {
                                                //get project files
                                                string projectFilePath = d + "\\" + p.RelativePath;

                                                if (System.IO.File.Exists(projectFilePath))
                                                {
                                                    var fiProject = new FileInfo(projectFilePath);

                                                    //Get assembly name
                                                    XmlDocument xmldoc = new XmlDocument();
                                                    xmldoc.Load(projectFilePath);

                                                    XmlNamespaceManager mgr = new XmlNamespaceManager(xmldoc.NameTable);

                                                    //Get namespaces
                                                    var listReferences = new List<string>();
                                                    bool haveAssemblyName = false;
                                                    string assemblyName = "";

                                                    foreach (XmlNode item in xmldoc.GetElementsByTagName("PropertyGroup")) //SelectNodes("//ItemGroup//Compile"))
                                                    {

                                                        foreach (XmlNode projFile in item.ChildNodes)
                                                        {
                                                            if (projFile.Name == "AssemblyName")
                                                            {
                                                                haveAssemblyName = true;
                                                                assemblyName = projFile.InnerText;
                                                            }
                                                        }
                                                    }

                                                    if (haveAssemblyName)
                                                    {
                                                        // Load the assembly
                                                        Assembly assembly = Assembly.LoadFrom(fiProject.DirectoryName + "\\bin\\" + assemblyName + ".dll");

                                                        // Get all of the types defined in the assembly
                                                        var typesInAssembly = assembly.DefinedTypes;
                                                        var arTypesInAssembly = typesInAssembly.ToArray();

                                                        for (int x = 0; x < arTypesInAssembly.ToArray().Length; x++) // each (Type type in typesInAssembly)
                                                        {
                                                            var type = arTypesInAssembly[x];

                                                            if (1 == 1) //typesIncluded.ToLower().IndexOf(type.Name.ToLower()) > -1 || typesIncluded == "all")
                                                            {
                                                                try
                                                                {

                                                                    if (!type.Name.StartsWith("_Closure$__")
                                                                        && !type.Name.Contains("AnonymousType")
                                                                        && !type.Name.Contains("<>c")
                                                                        && !type.Name.Contains("DisplayClass")
                                                                        && !String.IsNullOrEmpty(type.Name.Trim())
                                                                        && !type.Name.Contains("d__")
                                                                        && !type.Name.Contains("privateimplementationdetails"))
                                                                    {
                                                                        int typeIndex = startIndex; //for use on child methods

                                                                        var objectNode = new JsonDataNode(startIndex, startId, type.FullName, type.Name, 3, 15, 15, 15, 15);
                                                                        nodes.Add(objectNode);

                                                                        var objectLink = new JsonLinkNode(projectIndex, startIndex);
                                                                        links.Add(objectLink);

                                                                        startIndex++; startId++;

                                                                        //Console.WriteLine("Type: {0}", type);

                                                                        //// This loads the public fields
                                                                        //FieldInfo[] fields = type.GetFields();

                                                                        //Console.WriteLine("  Fields:");
                                                                        //// If you want non-public too, use:
                                                                        //// FieldInfo[] fields = type.GetFields(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance);
                                                                        //foreach (var field in fields)
                                                                        //    Console.WriteLine("    {0}", field.Name);

                                                                        //Console.WriteLine("  Props:");
                                                                        //PropertyInfo[] props = type.GetProperties();

                                                                        //// If you want non-public too, use:
                                                                        //// PropertyInfo[] props = type.PropertyInfo(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance);
                                                                        //foreach (var prop in props)
                                                                        //    Console.WriteLine("    {0}", prop.Name);

                                                                        //Console.WriteLine("  Methods:");
                                                                        if (1 == 1) //returnMethods)
                                                                        {
                                                                            MethodInfo[] methods = type.GetMethods(BindingFlags.Public | BindingFlags.Instance); // | BindingFlags.NonPublic | BindingFlags.Instance);
                                                                                                                                                                 // or MethodInfo[] methods = type.GetMethods(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance);
                                                                            foreach (var method in methods)
                                                                            {
                                                                                Console.WriteLine("    {0}", method.Name);

                                                                                if (method.Name != "GetHashCode" &&
                                                                                    method.Name != "ChangeCulture" &&
                                                                                    method.Name != "ChangeUICulture" &&
                                                                                    method.Name != "Equals" &&
                                                                                    method.Name != "ToString" &&
                                                                                    method.Name != "get_UICulture" &&
                                                                                    method.Name != "get_Culture" &&
                                                                                    method.Name != "get_Info" &&
                                                                                    method.Name != "get_Log" &&
                                                                                    method.Name != "GetEnvironmentVariable")
                                                                                {
                                                                                    if (methodName == method.Name)
                                                                                    {
                                                                                        var methodNode = new JsonDataNode(startIndex, startId, method.GetMethodBody().ToString(), method.Name, 4, 15, 15, 15, 15);
                                                                                        nodes.Add(methodNode);

                                                                                        var methodLink = new JsonLinkNode(typeIndex, startIndex);
                                                                                        links.Add(methodLink);

                                                                                        startIndex++; startId++;
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                                catch (System.Exception ex)
                                                                {
                                                                    log.Add("Unable to get properties and/or methods from type " + arTypesInAssembly[x].Name + ": " + ex.Message + ". Stack: " + ex.StackTrace);
                                                                }
                                                            }
                                                        }
                                                        //If you want to add static methods/ props / etc, use BindingFlags.Static instead of BindingFlags.Instance.
                                                    }
                                                }
                                            }
                                        }
                                        catch (System.Exception ex)
                                        {
                                            log.Add("Unable to parse project " + p.ProjectName + ": " + ex.Message + ". Stack: " + ex.StackTrace);
                                        }
                                    }
                                    //    XmlDocument xmldoc = new XmlDocument();
                                    //    xmldoc.Load(projectFilePath);

                                    //    XmlNamespaceManager mgr = new XmlNamespaceManager(xmldoc.NameTable);
                                    //    //mgr.AddNamespace("x", "http://schemas.microsoft.com/developer/msbuild/2003");

                                    //    //Get namespaces
                                    //    var listReferences = new List<string>();

                                    //    foreach (XmlNode item in xmldoc.GetElementsByTagName("ItemGroup")) //SelectNodes("//ItemGroup//Compile"))
                                    //    {

                                    //        foreach (XmlNode projFile in item.ChildNodes)
                                    //        {
                                    //            if (projFile.Name == "Reference")
                                    //            {
                                    //                bool hasHintPath = false;
                                    //                string hintPath = "";

                                    //                foreach(XmlNode child in projFile.ChildNodes)
                                    //                {
                                    //                    if (child.Name == "HintPath")
                                    //                    {
                                    //                        hasHintPath = true;
                                    //                        hintPath = child.InnerText;
                                    //                        break;
                                    //                    }
                                    //                }
                                    //                if (hasHintPath) //projFile.FirstChild != null && projFile.FirstChild.Name == "HintPath")
                                    //                {
                                    //                    //var currentFolder = fileInfo.Directory;
                                    //                    //string[] parts = projFile.FirstChild.InnerText.Split('\\');
                                    //                    //for(int x = 0; x < parts.Length; x++)
                                    //                    //{
                                    //                    //    if (parts[x] == "..")
                                    //                    //        currentFolder = currentFolder.Parent;
                                    //                    //}
                                    //                    //listReferences.Add(Path.Combine(currentFolder.FullName, projFile.FirstChild.InnerText));
                                    //                    string[] parts = hintPath.Split('\\'); // projFile.FirstChild.InnerText.Split('\\');
                                    //                    listReferences.Add(fiProject.DirectoryName + "\\bin\\" + parts[parts.Length - 1]);
                                    //                }
                                    //                else
                                    //                {
                                    //                    string[] reference = projFile.Attributes["Include"].Value.Split(',');

                                    //                    listReferences.Add(reference[0] + ".dll");

                                    //                }


                                    //            }
                                    //        }
                                    //    }

                                    //    foreach (XmlNode item in xmldoc.GetElementsByTagName("ItemGroup")) //SelectNodes("//ItemGroup//Compile"))
                                    //    {
                                    //        foreach (XmlNode projFile in item.ChildNodes)
                                    //        {


                                    //            //code files
                                    //            if (projFile.Name == "Compile")
                                    //            {
                                    //                var fiCode = new FileInfo(fiProject.Directory.FullName + "//" + projFile.Attributes["Include"].Value);
                                    //                string source = File.ReadAllText(fiCode.FullName);

                                    //                CompilerParameters parameters = new CompilerParameters()
                                    //                {
                                    //                    GenerateExecutable = false,
                                    //                    GenerateInMemory = true,
                                    //                    TreatWarningsAsErrors = false
                                    //                };
                                    //                parameters.ReferencedAssemblies.AddRange(listReferences.ToArray());

                                    //                CompilerResults results = null;

                                    //                if (fiCode.Extension == ".vb")
                                    //                {
                                    //                    VBCodeProvider vbProvider = new VBCodeProvider();
                                    //                    results = vbProvider.CompileAssemblyFromSource(parameters, source);
                                    //                }
                                    //                else if (fiCode.Extension == ".cs")
                                    //                {
                                    //                    CSharpCodeProvider csProvider = new CSharpCodeProvider();
                                    //                    results = csProvider.CompileAssemblyFromSource(parameters, source);
                                    //                }

                                    //                if (results != null && !results.Errors.HasErrors)
                                    //                {
                                    //                    var assembly = results.CompiledAssembly;
                                    //                    var types = assembly.GetTypes();
                                    //                    foreach (Type type in types)
                                    //                    {
                                    //                        var name = type.Name;
                                    //                        var properties = type.GetProperties();
                                    //                        var methods = type.GetMethods();

                                    //                    }
                                    //                }
                                    //                else
                                    //                {
                                    //                    //has errors or null

                                    //                }

                                    //            }
                                    //        }

                                    //    }
                                    //}
                                }
                            }
                        }
                    }
                }
            }
            catch(System.Exception ex)
            {
                log.Add("Problem doing a file search and parse of directory: " + d + ": " + ex.Message + ". Stack: " + ex.StackTrace);
            }
        }
    }
    public class Solution
    {
        //internal class SolutionParser
        //Name: Microsoft.Build.Construction.SolutionParser
        //Assembly: Microsoft.Build, Version=4.0.0.0

        static readonly Type s_SolutionParser;
        static readonly PropertyInfo s_SolutionParser_solutionReader;
        static readonly MethodInfo s_SolutionParser_parseSolution;
        static readonly PropertyInfo s_SolutionParser_projects;

        static Solution()
        {
            s_SolutionParser = Type.GetType("Microsoft.Build.Construction.SolutionParser, Microsoft.Build, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a", false, false);
            if (s_SolutionParser != null)
            {
                s_SolutionParser_solutionReader = s_SolutionParser.GetProperty("SolutionReader", BindingFlags.NonPublic | BindingFlags.Instance);
                s_SolutionParser_projects = s_SolutionParser.GetProperty("Projects", BindingFlags.NonPublic | BindingFlags.Instance);
                s_SolutionParser_parseSolution = s_SolutionParser.GetMethod("ParseSolution", BindingFlags.NonPublic | BindingFlags.Instance);
            }
        }

        public List<SolutionProject> Projects { get; private set; }

        public Solution(string solutionFileName)
        {
            if (s_SolutionParser == null)
            {
                throw new InvalidOperationException("Can not find type 'Microsoft.Build.Construction.SolutionParser' are you missing a assembly reference to 'Microsoft.Build.dll'?");
            }
            var solutionParser = s_SolutionParser.GetConstructors(BindingFlags.Instance | BindingFlags.NonPublic).First().Invoke(null);
            using (var streamReader = new StreamReader(solutionFileName))
            {
                s_SolutionParser_solutionReader.SetValue(solutionParser, streamReader, null);
                s_SolutionParser_parseSolution.Invoke(solutionParser, null);
            }
            var projects = new List<SolutionProject>();
            var array = (Array)s_SolutionParser_projects.GetValue(solutionParser, null);
            for (int i = 0; i < array.Length; i++)
            {
                projects.Add(new SolutionProject(array.GetValue(i)));
            }
            this.Projects = projects;
        }
    }

    [DebuggerDisplay("{ProjectName}, {RelativePath}, {ProjectGuid}")]
    public class SolutionProject
    {
        static readonly Type s_ProjectInSolution;
        static readonly PropertyInfo s_ProjectInSolution_ProjectName;
        static readonly PropertyInfo s_ProjectInSolution_RelativePath;
        static readonly PropertyInfo s_ProjectInSolution_ProjectGuid;

        static SolutionProject()
        {
            s_ProjectInSolution = Type.GetType("Microsoft.Build.Construction.ProjectInSolution, Microsoft.Build, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a", false, false);
            if (s_ProjectInSolution != null)
            {
                s_ProjectInSolution_ProjectName = s_ProjectInSolution.GetProperty("ProjectName", BindingFlags.NonPublic | BindingFlags.Instance);
                s_ProjectInSolution_RelativePath = s_ProjectInSolution.GetProperty("RelativePath", BindingFlags.NonPublic | BindingFlags.Instance);
                s_ProjectInSolution_ProjectGuid = s_ProjectInSolution.GetProperty("ProjectGuid", BindingFlags.NonPublic | BindingFlags.Instance);
            }
        }

        public string ProjectName { get; private set; }
        public string RelativePath { get; private set; }
        public string ProjectGuid { get; private set; }

        public SolutionProject(object solutionProject)
        {
            this.ProjectName = s_ProjectInSolution_ProjectName.GetValue(solutionProject, null) as string;
            this.RelativePath = s_ProjectInSolution_RelativePath.GetValue(solutionProject, null) as string;
            this.ProjectGuid = s_ProjectInSolution_ProjectGuid.GetValue(solutionProject, null) as string;
        }
    }
}
