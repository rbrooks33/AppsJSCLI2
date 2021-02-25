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
    }
}