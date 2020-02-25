define([], function () {
    var Me = {
        Enabled: true,
        Color: 'blue',
        Name: 'DocTypes',
        UniqueID: null, //Primary key
        Items: [], //Collection of items
        Item: null, //Represents a single item in collection
        Initialize: function () {

        },
        Show: function()
        {
            Apps.Debug.Trace(this);

            Apps.UI.DocTypes.Show();

            $('#spanDocTypesTitle').text('Doc Types');
            $('#spanDocTypesUrl').text('Where to get this computer\'s latest document types: "' + Apps.Settings.WebRoot + '/api/Docs/GetDocTypes"').css('font-style','italic');

            Apps.Pages.DocTypes.Event('refresh_DocTypes');
        },
        Hide: function()
        {
            Apps.Debug.Trace(this);
            Apps.UI.DocTypes.Hide();
        },
        Event: function (sender, args, callback)
        {
            //TODO: change pages to components if a top-level
            Apps.Debug.Trace(this, 'DocTypes Event: ' + sender);

            switch (sender)
            {
                case 'view':

                    Me.Show();
                    break;

                case 'hide':

                    Apps.Pages.DocTypes.Hide();
                    break;

                case 'refresh_DocTypes':

                    $('#divDocTypesTable').empty();

                    Apps.RegisterDataSingle({ name: 'DocsDocTypes', path: Apps.Settings.WebRoot + '/api/Docs/GetDocTypes' }, function () {

                        Me.Items = Apps.Data.DocsDocTypes.Data; // Apps.Util.Linq(Apps.Data.DocTypesItems, '$.UniqueID === ' + Me.UniquID); // + ' && $.Archived === false');

                        $.each(Me.Items, function (id, i) {
                            if (i.Name === null)
                                i.Name = 'no name';
                            if (i.Description === null)
                                i.Description = 'no desc';
                            if (i.SearchURL === null)
                                i.SearchURL = 'no url';
                            if (i.GetDocURL === null)
                                i.GetDocURL = 'no url';
                            if (i.CreateLinkJS === null)
                                i.CreateLinkJS = 'no js';
                            if (i.Logo === null)
                                i.Logo = 'no logo';
                        });

                        var table = Apps.Grids.GetTable({
                            title: ' ',
                            data: Me.Items,
                            tableactions: [
                                {
                                    text: 'Add DocTypes Item', actionclick: function () {
                                        Apps.Pages.DocTypes.Event('add_item');
                                    }
                                }
                            ],
                            rowbuttons: [
                                {
                                    text: 'Go', buttonclick: function (td, rowdata) {
                                        let docType = JSON.parse(rowdata);
                                        Apps.AutoComponents.Docs.DocTypeID = docType.DocTypeID; 
                                        Apps.AutoComponents.Docs.DocType = docType;
                                        Apps.AutoComponents.Docs.Event('open');
                                    }
                                }
                            ],
                            fields: [
                                {
                                    name: 'DocTypeID'
                                },

                                {
                                    name: 'Name',

                                    editclick: function (td, rowdata, editControl) { },
                                    saveclick: function (td, item, editControl) {
                                        arguments[1].name = $(arguments[2]).val();
                                        Apps.Pages.DocTypes.Event('save', arguments[1]);
                                    }
                                }, {
                                    name: 'Description', editclick: function (td, rowdata, editControl) { },
                                    saveclick: function (td, item, editControl) {
                                        arguments[1].Description = $(arguments[2]).val();
                                        Apps.Pages.DocTypes.Event('save', arguments[1]);
                                    }
                                }, {
                                    name: 'SearchURL', editclick: function (td, rowdata, editControl) { },
                                    saveclick: function (td, item, editControl) {
                                        arguments[1].SearchURL = $(arguments[2]).val();
                                        Apps.Pages.DocTypes.Event('save', arguments[1]);
                                    }
                                },
                                {
                                    name: 'GetDocURL', editclick: function (td, rowdata, editControl) { },
                                    saveclick: function (td, item, editControl) {
                                        arguments[1].GetDocURL = $(arguments[2]).val();
                                        Apps.Pages.DocTypes.Event('save', arguments[1]);
                                    }
                                },
                                {
                                    name: 'CreateLinkJS', editclick: function (td, rowdata, editControl) { },
                                    saveclick: function (td, item, editControl) {
                                        arguments[1].CreateLinkJS = $(arguments[2]).val();
                                        Apps.Pages.DocTypes.Event('save', arguments[1]);
                                    }
                                },
                                {
                                    name: 'Logo', editclick: function (td, rowdata, editControl) { },
                                    saveclick: function (td, item, editControl) {
                                        arguments[1].Logo = $(arguments[2]).val();
                                        Apps.Pages.DocTypes.Event('save', arguments[1]);
                                    }
                                }

                            ],
                            columns: [
                                { fieldname: 'DocTypeID', text: 'ID', hidden: false },
                                { fieldname: 'Name', text: 'Name' },
                                { fieldname: 'Description', text: 'Description' },
                                { fieldname: 'SearchURL', text: 'Search URL', hidden: false },
                                { fieldname: 'GetDocURL', text: 'Get Doc URL', hidden: false },
                                { fieldname: 'CreateLinkJS', text: 'Create Link URL', hidden: false },
                                {
                                    fieldname: 'Logo', text: 'Logo', format: function (docType) {

                                        if (docType.Logo.startsWith('data:'))
                                            return '<img src="' + docType.logo + '" style="width:20px;height:20px;" />';
                                        else
                                            return 'no image';
                                    }

                                }
                            ]
                        });

                        $('#divDocTypesTable').append(table);

                    });

                    break;

                case 'add_item':

                    let newDocType = {
                        Name: 'no name',
                        Description: 'no desc',
                        URL: Apps.Settings.WebRoot + '/api/Docs/DocTypes',
                        Logo: 'no logo'
                    };

                    Apps.Util.PostWithData(Apps.Settings.WebRoot + '/api/Docs/UpsertDocType', JSON.stringify(newDocType), function (error, result) {

                        Apps.Debug.HandleError2(error, 'Failed to create.', JSON.stringify(result), 'Created!', function () {

                            Apps.Pages.DocTypes.Event('refresh_DocTypes');

                        });
                    });

                    break;

                case 'save':

                   
                    Apps.Util.PostWithData(Apps.Settings.WebRoot + '/api/Docs/UpsertDocType', JSON.stringify(args), function (error, result) {

                        Apps.Debug.HandleError2(error, 'Failed to save.', JSON.stringify(result), 'Saved!', function () {

                            Apps.Pages.DocTypes.Event('refresh_DocTypes');

                        });
                    });

                    break;

                case 'get_doctypes':


            }
        }

    };
    return Me;
})