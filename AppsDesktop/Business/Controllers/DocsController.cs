using AppsClient;
using AppsDesktop.Models.AppsJS;
using AppsDesktop.Models.Docs;
using LiteDB;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace AppsDesktop.Controllers.Docs
{
    [Route("api/Docs")]
    public class DocsController : Controller
    {
        private IWebHostEnvironment _env;

        private static string dbPath = Environment.CurrentDirectory + "\\Business\\Data\\DocsDB.db";

        private DocsContext db = new DocsContext();

        public DocsController(IWebHostEnvironment env)
        {
            _env = env;

        }
        [Route("GetDocModel")]
        [HttpGet]
        public AppsClient.AppsResult GetDocModel()
        {
            var result = new AppsResult();

            try
            {
                result.Data = new Doc();
                result.Success = true;
            }
            catch (System.Exception ex)
            {
                result.Data = ex;
            }

            return result;
        }
        [Route("GetComputerName")]
        [HttpGet]
        public AppsClient.AppsResult GetComputerName()
        {
            var result = new AppsResult();

            try
            {
                result.Messages.Add(Environment.MachineName);
                result.Success = true;
            }
            catch (System.Exception ex)
            {
                result.Data = ex;
            }

            return result;
        }

        [Route("GetDocTypes")]
        [HttpGet]
        public AppsResult GetDocTypes()
        {
            var result = new AppsResult();

            try
            {
                using (var dblocal = new LiteDatabase(dbPath))
                {
                    var docsTable = dblocal.GetCollection<DocType>("DocTypes");
                    result.Data = docsTable.FindAll().ToList();
                    result.Success = true;
                }
            }
            catch (System.Exception ex)
            {
                result.Data = ex;
            }

            return result;
        }

        [Route("GetDocTypeByDocID")]
        [HttpGet]
        public AppsResult GetDocTypeByDocID(int docId)
        {
            var result = new AppsResult();

            try
            {
                using (var dblocal = new LiteDatabase(dbPath))
                {
                    var docList = dblocal.GetCollection<Doc>("Docs");
                    var docs = docList.FindAll().ToList().Where(d => d.DocID == docId);

                    if (docs.Count() == 1)
                    {
                        var docTypeList = dblocal.GetCollection<DocType>("DocTypes");

                        result.Data = docTypeList.FindAll().ToList().Where(dt => dt.DocTypeID == docs.Single().DocTypeID);
                        result.Success = true;
                    }
                }
            }
            catch (System.Exception ex)
            {
                result.Data = ex;
            }

            return result;
        }

        [Route("GetDocType")]
        [HttpGet]
        public AppsResult DocType(int docTypeId)
        {
            var result = new AppsResult();

            try
            {
                using (var dblocal = new LiteDatabase(dbPath))
                {
                    var docsTable = dblocal.GetCollection<DocType>("DocTypes");
                    result.Data = docsTable.FindAll().ToList().Where(dt => dt.DocTypeID == docTypeId);
                    result.Success = true;
                }
            }
            catch (System.Exception ex)
            {
                result.Data = ex;
            }

            return result;
        }

        [Route("UpsertDocType")]
        [HttpPost]
        public AppsResult UpsertDocType([FromBody]DocType docType)
        {
            var result = new AppsResult();

            try
            {
                using (var dblocal = new LiteDatabase(dbPath))
                {
                    var docsTable = dblocal.GetCollection<DocType>("DocTypes");
                    docsTable.Upsert(docType);
                    result.Success = true;
                }
            }
            catch (System.Exception ex)
            {
                result.Data = ex;
            }

            return result;
        }
        [Route("GetDoc")]
        [HttpGet]
        public AppsResult GetDoc(int docId)
        {
            var result = new AppsResult();

            try
            {
                using (var dblocal = new LiteDatabase(dbPath))
                {
                    var docsTable = dblocal.GetCollection<Doc>("Docs");
                    result.Data = docsTable.FindAll().ToList().Where(d => d.DocID == docId);
                    result.Success = true;
                }
            }
            catch (System.Exception ex)
            {
                result.Data = ex;
            }

            return result;
        }
        [Route("GetParentDocs")]
        [HttpGet]
        public AppsResult GetParentDocs()
        {
            var result = new AppsResult();

            try
            {
                using (var dblocal = new LiteDatabase(dbPath))
                {
                    var docsTable = dblocal.GetCollection<Doc>("Docs");
                    var docsList = docsTable.FindAll().ToList().Where(d => d.ParentDocID == -1);

                    foreach (var doc in docsList)
                    {
                        doc.ChildCount = docsTable.FindAll().ToList().Where(dl => dl.ParentDocID == doc.DocID).Count();
                    }

                    result.Data = docsList; // docsTable.FindAll().ToList());
                    result.Success = true;
                }
            }
            catch (System.Exception ex)
            {
                result.Data = ex;
            }

            return result;
        }

        [Route("GetDocs")]
        [HttpGet]
        public AppsResult GetDocs()
        {
            var result = new AppsResult();

            try
            {
                using (var dblocal = new LiteDatabase(dbPath))
                {
                    var docsTable = dblocal.GetCollection<Doc>("Docs").FindAll().ToList();

                    foreach (var doc in docsTable)
                    {
                        doc.ChildCount = docsTable.Where(dl => dl.ParentDocID == doc.DocID).Count();
                    }

                    result.Data = docsTable; //.Where(d => d.DocTypeID == docTypeId);
                    result.Success = true;
                }
            }
            catch(System.Exception ex)
            {
                result.Data = ex;
            }

            return result;
        }
        [Route("GetTags")]
        [HttpGet]
        public Result GetTags()
        {
            var result = new Result();

            try
            {
                using (var dblocal = new LiteDatabase(dbPath))
                {
                    var docsTable = dblocal.GetCollection<Tag>("Tags").FindAll().ToList();

                    result.Data = docsTable; //.Where(d => d.DocTypeID == docTypeId);
                    result.Success = true;
                }
            }
            catch (System.Exception ex)
            {
                result.Data = ex;
            }

            return result;
        }
        [Route("GetDocsByParent")]
        [HttpGet]
        public Result GetDocsByParent(int parentDocId)
        {
            var result = new Result();

            DocsByParent = new List<Doc>();

            try
            {
                using (var dblocal = new LiteDatabase(dbPath))
                {
                    var docsList = dblocal.GetCollection<Doc>("Docs").FindAll().ToList(); //.Where(d => d.Archived == false).ToList();

                    GetDocsByParent(docsList, parentDocId);

                    result.Data = DocsByParent; // docs; // docsTable.FindAll().ToList()
                        //.Where(d => d.DocTypeID == docTypeId); // && d.ParentDocID == parentDocId);
                    result.Success = true;
                }
            }
            catch (System.Exception ex)
            {
                result.Data = ex;
            }

            return result;
        }

        private List<Doc> DocsByParent = new List<Doc>();

        private Result GetDocsByParent(List<Doc> docsList, int parentDocId)
        {
            var result = new Result();

            var docs = docsList.Where(d => d.ParentDocID == parentDocId);

            foreach(var doc in docs)
            {
                doc.ChildCount = docsList.Where(dl => dl.ParentDocID == doc.DocID).Count();
            }
            DocsByParent.AddRange(docs);

            foreach(var doc in docs)
            {
                if (docsList.Where(d => d.ParentDocID == doc.DocID).Count() > 0)
                {
                    GetDocsByParent(docsList, doc.DocID);
                }
            }

            return result;
        }

        [Route("SearchDocs")]
        [HttpGet]
        public Result SearchDocs(string searchTerm)
        {
            var result = new Result();

            try
            {
                using (var dblocal = new LiteDatabase(dbPath))
                {
                    var docs = new List<Doc>();

                    var docsTable = dblocal.GetCollection<Doc>("Docs").FindAll().ToList();

                    docs.AddRange(docsTable.Where(d => d.DocTitle != null && d.DocContent != null && d.Archived == false)
                        .Where(d => d.DocTitle.ToLower().Contains(searchTerm.ToLower()) 
                        || d.DocContent.ToLower().Contains(searchTerm.ToLower())));

                    docs.AddRange(docsTable.Where(p => docsTable.Any(all => all.DocID == p.ParentDocID)));

                    result.Data = docs;
                    result.Success = true;
                }
            }
            catch (System.Exception ex)
            {
                result.Data = ex;
            }

            return result;
        }



        [Route("UpsertDoc")]
        [HttpPost]
        public Result UpsertDoc([FromBody]Doc doc)
        {
            var result = new Result();

            try
            {
                using (var dblocal = new LiteDatabase(dbPath))
                {
                    var docsTable = dblocal.GetCollection<Doc>("Docs");
                    docsTable.Upsert(doc);

                    result.Data = doc;
                    result.Success = true;
                }
            }
            catch (System.Exception ex)
            {
                result.Data = ex;
            }

            return result;
        }
        [Route("UpsertTag")]
        [HttpPost]
        public Result UpsertTag([FromBody]Tag tag)
        {
            var result = new Result();

            try
            {
                using (var dblocal = new LiteDatabase(dbPath))
                {
                    var docsTable = dblocal.GetCollection<Tag>("Tags");
                    docsTable.Upsert(tag);

                    result.Data = tag;
                    result.Success = true;
                }
            }
            catch (System.Exception ex)
            {
                result.Data = ex;
            }

            return result;
        }
        [Route("UpsertDocTags")]
        [HttpGet]
        public Result UpsertDocTags(int docId, int tagId)
        {
            var result = new Result();

            try
            {
                using (var dblocal = new LiteDatabase(dbPath))
                {
                    var docsTable = dblocal.GetCollection<Doc>("Docs").FindAll().ToList().Where(d => d.DocID == docId);
                    var docstagsTable = dblocal.GetCollection<DocsTag>("DocsTags");

                    var docTags = docstagsTable.FindAll().ToList()
                        .Where(dt => dt.DocID == docId && dt.TagID == tagId);

                    if (docTags.Count() == 0)
                        docstagsTable.Insert(new DocsTag { DocID = docId, TagID = tagId });

                    result.Data = docTags;
                    result.Success = true;
                }
            }
            catch (System.Exception ex)
            {
                result.Data = ex;
            }

            return result;
        }
        [Route("GetDocTags")]
        [HttpGet]
        public Result GetDocTags(long docId)
        {
            var result = new Result();

            try
            {
                using (var dblocal = new LiteDatabase(dbPath))
                {
                    var tagList = new List<Tag>();

                    var tagTable = dblocal.GetCollection<Tag>("Tags").FindAll().ToList();
                    var docTags = dblocal.GetCollection<DocsTag>("DocsTags").FindAll().ToList().Where(dt => dt.DocID == docId); // this.GetDocLinksByParent(docLinksList, docId); // docsTable.FindAll().ToList().Where(d => d.ParentDocID == docId);

                    foreach (var dt in docTags)
                    {
                        var tags = tagTable.Where(t => t.TagID == dt.TagID);
                        if (tags.Count() == 1)
                            tagList.Add(tags.Single());
                    }
                    result.Data = tagList;
                    result.Success = true;
                }
            }
            catch (System.Exception ex)
            {
                result.Data = ex;
            }

            return result;
        }
        public class GetSkillupsData
        {
            public GetSkillupsData()
            {
                SkillupDocs = new List<Doc>();
                SkillupDocReviews = new List<DocReview>();
            }
            public List<Doc> SkillupDocs { get; set; }
            public List<DocReview> SkillupDocReviews { get; set; }
        }
        [Route("GetSkillupsSummary")]
        [HttpGet]
        public Result GetSkillupsSummary(int tagId)
        {
            var result = new Result();
            var getSkillups = new GetSkillupsData();

            try
            {
                using (var dblocal = new LiteDatabase(dbPath))
                {
                    //get docs, tags and reviews
                    var docsTable = dblocal.GetCollection<Doc>("Docs").FindAll().ToList();
                    var docsTagsTable = dblocal.GetCollection<DocsTag>("DocsTags").FindAll().ToList();
                    var docsReviewsTable = dblocal.GetCollection<DocReview>("DocReviews").FindAll().ToList();

                    getSkillups.SkillupDocs = (from docsList in docsTable
                                               join tagsList in docsTagsTable
                                               on docsList.DocID equals tagsList.DocID
                                               where tagsList.TagID == tagId
                                               select docsList).ToList();

                    getSkillups.SkillupDocReviews = (from docList in getSkillups.SkillupDocs
                                                     join reviewList in docsReviewsTable
                                                     on docList.DocID equals reviewList.DocID
                                                     select reviewList).ToList();

                    result.Data = getSkillups;
                    result.Success = true;

                    ////Get CSS skill doctag (css skill parent doc id)
                    //var skillDocs = docsTagsTable.ToList().Where(dt => dt.TagID == tagId);
                    //if (skillDocs.Count() > 0)
                    //{
                    //    var skillDoc = skillDocs.First();

                    //    //Get data from children
                    //    var childDocs = new List<Doc>();
                    //    GetChildDocs(docsTable.ToList(), docsReviewsTable.ToList(), getSkillups, skillDoc.DocID);

                    //}
                }
            }
            catch (System.Exception ex)
            {
                result.Data = ex;
            }

            return result;
        }

        private void GetChildDocs(List<Doc> allDocs, List<DocReview> allReviews, GetSkillupsData data, int docId)
        {
            var childDocs = allDocs.Where(d => d.ParentDocID == docId).ToList();
            data.SkillupDocs.AddRange(childDocs);

            foreach (var child in childDocs)
            {
                data.SkillupDocReviews.AddRange(allReviews.Where(r => r.DocID == child.DocID));
                GetChildDocs(allDocs, allReviews, data, child.DocID);
            }
        }
        
        [Route("RemoveDocTag")]
        [HttpGet]
        public Result RemoveDocTag(long docId, int tagId)
        {
            var result = new Result();

            try
            {
                using (var dblocal = new LiteDatabase(dbPath))
                {
                    var docTagTable = dblocal.GetCollection<DocsTag>("DocsTags");
                    var docTags = docTagTable.FindAll().ToList().Where(dt => dt.DocID == docId && dt.TagID == tagId);

                    foreach(var docTag in docTags)
                    {
                        docTagTable.Delete(docTag.DocsTagID);
                        result.Data = docTag;
                        result.Success = true;
                    }
                }
            }
            catch (System.Exception ex)
            {
                result.Data = ex;
            }

            return result;
        }
        public class GetAllDocTag
        {
            public int DocID { get; set; }
            public int TagID { get; set; }
            public string TagName { get; set; }
            public string DocName { get; set; }
        }
        [Route("GetAllDocTags")]
        [HttpGet]
        public Result GetAllDocTags()
        {
            var result = new Result();
            var getAllDocTags = new List<GetAllDocTag>();

            try
            {
                using (var dblocal = new LiteDatabase(dbPath))
                {
                    var tagList = new List<Tag>();

                    var docTable = dblocal.GetCollection<Doc>("Docs").FindAll().ToList();
                    var tagTable = dblocal.GetCollection<Tag>("Tags").FindAll().ToList();
                    var docTagsTable = dblocal.GetCollection<DocsTag>("DocsTags").FindAll().ToList(); 

                    //Loop through docs/tags lookup table
                    foreach(var dt in docTagsTable)
                    {
                        var getAllDocTag = new GetAllDocTag
                        {
                            DocID = dt.DocID,
                            TagID = dt.TagID
                        };
                        
                        var tags = tagTable.Where(t => t.TagID == dt.TagID);
                        if (tags.Count() == 1)
                            getAllDocTag.TagName = tags.Single().Name;

                        var docs = docTable.Where(d => d.DocID == dt.DocID);
                        if (docs.Count() == 1)
                            getAllDocTag.DocName = docs.Single().DocTitle;

                        getAllDocTags.Add(getAllDocTag);
                    }
                    result.Data = getAllDocTags;
                    result.Success = true;
                }
            }
            catch (System.Exception ex)
            {
                result.Data = ex;
            }

            return result;
        }
        [Route("GetAllDocReviews")]
        [HttpGet]
        public Result GetAllDocReviews()
        {
            var result = new Result();

            try
            {
                using (var dblocal = new LiteDatabase(dbPath))
                {
                    result.Data = dblocal.GetCollection<DocReview>("DocReviews").FindAll().ToList();
                    result.Success = true;
                }
            }
            catch (System.Exception ex)
            {
                result.Data = ex;
            }

            return result;
        }
        [Route("DocReviewed")]
        [HttpGet]
        public Result DocReviewed(int docId)
        {
            var result = new Result();

            try
            {
                using (var dblocal = new LiteDatabase(dbPath))
                {
                    var docReviewsTable = dblocal.GetCollection<DocReview>("DocReviews");
                    var newReview = new DocReview { DocID = docId };
                    docReviewsTable.Upsert(newReview);
                    result.Data = newReview;
                    result.Success = true;
                }
            }
            catch (System.Exception ex)
            {
                result.Data = ex;
            }

            return result;
        }

        [Route("GetDocLinks")]
        [HttpGet]
        public Result GetDocLinks(long docId)
        {
            var result = new Result();

            try
            {
                using (var dblocal = new LiteDatabase(dbPath))
                {
                    var docLinksList = dblocal.GetCollection<DocLink>("DocLinks").FindAll().ToList();
                    result.Data = docLinksList.Where(dl => dl.ParentDocID == docId).ToList(); // this.GetDocLinksByParent(docLinksList, docId); // docsTable.FindAll().ToList().Where(d => d.ParentDocID == docId);
                    result.Success = true;
                }
            }
            catch (System.Exception ex)
            {
                result.Data = ex;
            }

            return result;
        }

        private List<DocLink> DocLinksByParent = new List<DocLink>();

        private Result GetDocLinksByParent(List<DocLink> docsList, long parentDocId)
        {
            var result = new Result();

            var docs = docsList.Where(d => d.ParentDocID == parentDocId);

            if (docs.Count() > 0)
            {
                DocLinksByParent.AddRange(docs);

                foreach (var doc in docs)
                {
                    if (docsList.Where(d => d.ParentDocID == doc.DocLinkID).Count() > 0)
                        GetDocLinksByParent(docsList, doc.DocLinkID);
                }
            }
            return result;
        }

        [Route("GetDocLinksDocsByDocType")]
        [HttpGet]
        public Result GetDocLinkDocsByDocType(int docTypeId)
        {
            var result = new Result();

            try
            {
                using (var dblocal = new LiteDatabase(dbPath))
                {
                    var linksList = dblocal.GetCollection<DocLink>("DocLinks");
                    var links = linksList.FindAll().ToList(); //.Where(dl => dl.ParentDocTypeID == docTypeId);

                    //Get all docs that the links connect to
                    var docsList = dblocal.GetCollection<Doc>("Docs");
                    var docs = docsList.FindAll().ToList()
                        .Where(d => links.Any(l => l.ParentDocID == d.DocID || l.ChildDocID == d.DocID));

                    result.Data = docs;
                    result.Success = true;
                }
            }
            catch (System.Exception ex)
            {
                result.Data = ex;
            }

            return result;
        }

        [Route("UpsertDocLink")]
        [HttpPost]
        public Result UpsertDocLink([FromBody]DocLink docLink)
        {
            var result = new Result();

            try
            {
                using (var dblocal = new LiteDatabase(dbPath))
                {
                    var docsTable = dblocal.GetCollection<DocLink>("DocLinks");
                    docsTable.Upsert(docLink);
                    result.Success = true;
                }
            }
            catch (System.Exception ex)
            {
                result.Data = ex;
            }

            return result;
        }
        [Route("GetMyDoc")]
        [HttpGet]
        public Result GetMyDoc(int docTypeId, int uniqueId)
        {
            var result = new Result();

            try
            {
                using (var dblocal = new LiteDatabase(dbPath))
                {
                    var docsTable = dblocal.GetCollection<Doc>("Docs");
                    result.Data = docsTable.FindAll().ToList().Where(d => d.DocTypeID == docTypeId && d.UniqueID == uniqueId);
                    result.Success = true;
                }
            }
            catch (System.Exception ex)
            {
                result.Data = ex;
            }

            return result;
        }
        [Route("UploadFiles")]
        [HttpPost]
        public AppsResult UploadFiles()
        {
            var result = new AppsResult();
            try
            {
                using (var dblocal = new LiteDatabase(dbPath))
                {
                    var docsFilesTable = dblocal.GetCollection<DocFile>("DocFiles");
                    
                    foreach (var file in Request.Form.Files)
                    {
                        string fileName = file.FileName; // ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName;
                        try
                        {
                            var newDocFile = new DocFile();
                            newDocFile.Name = Guid.NewGuid().ToString();

                            string[] fileNameArray = fileName.Split(".");
                            newDocFile.Extension = "." + fileNameArray[fileNameArray.Length - 1];
                            newDocFile.Size = file.Length;
                            newDocFile.FriendlyName = Request.Query["friendlyName"][0];
                            newDocFile.Description = Request.Query["description"][0];

                            int parentDocId = 0;
                            if(int.TryParse(Request.Query["docId"][0], out parentDocId))
                            {
                                newDocFile.DocID = parentDocId;
                            }
                            
                            //Save to db
                            docsFilesTable.Upsert(newDocFile);

                            //Save to disk
                            string savePath = this.GetPathAndFilename(fileName);
                            string newNamePath = this.GetPathAndFilename(newDocFile.Name + newDocFile.Extension);

                                FileStream output = System.IO.File.Create(savePath);
                                file.CopyTo(output);
                                //output.Flush();
                                output.Close();
                            
                            //while (!System.IO.File.Exists(savePath))
                            //{
                            //    System.Threading.Thread.Sleep(1000);
                            //}

                            System.IO.File.Move(savePath, newNamePath);
                            
                            result.Success = true;
                            result.Data = newDocFile;
                        }
                        catch (System.Exception fileEx)
                        {
                            result.Messages.Add("File upload error for " + fileName + ": " + fileEx.Message);
                        }
                    }
                }
            }
            catch (System.Exception ex)
            {
                result.Data = ex;
            }

            return result;
        }
        private string EnsureCorrectFilename(string filename)
        {
            if (filename.Contains("\\"))
                filename = filename.Substring(filename.LastIndexOf("\\") + 1);

            return filename;
        }

        private string GetPathAndFilename(string filename)
        {
            return _env.WebRootPath + "\\Images\\Uploads\\" + filename;
        }


        [Route("GetFilesByDocID")]
        [HttpGet]
        public Result GetFilesByDocID(long docId)
        {
            var result = new Result();

            try
            {
                using (var dblocal = new LiteDatabase(dbPath))
                {
                    var docFilesTable = dblocal.GetCollection<DocFile>("DocFiles").FindAll().ToList().Where(df => df.DocID == docId);
                    
                    foreach(var file in docFilesTable)
                    {
                        file.FileExists = System.IO.File.Exists(GetPathAndFilename(file.Name + file.Extension));
                    }
                    result.Data = docFilesTable;
                    result.Success = true;
                }
            }
            catch (System.Exception ex)
            {
                result.Data = ex;
            }

            return result;
        }
        [Route("UpsertDocFile")]
        [HttpPost]
        public Result UpsertDocFile([FromBody]DocFile docFile)
        {
            var result = new Result();

            try
            {
                using (var dblocal = new LiteDatabase(dbPath))
                {
                    var docsTable = dblocal.GetCollection<DocFile>("DocFiles");
                    docsTable.Upsert(docFile);
                    result.Success = true;
                }
            }
            catch (System.Exception ex)
            {
                result.Data = ex;
            }

            return result;
        }

        //// GET: api/Docs/5
        //[ResponseType(typeof(Doc))]
        //public IHttpActionResult GetDoc(int id)
        //{
        //    Doc doc = db.Docs.Find(id);
        //    if (doc == null)
        //    {
        //        return NotFound();
        //    }

        //    return Ok(doc);
        //}

        //// PUT: api/Docs/5
        //[ResponseType(typeof(void))]
        //public IHttpActionResult PutDoc(int id, Doc doc)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    if (id != doc.DocID)
        //    {
        //        return BadRequest();
        //    }

        //    db.Entry(doc).State = EntityState.Modified;

        //    try
        //    {
        //        db.SaveChanges();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!DocExists(id))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return StatusCode(HttpStatusCode.NoContent);
        //}

        //// POST: api/Docs
        //[ResponseType(typeof(Doc))]
        //public IHttpActionResult PostDoc(Doc doc)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    db.Docs.Add(doc);
        //    db.SaveChanges();

        //    return CreatedAtRoute("DefaultApi", new { id = doc.DocID }, doc);
        //}

        //// DELETE: api/Docs/5
        //[ResponseType(typeof(Doc))]
        //public IHttpActionResult DeleteDoc(int id)
        //{
        //    Doc doc = db.Docs.Find(id);
        //    if (doc == null)
        //    {
        //        return NotFound();
        //    }

        //    db.Docs.Remove(doc);
        //    db.SaveChanges();

        //    return Ok(doc);
        //}

        //protected override void Dispose(bool disposing)
        //{
        //    if (disposing)
        //    {
        //        db.Dispose();
        //    }
        //    base.Dispose(disposing);
        //}

        //private bool DocExists(int id)
        //{
        //    return db.Docs.Count(e => e.DocID == id) > 0;
        //}
    }
}