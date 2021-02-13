using AppsClient;
using Flows;
using LiteDB;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AppsDesktop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DevelopController : ControllerBase
    {
        private IWebHostEnvironment _env;
        private LiteDatabase _db;
        private AppsData _data;

        public DevelopController(IWebHostEnvironment env, AppsData data)
        {
            _env = env;
            _db = data.AppsDB;
            _data = data;
        }

        [HttpGet]
        [Route("GetFileModel")]
        public AppsResult GetFileModel()
        {
            var result = new AppsResult();
            result.Data = new SoftwareFile();
            result.Success = true;
            return result;
        }

        [HttpGet]
        [Route("GetFileCodeModel")]
        public AppsResult GetFileCodeModel()
        {
            var result = new AppsResult();
            result.Data = new SoftwareFileCode();
            result.Success = true;
            return result;
        }
        [HttpGet]
        [Route("GetFiles")]
        public AppsResult GetFiles(int appId)
        {
            var result = new AppsResult();

            try
            {
                var files = _db.GetCollection<SoftwareFile>("SoftwareFiles");
                var codes = _db.GetCollection<SoftwareFileCode>("SoftwareFileCodes");

                var fileList = files.Query().Where(f => f.AppID == appId).ToList();
             
                foreach(var file in fileList)
                {
                    var fileCodes = codes.Query().Where(c => c.SoftwareFileID == file.SoftwareFileID);
                    if (fileCodes.Count() > 0)
                        file.SoftwareFileCodes.AddRange(fileCodes.ToList());
                }
                result.Success = true;
            }
            catch(System.Exception ex)
            {
                new AppFlows.Develop.Exception(ex, ref result);
            }
            return result;
        }
    }
}