using AppsClient;
using LiteDB;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AppsDesktop.Business.Publish
{
    [Route("api/[controller]")]
    [ApiController]
    public class PublishController : ControllerBase
    {
        private IWebHostEnvironment _env;
        private AppsData _data;
        private LiteDatabase _db;

        public PublishController(IWebHostEnvironment env, AppsData data)
        {
            _env = env;
            _data = data;
            _db = data.AppsDB;
        }
        [HttpGet]
        [Route("CloneRepo")]
        public AppsResult CloneRepo(string remoteRepoUrl, int publishProfileId)
        {
            var result = new AppsResult();

            try
            {
                var objs = _db.GetCollection<PublishProfile>("PublishProfiles"); // db.Softwares.Add(software);

                var ppList = objs.Query().Where(pp => pp.PublishProfileID == publishProfileId).ToList();
                if (ppList.Count() == 1)
                {
                    var pp = ppList.Single();

                    var localGitPath = Environment.CurrentDirectory + "\\AppFolders\\App" + pp.AppID.ToString() + "\\Repo";
                    
                    pp.LocalRepoPath = LibGit2Sharp.Repository.Clone(remoteRepoUrl, localGitPath);
                    pp.LocalRepoPathExists = true;
                    pp.RemoteRepoURL = remoteRepoUrl;

                    objs.Upsert(pp);

                    result.Success = true;
                }
                else
                    result.FailMessages.Add("Publish profiles for app was not zero or 1");

                
                //using (var repo = new LibGit2Sharp.Repository(path, LibGit2Sharp.RepositoryOptions.Remote()
                //{
                //    LibGit2Sharp.Remote origin = repo.Network.Remotes["origin"];

                //}
            }
            catch(System.Exception ex)
            {
                new AppFlows.Publish.Exception(ex, ref result);
                result.FailMessages.Add("Exception on CloneRepo: " + ex.Message);
            }

            return result;
        }


    }
}