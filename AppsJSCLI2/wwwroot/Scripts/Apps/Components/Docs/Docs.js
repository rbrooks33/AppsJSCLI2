define(['./handlers.js'], function (Handlers) {
    var Me = {
        Name: 'Docs',
        Description: 'Produce a view of documentation for a particular project.',
        Color: 'purple',
        Enabled: true,
        Handlers: Handlers,
        DocTypeID: 1, //See https://localhost:44326/api/Docs/GetDocTypes
        Project: null,
        Doc: null,
        ParentDocID: -1, //Used to maintain view across editing different docs and children
        DocType: null,
        Customer: null,
        Software: null,
        ShowArchived: false,
        DocsTags: [],
        DocReviews: [],
        DisplayLevels: 0, //Default
        CurrentLevel: 0, //Global to allow incrementing up to DisplayLevels
        BaseLevel: 0, //Global to set the currently displayed parent as base
        Initialize: function (callback) {
            Apps.Debug.Trace(this, 'Start.');

            Apps.LoadTemplate('Docs', Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components/Docs/Docs.html', function () {

                Apps.LoadStyle(Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components/Docs/Docs.css');

                Apps.UI.Docs.Show();

                //$('#Index_DocsManager').html(Apps.UI.Docs.Selector);

                if (callback)
                    callback();

            });

        },
        Show: function () {

            Apps.Debug.Trace(this);

            //var pagesRoot = Apps.Settings.AppsRoot + '/Components/Docs/Modules';
            //Apps.RegisterPages([
            //    { name: 'DocsEdit', pageroot: pagesRoot },
            //    { name: 'DocTypes', pageroot: pagesRoot },
            //    { name: 'LinkList', pageroot: pagesRoot },
            //    { name: 'DocViewer', pageroot: pagesRoot },
            //    { name: 'Tags', pageroot: pagesRoot },
            //    { name: 'DocMove', pageroot: pagesRoot }
            //]);


            Apps.Get(Apps.Settings.WebRoot + '/api/Docs/GetComputerName', function (error, result) {

                let computerName = result.Messages[0];

                Apps.Get('/api/Docs/GetAllDocTags', function (error, result) {

                    Me.DocTags = result.Data;

                    Me.RefreshReviews(function () {

                        Apps.Components.Docs.Handlers.Initialize("Local Docs");

                        Me.Event('show_level_changed');
                        
                        //Me.RefreshParentDocs();

                        $('#spanDocsTitle').html('This computer\'s (' + computerName + ') documents');
                        $('#spanDocsSubTitle').html('Doc Types are at ' + Apps.Settings.WebRoot + '/api/Docs/GetDocTypes').css('font-style', 'italic');

                        $('#txtDocIDSearch').off().on('keyup', function () {
                            Apps.Components.Docs.Event('search_docid');
                        });

                        $('#txtDocContentSearch').off().on('keyup', function () {
                            Apps.Components.Docs.Event('search_doccontent');
                        });



                    });
                });
            });

        },
        Hide: function () {
            Apps.UI.Docs.Hide();
            $('#divDocButtons').hide();
            Apps.Pages.DocTypes.Show();
        },
        RefreshParentDocs: function () {

            Apps.Debug.Trace(this);

            $("#divDocsContainer").empty();

            $('#divDocButtons').show();

            $('#btnBackToParent').hide();

            $('#divDocs_ParentName').text('');
            $('#divDocs_ParentContent').html('');
            $('#spanDocs_ParentName').hide();

            //Apps.Util.Get(Apps.Settings.WebRoot + '/api/Docs', function (error, result) {
            //Apps.RegisterDataSingle({ name: 'Docs', path: Apps.Settings.WebRoot + '/api/Docs/GetDocs' }, function () {
            Apps.Get2('/api/Docs/GetDocs', function (result) {

                var docs = Enumerable.From(result.Data)
                    .Where(function (d) { return d.Archived === false; })
                    .ToArray();

                //.Where(function (d) { return d.docTypeID === 2 && d.archived === false })
                //.OrderBy(function (s) { return s.ParentDocID; }).ToArray();

                Me.Docs = docs; //save these corns for later

                //GET DOCS WITH NO PARENT
                Me.CurrentLevel = 0; // Me.BaseLevel; //Reset level start

                var ulNoParent = Me.RefreshDocChildren(docs, -1, 0);
                $("#divDocsContainer").append(ulNoParent);

                //GET DOCS WITH PARENT
                //var ul = Me.RefreshDocChildren(docs, Me.Doc.DocID);
                //$("#divDocsContainer").append(ul);

                if (Me.Expanded)
                    Me.Expand();
                else
                    Me.Collapse();

                $.fn.jqte = Apps.JQTE;
                $(".editor").jqte();

            });

        },
        RefreshChildDocs: function (parentDocId) {

            Apps.Debug.Trace(this);

            $('#spanDocs_ParentName').off().on('click', function () {
                Me.Event('edit', escape(JSON.stringify(Me.Doc)));
            });
            $('#spanDocs_ParentName').show();

            $("#divDocsContainer").empty();

            $('#divDocButtons').show();

            $('#btnBackToParent').show();
            //$('#spanBackToParentName').text(Me.Doc.DocTitle);
            $('#divDocs_ParentName').text(Me.Doc.DocTitle);

            let content = !Me.Doc.DocContent ? '' : Me.Doc.DocContent.split("&nbsp;").join("").trim().length > 0 ? Me.Doc.DocContent : '';
            $('#divDocs_ParentContent').html(content);

            //Apps.Util.Get(Apps.Settings.WebRoot + '/api/Docs', function (error, result) {
            //Apps.RegisterDataSingle({ name: 'Docs', path: Apps.Settings.WebRoot + '/api/Docs/GetDocsByParent?parentDocId=' + parentDocId }, function () {
            Apps.Get2('api/Docs/GetDocsByParent?parentDocId=' + parentDocId, function (result) {

                //$("#divDocsContainer").empty(); //It appears some other collection is showing up

                var docs = Enumerable.From(result.Data)
                    .Where(function (d) { return d.Archived === false; })
                    .ToArray();

                //.Where(function (d) { return d.docTypeID === 2 && d.archived === false })
                //.OrderBy(function (s) { return s.ParentDocID; }).ToArray();

                Me.Docs = docs; //save these corns for later

                //GET DOCS WITH NO PARENT
                //var ulNoParent = Me.RefreshDocChildren(docs, -1);
                //$("#divDocsContainer").append(ulNoParent);

                //GET DOCS WITH PARENT
                Me.CurrentLevel = 0; // Me.BaseLevel; //Reset level start

                var ul = Me.RefreshDocChildren(docs, Me.Doc.DocID, 0);
                $("#divDocsContainer").append(ul);

                if (Me.Expanded)
                    Me.Expand();
                else
                    Me.Collapse();

                $.fn.jqte = Apps.JQTE;
                $(".editor").jqte();

            });

        },
        RefreshDocChildren: function (docs, parentId, depth) {

            Apps.Debug.Trace(this);

            var childDocs = Enumerable.From(docs)
                .Where(function (s) {
                    return s.ParentDocID === parentId;
                })
                .OrderBy(function (s) { return s.ParentDocID; })
                .ThenBy(function (s) { return s.Order; })
                .ToArray();

            $.each(childDocs, function (index, d) {
                d.Order = d.Order ? d.Order : 0;
            });

            var li = '<ul style="margin-left:-44px;">';

            $.each(childDocs, function (index, doc) {
                li += '<li id="li_' + doc.DocID + '" style="list-style:none;" draggable="true" ondragstart="Apps.Components.Docs.drag(event)" ondrop="Apps.Components.Docs.drop(event)" ondragover="Apps.Components.Docs.allowDrop(event)">';
                li += '<table style="-webkit-border-vertical-spacing: 0.5em;border-collapse:separate;width:100%;">';
                li += '    <tr>';
                li += '        <td class="Docs_DocTitleCell" onclick="Apps.Components.Docs.Event(\'show_child_docs\',' + doc.DocID + ');">';
                li += '            <span class="Docs_DocTitleTagsSpan">#' + doc.DocID + ' (' + doc.ChildCount + ' Docs)</span>';
                li += '            <br /><span class="Docs_DocTitleCellTitle">' + doc.DocTitle + '</span>';
                //li += doc.DocTitle;
                let docTagHtml = '';
                let docTags = Enumerable.From(Me.DocTags)
                    .Where(function (dt) {
                        return dt.DocID === doc.DocID && dt.TagID > 0;
                    })
                    .ToArray();

                $.each(docTags, function (index, tag) {
                    docTagHtml += '<span class="badge badge-light" style="float:right;">' + tag.TagName + '</span>';
                });
                li += docTagHtml;
                li += '        </td>';
                li += '        <td class="doccontent" style="font-size:18px;text-align:left;border:none;padding:5px;margin:3px;">';
                li += unescape(doc.DocContent);
                li += '        </td>';
                //li += '        <td style="text-align:center;vertical-align:top;width:2%;border:solid 1px lightgrey;padding:5px;font-size:11px;">';
                //li += '        </td>';
                //li += '        <td style="text-align:center;vertical-align:bottom;width:2%;border:none;padding:5px;">';
                //li += '          <span onclick="Apps.Components.Docs.Event(\'show_content\',' + doc.DocID + ');" class="fa fa-square-o" style="float:right;cursor:pointer;" />';
                //li += '          <span onclick="Apps.Components.Docs.Event(\'hide_content\',' + doc.DocID + ');" class="fa fa-bars" style="float:right;cursor:pointer;display:none;" />';
                //li += '        </td>';
                //li += '        <td style="text-align:center;vertical-align:top;width:10%;border:solid 1px lightgrey;padding:5px;font-size:11px;">';
                //li += 'Created ' + Apps.Util.FormatDateTime2(doc.Created);
                //li += '        </td>';
                //li += '        <td style="text-align:center;vertical-align:top; width:10%;border:solid 1px lightgrey;padding:5px;font-size:11px;">';
                //li += 'Updated ' + Apps.Util.FormatDateTime2(doc.Updated);
                //li += '        </td>';
                let opacity = doc.Archived ? .5 : 1;
                li += '        <td class="Docs_ButtonCell" style="opacity:' + opacity + ';">';
                li += '          <div class="btn-group">';
                li += '          <span onclick="Apps.Components.Docs.Event(\'show_content\',' + doc.DocID + ');" class="btn btn-primary fa fa-square-o" style="float:right;cursor:pointer;" />';
                li += '          <span onclick="Apps.Components.Docs.Event(\'hide_content\',' + doc.DocID + ');" class="btn btn-primary fa fa-bars" style="float:right;cursor:pointer;display:none;" />';
                //li += '          <span class="btn btn-primary" onclick="Apps.Components.Docs.Event(\'show_child_docs\',' + doc.DocID + ');">';
                //li += doc.ChildCount;
                //li += '          </span>';
                li += '            <span onclick="Apps.Components.Docs.Event(\'edit\',\'' + escape(JSON.stringify(doc)) + '\');" class="btn btn-primary fa fa-pencil-square-o"></span>';
                li += '            <span onclick="Apps.Components.Docs.Event(\'new_child\',\'' + doc.DocID + '\');" class="btn btn-primary fa fa-plus"></span>';
                li += '            <input type="button" onclick="Apps.Components.Docs.Event(\'doc_move\',\'' + escape(JSON.stringify(doc)) + '\');" class="btn btn-primary" value="..." />';

                let reviewCount = Enumerable.From(Me.DocReviews)
                    .Where(function (r) { return r.DocID === doc.DocID; })
                    .ToArray().length;

                let reviewOpacity = reviewCount > 0 ? 1 : .5;

                li += '          <input type="button" onclick="Apps.Components.Docs.Event(\'reviewed\',\'' + doc.DocID + '\');" class="btn btn-success" style="opacity:' + reviewOpacity + ';border-bottom:" value="' + reviewCount + '" />';
                if (!doc.Archived)
                    li += '            <input type="button" onclick="Apps.Components.Docs.Event(\'archive\',\'' + escape(JSON.stringify(doc)) + '\');" class="btn btn-danger" title="Live. Click to archive." value="A" />';
                else
                    li += '            <input type="button" onclick="Apps.Components.Docs.Event(\'unarchive\',\'' + escape(JSON.stringify(doc)) + '\');" class="btn btn-success" title="Archived. Click to restore." value="A" />';
                li += '          </div>';
                li += '        </td>';
                li += '    </tr>';
                li += '</table>';
                li += '</li>';

                Me.DisplayLevels = parseInt(Me.DisplayLevels);
                Me.BaseLevel = parseInt(Me.BaseLevel);

                //console.log('doc is ' + doc.DocTitle + '. current level is ' + depth + '. base (' + Me.BaseLevel + ') + displaylevels (' + Me.DisplayLevels + ') is ' + (Me.BaseLevel + Me.DisplayLevels));

                if (Me.DisplayLevels === -1 || Me.CurrentLevel < Me.DisplayLevels) {
               //     console.log('getting children');
                    Me.CurrentLevel++;
                    li += Me.RefreshDocChildren(docs, doc.DocID, depth + 1);
                }
               // else
                //    console.log('not getting children');

            });

            li += '</ul>';

            return li;
        },
        ShowDoc: function (docId) {
            let pagesRoot = Apps.Settings.AppsRoot + '/Components/Docs/Modules';

            Apps.RegisterPage({ name: 'DocViewer', pageroot: pagesRoot }, function () {
                Apps.NotifySuccess('page registered.');
                Apps.Pages.DocViewer.Show(docId);
            });

            event.cancelBubble = true;
        },
        CreateMyDoc: function (docTypeId, uniqueId, title, content, parentDocId, callback) {

            //local link list (when called from anything other than parent module need to init)
            //let selectedFeature = JSON.parse(args[1]);

            //Get my doc
            Apps.Util.Get(Apps.Settings.WebRoot + '/api/Docs/GetMyDoc?docTypeId=' + docTypeId + '&uniqueId=' + uniqueId, function (error, result) {

                if (!error && result.Success) {

                    if (result.Data.length === 1) //There should be only one doc represented by doc type and unique id
                    {
                        //SUCCESS: Load LinkList component to allow selection of doc type then find doc to link to
                        //Apps.RegisterPage({ name: 'LinkList', pageroot: Apps.Settings.AppsRoot + '/Components/Docs/Modules' }, function () {

                        let linkDoc = result.Data[0]; //existing doc

                        //Get this doc type
                        Apps.Util.Get(Apps.Settings.WebRoot + '/api/Docs/GetDocType?docTypeId=' + docTypeId, function (error, result) {

                            let linkDocType = result.Data[0]; //be careful here, this is doc and doctype of caller

                            if (callback)
                                callback(linkDoc, linkDocType);
                        });
                        // });
                    }
                    else if (result.Data.length === 0) {
                        //None created yet, create one
                        var doc = {
                            ProjectID: 0,
                            DocTypeID: docTypeId,
                            UniqueID: uniqueId,
                            DocTitle: title,
                            DocContent: content,
                            ParentDocID: parentDocId,
                            CreatedBy: 'Rodney'
                        };

                        //Save new doc
                        Apps.Util.PostWithData(Apps.Settings.WebRoot + '/api/Docs/UpsertDoc', JSON.stringify(doc), function (error, result) {
                            Apps.Notify('success', 'My Doc created!');

                            if (callback)
                                callback(result.Data);
                        });
                    }
                    else
                        Apps.Notify('warning', 'Problem. Returned ' + result.Data.length + ' matching doctype/uniqueids.');
                }
                else
                    Apps.Notify('warning', 'Problem getting doc for this feature.');
            });
        },
        CreateLink: function (calledDoc, calledDocType, callerDoc, callerDocType) {

            //Create a corresponding doc for the link (to help with d3 nodes and to support documentation)
            Apps.Components.Docs.CreateMyDoc(calledDoc.DocTypeID, calledDoc.UniqueID, calledDoc.DocTitle, calledDoc.DocContent, callerDoc.DocID, function (doc, docType) {

                let newDocLink = {
                    ParentTitle: callerDoc.DocTitle,
                    ParentDocTypeID: callerDocType.DocTypeID,
                    ParentDocID: callerDoc.DocID,
                    ParentGetDocURL: Apps.Settings.WebRoot + '/api/Docs/GetDoc?docId=' + callerDoc.DocID,
                    ChildDocTypeID: calledDoc.DocTypeID,
                    ChildDocID: doc.DocID, //new doc for child link (TODO: check for existing uniqueid/doctype?)
                    ChildGetDocURL: calledDocType.GetDocURL,
                    ChildServerURL: calledDocType.SearchURL,
                    ChildLastUpdated: Apps.Util.Now(),
                    ChildContent: calledDoc.DocContent,
                    ChildTitle: calledDoc.DocTitle
                };

                Apps.Util.PostWithData(Apps.Settings.WebRoot + '/api/Docs/UpsertDocLink', JSON.stringify(newDocLink), function (error, result) {

                    if (!error && result.Success)
                        Apps.Notify('success', 'Link created!');
                    else
                        Apps.Notify('warning', 'Trouble creating link!');

                });
            });
        },
        //ShowMyDocs: function (doc, docType) {

        //    Me.Doc = doc;
        //    Me.DocTypeID = docType.DocTypeID;

        //    Apps.RegisterPage({ name: 'DocsViewer', pageroot: Apps.Settings.AppsRoot + '/Components/Docs/Modules' }, function () {

        //        Apps.Pages.DocsViewer.Show(doc, docType);
        //        Me.RefreshMyDocs();

        //    });

        //},
        //RefreshMyDocs: function (callback) {

        //    Apps.RegisterPage({ name: 'DocsViewer', pageroot: Apps.Settings.AppsRoot + '/Components/Docs/Modules' }, function () {

        //        $("#divDocsViewerTable").empty();
        //        $('#divDocsViewer_DocLinks').empty();

        //        Apps.RegisterDataSingle({ name: 'Docs', path: Apps.Settings.WebRoot + '/api/Docs/GetDocsByParent?parentDocId=' + Me.Doc.DocID }, function () {

        //            var docs = Enumerable.From(Apps.Data.Docs.Data).ToArray();

        //            //.Where(function (d) { return d.docTypeID === 2 && d.archived === false })
        //            //.OrderBy(function (s) { return s.ParentDocID; }).ToArray();

        //            Me.Docs = docs; //save these corns for later

        //            //GET DOCS WITH NO PARENT
        //            var ulNoParent = Me.RefreshDocChildren(docs, -1);
        //            $("#divDocsViewerTable").append(ulNoParent);

        //            //GET DOCS WITH PARENT
        //            var ul = Me.RefreshDocChildren(docs, Me.Doc.DocID);
        //            $("#divDocsViewerTable").append(ul);

        //            Apps.Util.Get(Apps.Settings.WebRoot + '/api/Docs/GetDocLinksDocsByDocType?docTypeId=' + Me.DocTypeID, function (error, result) {

        //                var linkUL = Me.RefreshDocChildren(result.Data, Me.Doc.DocID);

        //                $('#divDocsViewer_DocLinks').append(linkUL);

        //                if (Me.Expanded)
        //                    Me.Expand();
        //                else
        //                    Me.Collapse();

        //                $.fn.jqte = Apps.JQTE;
        //                $(".editor").jqte();

        //                if (callback)
        //                    callback();
        //            });

        //        });
        //    });
        //},
        ShowLinkPicker: function (doc, docType) {

            Apps.RegisterPage({ name: 'LinkList', pageroot: Apps.Settings.AppsRoot + '/Components/Docs/Modules' }, function () {

                Apps.Pages.LinkList.Show(doc, docType);

            });

        },
        ShowD3: function (items) {

            Apps.RegisterPage({ name: 'D3', pageroot: Apps.Settings.AppsRoot + '/Components/Docs/Modules' }, function () {

                Apps.Pages.D3.Show(items);

            });
        },
        SearchDocs: function (searchTerm, callback) {
            //return html of search results
            //Apps.Block();
            Apps.Util.Get(Apps.Settings.WebRoot + '/api/Docs/SearchDocs?searchTerm=' + searchTerm, function (error, result) {

                //Create table
                let containerDiv = $('<div>');
                //containerDiv.append(Me.SearchDocsResult(result.data, -1));


                //Include docs whose parent was not returned
                //$.each(result.data, function (index, doc) {

                //    let parents = Enumerable.From(result.data).Where(function (m) { return m.docID === doc.parentDocID; }).ToArray();
                //    if (parents.length === 0)
                //        containerDiv.append(Me.SearchDocsResult(result.data, doc.parentDocID));
                //});

                //No parent
                //containerDiv.append(Me.SearchDocsResult(result.data, 0));

                let distinctParents = Enumerable.From(result.Data).Distinct(function (p) { return p.ParentDocID; }).ToArray();

                $.each(distinctParents, function (index, parent) {
                    containerDiv.append(Me.SearchDocsResult(result.Data, parent.DocID));
                });

                if (callback)
                    callback(containerDiv.html());

                //Apps.UnBlock();
            });
        },
        SearchDocsResult: function (docs, parentId) {

            var childDocs = Enumerable.From(docs)
                .Where(function (s) {
                    return s.ParentDocID === parentId;
                }).OrderBy(function (s) { return s.ParentDocID; }).ToArray();

            var li = '<ul>';

            var doneDocs = [];

            $.each(childDocs, function (index, doc) {

                let isDoneDocs = Enumerable.From(doneDocs).Where(function (dd) { return dd.DocID === doc.DocID; }).ToArray();

                if (isDoneDocs.length === 0) {

                    li += '<li id="li_' + doc.DocID + '" style="list-style:none;" draggable="true" ondragstart="Apps.Components.Docs.drag(event)" ondrop="Apps.Components.Docs.drop(event)" ondragover="Apps.Components.Docs.allowDrop(event)">';
                    li += '<table style="-webkit-border-vertical-spacing: 0.5em;border-collapse:separate;width:100%;">';
                    li += '    <tr>';
                    li += '        <td style="text-align:left;vertical-align:top;width:150px;border:solid 1px lightgrey;padding:5px;font-size:25px;">';
                    li += doc.DocTitle;
                    li += '        </td>';
                    //if (doc.parentDocID === -1) { //Parent doc
                    //    li += '        <td style="text-align:left;vertical-align:top;width:150px;border:solid 1px lightgrey;padding:5px;font-size:25px;">';
                    //    li += doc.docTitle;
                    //    li += '        </td>';
                    //}
                    li += '        <td class="doccontent" style="text-align:left;border:solid 1px lightgrey;padding:5px;margin:3px;">';
                    li += unescape(doc.DocContent);
                    li += '        </td>';
                    li += '        <td style="text-align:center;vertical-align:top;width:10%;border:solid 1px lightgrey;padding:5px;font-size:11px;">';
                    li += 'Created ' + Apps.Util.FormatDateTime2(doc.Created);
                    li += '        </td>';
                    li += '        <td style="text-align:center;vertical-align:top; width:10%;border:solid 1px lightgrey;padding:5px;font-size:11px;">';
                    li += 'Updated ' + Apps.Util.FormatDateTime2(doc.Updated);
                    li += '        </td>';
                    //li += '        <td style="text-align:left;width:5%;border:solid 1px lightgrey;padding:5px;">';
                    //li += '            <input type="button" onclick="Apps.Components.Docs.Event(\'edit\',\'' + escape(JSON.stringify(doc)) + '\');" class="btn btn-primary" value="Edit" />'
                    //li += '        </td>';
                    li += '    </tr>';
                    li += '</table>';
                    li += '</li>';
                    li += Me.RefreshDocChildren(docs, doc.DocID);

                    doneDocs.push(doc);
                }
            });

            li += '</ul>';

            return li;
        },
        GetDocTypeByDocID: function (docId, callback) {

            Apps.Util.Get(Apps.Settings.WebRoot + '/api/Docs/GetDocTypeByDocID?docId=' + docId, function (error, result) {

                if (callback)
                    callback(result.Data);

            });

        },
        Refresh: function () {

            Apps.Debug.Trace(this);

            //if (Me.DocTypeID === 2)
            //    Me.RefreshProjectDocs(Me.Project);
            //else if (Me.DocTypeID === 3)
            //    Me.RefreshCustomerDocs(Me.Customer);
            //else if (Me.DocTypeID === 4)
            //    Me.RefreshSoftwareDocs(Me.Software);
            Me.RefreshDocs();
        },
        RefreshDocs: function () {

            Apps.Debug.Trace(this);

            $("#divDocsContainer").empty();

            $('#divDocButtons').show();

            //Apps.Util.Get(Apps.Settings.WebRoot + '/api/Docs', function (error, result) {
            Apps.RegisterDataSingle({ name: 'Docs', path: Apps.Settings.WebRoot + '/api/Docs/GetDocs?docTypeId=' + Me.DocTypeID }, function () {

                var docs = Enumerable.From(Apps.Data.Docs.Data).ToArray();

                //.Where(function (d) { return d.docTypeID === 2 && d.archived === false })
                //.OrderBy(function (s) { return s.ParentDocID; }).ToArray();

                Me.Docs = docs; //save these corns for later

                //GET DOCS WITH NO PARENT
                var ulNoParent = Me.RefreshDocChildren(docs, -1, 0);
                $("#divDocsContainer").append(ulNoParent);

                //GET DOCS WITH PARENT
                var ul = Me.RefreshDocChildren(docs, -1, 0);
                $("#divDocsContainer").append(ul);

                if (Me.Expanded)
                    Me.Expand();
                else
                    Me.Collapse();

                //require([Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/references/jquery-te-1.4.0.min.js'], function (jqte) {
                //    if(jQuery.fn.jqte)
                //        $(".editor").jqte();
                //});
                $.fn.jqte = Apps.JQTE;
                $(".editor").jqte();

            });

        },
        Expanded: false,
        Expand: function () {
            Me.Expanded = true;
            $('.doccontent').show();
            $('#btnExpand').addClass('active');
            $('#btnCollapse').removeClass('active');
        },
        Collapse: function () {
            Me.Expanded = false;
            $('.doccontent').hide();
            $('#btnExpand').removeClass('active');
            $('#btnCollapse').addClass('active');

        },
        allowDrop: function (ev) {
            ev.preventDefault();
        },

        drag: function (ev) {
            ev.dataTransfer.setData("text", ev.target.id);
        },

        drop: function (ev) {

            ev.preventDefault();
            var data = ev.dataTransfer.getData("text");
            //ev.target.appendChild(document.getElementById(data));
            //Make dropped id a child of target id
            var parentId = ev.currentTarget.id.split('_')[1];
            var docId = data.split('_')[1];

            var doc = Apps.Util.Linq(Apps.Components.Docs.Docs, '$.DocID === ' + docId);
            var parentDoc = Apps.Util.Linq(Apps.Components.Docs.Docs, '$.DocID === ' + parentId);

            if (doc.length === 1) {

                if (doc[0].DocID !== parseInt(parentId)) { //self and parent can't be same

                    doc[0].ParentDocID = parentId; //change parent id


                    //var url = Apps.Settings.WebRoot + '/api/Docs/' + doc[0].docID;
                    //Apps.Util.PutWithData(url, JSON.stringify(doc[0]), function (error, result) {
                    var url = Apps.Settings.WebRoot + '/api/Docs/UpsertDoc'; //?id=0&softwareId=' + Master.Util.QueryString["softwareId"] + '&title=[edit]&content=[edit]&parentId=0';
                    Apps.Util.PostWithData(url, JSON.stringify(doc[0]), function (error, result) {

                        //Update this document's links also to new parent....NAY, create a new link!
                        //Apps.Util.Get(Apps.Settings.WebRoot + '/api/Docs/GetDocLinks?', )
                        Me.GetDocTypeByDocID(doc[0].DocID, function (childDocType) {

                            Me.GetDocTypeByDocID(parentId, function (parentDocType) {

                                Me.CreateLink(doc[0], childDocType[0], parentDoc[0], parentDocType[0]);

                            });
                        });

                        Me.Event('refresh');
                    });
                }
            }
            Me.Refresh();

        },
        Add: function () {

            //var me = Apps.Components.Docs;
            //var projectId = 0; 
            //if (me.DocTypeID === 2)
            //    projectId = me.Project.ProjectID;
            //else if (me.DocTypeID === 3)
            //    projectId = me.Customer.CustomerID;
            //else if (me.DocTypeID === 4)
            //    projectId = me.Software.SoftwareID;

            var doc = {
                ProjectID: 0,
                DocTypeID: Me.DocTypeID,
                UniqueID: 0,
                DocTitle: '[NEW]',
                DocContent: '[NEW]',
                ParentDocID: -1,
                CreatedBy: 'Rodney'
            };

            var url = Apps.Settings.WebRoot + '/api/Docs/UpsertDoc'; //?id=0&softwareId=' + Master.Util.QueryString["softwareId"] + '&title=[edit]&content=[edit]&parentId=0';
            Apps.Util.PostWithData(url, JSON.stringify(doc), function (error, result) {
                Me.Refresh();
                Apps.UI.DocsEdit.Hide();
            });

        },
        AddChildDoc: function () {

            //var me = Apps.Components.Docs;
            //var projectId = 0; 
            //if (me.DocTypeID === 2)
            //    projectId = me.Project.ProjectID;
            //else if (me.DocTypeID === 3)
            //    projectId = me.Customer.CustomerID;
            //else if (me.DocTypeID === 4)
            //    projectId = me.Software.SoftwareID;

            var doc = {
                ProjectID: 0,
                DocTypeID: Me.Doc.DocTypeID,
                UniqueID: 0,
                DocTitle: '[NEW]',
                DocContent: '[NEW]',
                ParentDocID: Me.Doc.DocID,
                CreatedBy: 'Rodney'
            };

            var url = Apps.Settings.WebRoot + '/api/Docs/UpsertDoc'; //?id=0&softwareId=' + Master.Util.QueryString["softwareId"] + '&title=[edit]&content=[edit]&parentId=0';
            Apps.Util.PostWithData(url, JSON.stringify(doc), function (error, result) {
                Me.RefreshChildDocs(Me.Doc.DocID);
            });

        },
        Save: function (doc) {

            Apps.Debug.Trace(this, 'Using docid: ' + doc.DocID);

            Me.Doc = doc;
            doc.DocTitle = $('#txtDocTitle').val();
            doc.DocContent = $('.jqte_editor').html();
            doc.Updated = Apps.Util.GetSqlDateTime(new Date());

            var url = Apps.Settings.WebRoot + '/api/Docs/UpsertDoc'; //?id=0&softwareId=' + Master.Util.QueryString["softwareId"] + '&title=[edit]&content=[edit]&parentId=0';
            Apps.Util.PostWithData(url, JSON.stringify(doc), function (error, result) {

                Me.Event('back_to_parent');

                Apps.RegisterPage({ name: 'DocsEdit', pageroot: Apps.Settings.AppsRoot + '/Components/Docs/Modules' }, function () {
                    Apps.UI.DocsEdit.Hide();
                });
            });
        },
        Cancel: function () {
            Apps.Grids.EditClose("docs");
        },
        HandleResult: function (error, result, successCallback) {
            if (!error) {
                if (result.Success) {
                    if (successCallback)
                        successCallback();
                }
                else
                    console.warn("Ajax unsuccessful. Message: " + result.Message);
            }
            else
                console.warn("Ajax error. Message: " + result.textResponse);
        },
        RefreshReviews: function (callback) {
            Apps.Get('/api/Docs/GetAllDocReviews', function (error, result) {
                Me.DocReviews = result.Data;
                if (callback)
                    callback();
            });
        },
        Event: function (sender, args) {

            Apps.Debug.Trace(this, sender);

            switch (sender) {

                case 'open':

                    //args is doctype obj
                    Apps.Pages.DocTypes.Hide();
                    Apps.Components.Docs.RefreshDocs(args);
                    $('#spanDocsTitle').text(Me.DocType.Name);

                    break;

                case 'edit':

                    //args is doctype obj
                    Apps.RegisterPage({ name: 'DocsEdit', pageroot: Apps.Settings.AppsRoot + '/Components/Docs/Modules' }, function () {

                        Apps.Pages.DocsEdit.Show(args);

                    });


                    break;

                case 'graph':

                    let graphDoc = JSON.parse(unescape(args));

                    Me.GetDocTypeByDocID(graphDoc.DocID, function (docType) {
                        Apps.RegisterPage({ name: 'LinkList', pageroot: Apps.Settings.AppsRoot + '/Components/Docs/Modules' }, function () {
                            Apps.Components.Docs.Hide();
                            Apps.Pages.LinkList.Show(graphDoc, docType[0]);
                        });
                    });

                    break;

                case 'show_content':

                    $('#li_' + args + ' > table .doccontent').show(400);
                    $('#li_' + args + ' > table .fa-square-o').hide();
                    $('#li_' + args + ' > table .fa-bars').show();

                    break;

                case 'hide_content':

                    $('#li_' + args + ' > table .doccontent').hide(400);
                    $('#li_' + args + ' > table .fa-square-o').show();
                    $('#li_' + args + ' > table .fa-bars').hide();

                    break;

                case 'send_to_top':

                    let sendToTopDoc = JSON.parse(unescape(args));
                    sendToTopDoc.Order -= .1;

                    Apps.Post(Apps.Settings.WebRoot + '/api/Docs/UpsertDoc', JSON.stringify(sendToTopDoc), function (error, result) {

                        Me.Event('refresh');

                    });

                    break;

                case 'archive':

                    if (confirm('Sure?')) {
                        let archiveDoc = JSON.parse(unescape(args));
                        archiveDoc.Archived = true;

                        Apps.Post(Apps.Settings.WebRoot + '/api/Docs/UpsertDoc', JSON.stringify(archiveDoc), function (error, result) {

                            Apps.Notify('success', 'Document was archived.');
                            Me.Event('refresh');

                        });
                    }
                    break;

                case 'unarchive':

                    if (confirm('Sure?')) {
                        let archiveDoc = JSON.parse(unescape(args));
                        archiveDoc.Archived = false;

                        Apps.Util.PostWithData(Apps.Settings.WebRoot + '/api/Docs/UpsertDoc', JSON.stringify(archiveDoc), function (error, result) {

                            Apps.Notify('success', 'Document was archived.');
                            Me.Event('refresh');
                        });
                    }
                    break;


                case 'search_docid':

                    let docIdString = $('#txtDocIDSearch').val();
                    if (Apps.Util.IsInt(docIdString)) {
                        Apps.Util.Get(Apps.Settings.WebRoot + '/api/Docs/GetDoc?docId=' + docIdString, function (error, result) {
                            if (!error && result.Success && result.Data.length > 0) {
                                let docsHtml = Me.RefreshDocChildren(result.Data, result.Data[0].ParentDocID, 0);
                                $("#divDocsContainer").html(docsHtml);
                            }
                            else
                                Apps.Notify('warning', 'Something wrong happened while doing search. No results?');
                        });
                    }
                    else {
                        Apps.Notify('warning', 'Not a number!');
                        Me.RefreshParentDocs();
                    }
                    break;

                case 'search_doccontent':

                    let docContentString = $('#txtDocContentSearch').val();

                    Apps.Util.Get(Apps.Settings.WebRoot + '/api/Docs/SearchDocs?searchTerm=' + docContentString, function (error, result) {

                        if (!error && result.Success && result.Data.length > 0) {
                            Apps.Notify('success', 'Search returned ' + result.Data.length + ' docs.');

                            var docs = Enumerable.From(Apps.Data.Docs.Data)
                                .Where(function (d) { return d.Archived === false; })
                                .ToArray();

                            Me.CurrentLevel = 0; // Me.BaseLevel; //Reset level start

                            var li = '<ul>';

                            $.each(docs, function (index, doc) {
                                li += '<li id="li_' + doc.DocID + '" style="list-style:none;" draggable="true" ondragstart="Apps.Components.Docs.drag(event)" ondrop="Apps.Components.Docs.drop(event)" ondragover="Apps.Components.Docs.allowDrop(event)">';
                                li += '<table style="-webkit-border-vertical-spacing: 0.5em;border-collapse:separate;width:100%;">';
                                li += '    <tr>';
                                li += '        <td style="text-align:left;vertical-align:top;width:150px;border:solid 1px lightgrey;padding:5px;font-size:25px;">';
                                li += '            <span style="font-size:10px;font-size: 10px;position: relative; top: -24px;left:-2px;">' + doc.DocID + ' #' + doc.Order + '</span>';
                                li += doc.DocTitle;
                                let docTagHtml = '';
                                let docTags = Enumerable.From(Me.DocTags).Where(function (dt) { return dt.DocID === doc.DocID; }).ToArray();
                                $.each(docTags, function (index, tag) {
                                    docTagHtml += '<span class="badge badge-light" style="float:right;">' + tag.TagName + '</span>';
                                });
                                li += docTagHtml;
                                li += '        </td>';
                                li += '        <td class="doccontent" style="font-size:18px;text-align:left;border:solid 1px lightgrey;padding:5px;margin:3px;">';
                                li += unescape(doc.DocContent);
                                li += '        </td>';
                                //li += '        <td style="text-align:center;vertical-align:top;width:2%;border:solid 1px lightgrey;padding:5px;font-size:11px;">';
                                //li += '        </td>';
                                li += '        <td style="text-align:center;vertical-align:top;width:2%;border:solid 1px lightgrey;padding:5px;font-size:11px;">';
                                li += '          <span onclick="Apps.Components.Docs.Event(\'show_content\',' + doc.DocID + ');" class="glyphicon glyphicon-menu-down" style="float:right;cursor:pointer;"><</span>';
                                li += '          <span onclick="Apps.Components.Docs.Event(\'hide_content\',' + doc.DocID + ');" class="glyphicon glyphicon-menu-up" style="float:right;cursor:pointer;display:none;">></span>';
                                li += '        </td>';
                                //li += '        <td style="text-align:center;vertical-align:top;width:10%;border:solid 1px lightgrey;padding:5px;font-size:11px;">';
                                //li += 'Created ' + Apps.Util.FormatDateTime2(doc.Created);
                                //li += '        </td>';
                                //li += '        <td style="text-align:center;vertical-align:top; width:10%;border:solid 1px lightgrey;padding:5px;font-size:11px;">';
                                //li += 'Updated ' + Apps.Util.FormatDateTime2(doc.Updated);
                                //li += '        </td>';
                                let opacity = doc.Archived ? .5 : 1;
                                li += '        <td style="opacity:' + opacity + ';text-align:right;vertical-align:top;width:13%;border:solid 1px lightgrey;padding:5px;">';
                                li += '          <div class="btn-group">';
                                li += '          <span class="btn btn-primary" onclick="Apps.Components.Docs.Event(\'show_child_docs\',' + doc.DocID + ');">';
                                li += doc.ChildCount;
                                li += '          </span>';
                                li += '            <input type="button" onclick="Apps.Components.Docs.Event(\'edit\',\'' + escape(JSON.stringify(doc)) + '\');" class="btn btn-primary" value="Edit" />';
                                li += '            <input type="button" onclick="Apps.Components.Docs.Event(\'new_child\',\'' + doc.DocID + '\');" class="btn btn-primary" value="New" />';
                                li += '            <input type="button" onclick="Apps.Components.Docs.Event(\'doc_move\',\'' + escape(JSON.stringify(doc)) + '\');" class="btn btn-primary" value="..." />';

                                let reviewCount = Enumerable.From(Me.DocReviews)
                                    .Where(function (r) { return r.DocID === doc.DocID; })
                                    .ToArray().length;

                                let reviewOpacity = reviewCount > 0 ? 1 : .5;

                                li += '          <input type="button" onclick="Apps.Components.Docs.Event(\'reviewed\',\'' + doc.DocID + '\');" class="btn btn-success" style="opacity:' + reviewOpacity + ';" value="' + reviewCount + '" />';
                                if (!doc.Archived)
                                    li += '            <input type="button" onclick="Apps.Components.Docs.Event(\'archive\',\'' + escape(JSON.stringify(doc)) + '\');" class="btn btn-danger" title="Live. Click to archive." value="A" />';
                                else
                                    li += '            <input type="button" onclick="Apps.Components.Docs.Event(\'unarchive\',\'' + escape(JSON.stringify(doc)) + '\');" class="btn btn-success" title="Archived. Click to restore." value="A" />';
                                li += '          </div>';
                                li += '        </td>';
                                li += '    </tr>';
                                li += '</table>';
                                li += '</li>';

                            });

                            li += '</ul>';

                            var searchHtml = li; //Me.RefreshDocChildren(docs, -1, 0);
                            $("#divDocsContainer").html(searchHtml);
                        }
                        else
                            Apps.Notify('warning', 'Something wrong happened while doing search. No results?');
                    });

                    break;

                case 'show_child_docs':

                    Me.BaseLevel++;

                    //Apps.Notify('success', 'base level: ' + Me.BaseLevel);

                    $('#btnAddProjectDoc').off().click(function (e) {
                        Apps.Components.Docs.AddChildDoc();
                    });

                    Apps.Util.Get(Apps.Settings.WebRoot + '/api/Docs/GetDoc?docId=' + args, function (error, result) {
                        Me.Doc = result.Data[0];
                        Me.ParentDocID = Me.Doc.ParentDocID;
                        Me.RefreshChildDocs(Me.Doc.DocID);
                    });

                    break;

                case 'back_to_parent':

                    Apps.Util.Get('/api/Docs/GetAllDocTags', function (error, result) {

                        Me.DocTags = result.Data;

                        Me.BaseLevel--;

                        //Apps.Notify('success', 'base level: ' + Me.BaseLevel);

                        Apps.Util.Get(Apps.Settings.WebRoot + '/api/Docs/GetDoc?docId=' + Me.Doc.ParentDocID, function (error, result) {

                            if (Me.Doc.ParentDocID === -1) {
                                Me.RefreshParentDocs();
                                $('#btnBackToParent').hide();
                                $('#divDocs_ParentName').text('');
                            }
                            else {
                                Me.Doc = result.Data[0];
                                Me.RefreshChildDocs(Me.ParentDocID);
                                $('#btnBackToParent').show();
                                $('#spanBackToParentName').text(Me.Doc.ParentDocID);
                            }
                        });
                    });
                    break;

                case 'show_archived_changed':

                    Me.ShowArchived = $('#chkShowArchived').prop('checked');

                    if (Me.Doc.ParentDocID === -1) {
                        Me.RefreshParentDocs();
                    }
                    else {
                        Me.RefreshChildDocs(Me.ParentDocID);
                    }

                    break;

                case 'new_child':

                    let newChildDocId = args;
                    let newChildDoc = {
                        DocTitle: '[new]',
                        ParentDocID: newChildDocId
                    };

                    var url = Apps.Settings.WebRoot + '/api/Docs/UpsertDoc';
                    Apps.Util.PostWithData(url, JSON.stringify(newChildDoc), function (error, result) {
                        Me.RefreshChildDocs(Me.ParentDocID);
                    });
                    break;

                case 'reviewed':

                    Apps.Util.Get('/api/Docs/DocReviewed?docId=' + args, function (error, result) {

                        Me.RefreshReviews(function () {

                            Me.Event('refresh');
                        });
                    });

                    break;

                case 'show_level_changed':

                    let showLevel = $('#Doc_selectShowLevels').val();

                    if (Apps.Util.IsInt(showLevel))
                        Me.DisplayLevels = parseInt(showLevel);

                    Me.Event('refresh');

                    break;

                case 'refresh':

                    Apps.Util.Get('/api/Docs/GetAllDocTags', function (error, result) {

                        Me.DocTags = result.Data;

                        if (Me.Doc) {
                            Me.RefreshChildDocs(Me.ParentDocID);
                        }
                        else {
                            Me.RefreshParentDocs(); //Needs to refresh the reviews data
                        }
                    });

                    break;

                case 'doc_move':

                    let moveDoc = JSON.parse(unescape(args));
                    Apps.Pages.DocMove.Show(moveDoc); 

                    break;

                case 'home':

                    Me.RefreshParentDocs();

                    break;

            }
        }

    };
    return Me;
});