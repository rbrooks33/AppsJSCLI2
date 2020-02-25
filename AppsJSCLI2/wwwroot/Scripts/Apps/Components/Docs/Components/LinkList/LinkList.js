define([], function () {
    var Me = {
        Enabled: true,
        Color: 'blue',
        Name: 'LinkList',
        UniqueID: null, //Primary key
        Items: [], //Collection of items
        Doc: null, 
        DocType: null,
        Initialize: function () {

        },
        Show: function(doc, docType)
        {
            Me.Doc = doc;
            Me.DocType = docType;

            Apps.Debug.Trace(this);

            Apps.UI.LinkList.Show();

            $('#spanLinkListTitle').text(doc.docTitle + ' Doc Links');

            Me.Event('refresh_LinkList');
        },
        Hide: function()
        {
            Apps.Debug.Trace(this);
            Apps.UI.LinkList.Hide();
        },
        Event: function (sender, args, callback)
        {
            //TODO: change pages to components if a top-level
            Apps.Debug.Trace(this, 'LinkList Event: ' + sender);

            switch (sender)
            {
                case 'view':

                    Me.Show();
                    break;

                case 'hide':

                    Apps.Pages.LinkList.Hide();
                    break;

                case 'refresh_LinkList':

                    $('#divLinkListTable').empty();

                    Apps.RegisterDataSingle({ name: 'Docs_DocLinks', path: Apps.Settings.WebRoot + '/api/Docs/GetDocLinks?docId=' + Me.Doc.docID }, function () {

                        Me.Items = Apps.Data.Docs_DocLinks.data; // Apps.Util.Linq(Apps.Data.LinkListItems, '$.UniqueID === ' + Me.UniquID); // + ' && $.Archived === false');
                        //Me.SoftwareRequirements = Enumerable.From(Me.SoftwareRequirements).OrderBy(function (sr) { return sr.Order }).ToArray();

                        var table = Apps.Grids.GetTable({
                            title: ' ',
                            data: Me.Items,
                            tableactions: [
                                {
                                    text: 'Add LinkList Item', actionclick: function () {
                                        Apps.Pages.LinkList.Event('add_item');
                                    }
                                },
                                {
                                    text: 'D3 View', actionclick: function () {
                                        Apps.Pages.LinkList.Event('show_d3');
                                    }
                                }

                            ],
                            //rowbuttons: [
                            //    {
                            //        text: 'Remove', buttonclick: function (td, rowdata) {
                            //            Apps.Pages.LinkList.Item = JSON.parse(rowdata);
                            //            Apps.Pages.LinkList.Event('remove_item');
                            //        }
                            //    }
                            //],
                            fields: [
                                { name: 'docLinkID' },
                                { name: 'childTitle' },
                                { name: 'childContent' },
                                {
                                    name: 'parentDocTypeID',
                                    editclick: function (td, rowdata, editControl) { },
                                    saveclick: function (td, item, editControl) {
                                        Apps.Pages.LinkList.Event('save_item', arguments);
                                    }
                                },
                                { name: 'parentDocID' },
                                { name: 'childLastUpdated' }

                            ],
                            columns: [
                                { fieldname: 'docLinkID', text: 'Link ID', hidden: false },
                                { fieldname: 'childTitle', text: 'Title', hidden: false },
                                { fieldname: 'childContent', text: 'Content', hidden: false },
                                { fieldname: 'parentDocTypeID', text: 'Parent Doc Type' },
                                { fieldname: 'parentDocID', text: 'Parent Doc ID' },
                                { fieldname: 'childLastUpdated', text: 'Last Updated' }
                            ]
                        });

                        $('#divLinkListTable').append(table);

                    });

                    break;

                case 'add_item':

                    //Show list of existing doc types
                                    //Doc types for creating new link (TODO: rename to doctype picker)
                    Apps.RegisterPage({ name: 'LinkPicker', pageroot: Apps.Settings.AppsRoot + '/Components/Docs/Modules' }, function () {

                        Apps.Pages.LinkPicker.Show(Me.Doc, Me.DocType);

                    });



                    break;

                case 'save_item':

                    var tp = args[1];
                    tp.Field1 = $(args[2]).val(); //edit control

                    Apps.Util.PutWithData('api/LinkListItems/' + tp.UniqueID, JSON.stringify(tp), function (error, result) {

                        Apps.Debug.HandleError2(error, 'Failed to save.', JSON.stringify(result), 'Saved!', function () {

                            Apps.Pages.LinkList.Event('refresh_LinkList');

                        });
                    });

                    break;

                case 'remove_item':

                    //TODO
                    Me.Item = JSON.parse(Me.Item);
                    Me.Item.Archived = true;

                    Apps.Util.PutWithData('api/LinkListItems/' + Me.UniqueID, JSON.stringify(Me.Item), function (error, result) {

                        Apps.Debug.HandleError2(error, 'Failed to remove software requirement.', JSON.stringify(result), 'Item removed.', function () {

                            Apps.Pages.LinkList.Event('refresh_LinkList');

                        });
                    });

                    break;

                case 'show_d3':

                    Apps.Components.Docs.ShowD3(Me.Items);
                    Me.Hide();

                    break;
            }
        }

    };
    return Me;
})