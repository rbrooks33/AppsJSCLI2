define([], function () {
    var Me = {
        Enabled: true,
        Color: 'blue',
        Name: 'DocsViewer',
        UniqueID: null, //Primary key
        Doc: null,
        DocType: null, 
        Initialize: function () {

        },
        Show: function(doc, docType, reload)
        {
            Me.Doc = doc;
            Me.DocType = docType;

            Apps.Debug.Trace(this);

            if (reload) {

                Apps.LoadTemplate('DocsViewer', Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components/DocsViewer/DocsViewer.html?version=' + Apps.Util.Ticks, function () {

                    Apps.LoadStyle(Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components/DocsViewer/DocsViewer.css?version=' + Apps.Util.Ticks);
                    Apps.UI.DocsViewer.Show();

                });
            }
            else
                Apps.UI.DocsViewer.Show();

            $('#spanDocsViewerTitle').text(doc.docTitle);
            $('#spanDocsViewerSubTitle').text(docType.name + ' Notes');
        },
        Hide: function()
        {
            Apps.Debug.Trace(this);
            Apps.UI.DocsViewer.Hide();
        },
        OpenLocal: function (docId) {
            //Understood to be a function that opend a doc
            //hosted on this machine

        },
        Browse: function () {

        },
        Add: function () {

            var doc = {
                ProjectID: 0,
                DocTypeID: Me.DocType.docTypeID,
                UniqueID: 0,
                DocTitle: '[NEW]',
                DocContent: '[NEW]',
                ParentDocID: Me.Doc.docID,
                CreatedBy: 'Rodney'
            };

            var url = Apps.Settings.WebRoot + '/api/Docs/UpsertDoc'; //?id=0&softwareId=' + Master.Util.QueryString["softwareId"] + '&title=[edit]&content=[edit]&parentId=0';
            Apps.Util.PostWithData(url, JSON.stringify(doc), function (error, result) {
                Apps.Components.Docs.RefreshMyDocs();
            });

        },
        Event: function (sender, args, callback)
        {
            //TODO: change pages to components if a top-level
            Apps.Debug.Trace(this, 'DocsViewer Event: ' + sender);

            switch (sender) {
                case 'view':

                    Me.Show();
                    break;

                case 'hide':

                    Apps.Pages.DocsViewer.Hide();
                    break;

                case 'copy_url':


                    let value = Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components/Docs/Modules/DocsViewer/index.html?docId=' + Me.Doc.docID; //args;
                    let tempInput = document.createElement("input");
                    
                    tempInput.style = "position: absolute; left: -1000px; top: -1000px";
                    tempInput.value = value;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand("copy");
                    document.body.removeChild(tempInput);

                    Apps.Notify('success', 'Script tag copied to clipboard.');

                    break;

            }
        }

    };
    return Me;
})