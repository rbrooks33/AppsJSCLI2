define([], function () {
    var Me = {
        Enabled: true,
        Color: 'blue',
        Name: 'TestManagerSoftware',
        UniqueID: null, //Primary key
        Items: [], //Collection of items
        Item: null, //Represents a single item in collection
        DocTypeID: 2, //Vitacost software/features
        Doc: null,
        DocType: null,
        Initialize: function (callback) {

            Apps.Debug.Trace(this);

            Apps.LoadTemplate('TestManager', Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components/VitaTest/Components/TestManager/Components/TestManagerSoftware/TestManagerSoftware.html', function () {

                Apps.LoadStyle(Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components/VitaTest/Components/TestManager/Components/TestManagerSoftware/TestManagerSoftware.css');

                //Apps.UI.TestManagerSoftware.Drop();

                if (callback)
                    callback();

            });
            //var pagesRoot = Apps.Settings.AppsRoot + '/Components/VitaTest/Modules/TestManager/Modules/TestManagerSoftware/Modules';
            //Apps.RegisterPages(
            //    [
            //        { name: 'ViewConfigs', pageroot: pagesRoot },
            //        { name: 'ViewShopRunnerProducts', pageroot: pagesRoot }
            //    ]);




        },
        Show: function()
        {
            Apps.Debug.Trace(this);
            Apps.UI.TestManagerSoftware.Show();
        },
        Hide: function()
        {
            Apps.Debug.Trace(this);
            Apps.UI.TestManagerSoftware.Hide();
        },
        Table: function (callback) {

            //Apps.LoadTemplate('TestManagerSoftware', Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components/VitaTest/Modules/TestManager/Modules/TestManagerSoftware/TestManagerSoftware.html', function () {

            //    Apps.LoadStyle(Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components/VitaTest/Modules/TestManager/Modules/TestManagerSoftware/TestManagerSoftware.css');

                Apps.RegisterDataSingle({ name: 'TestManagerSoftware', path: Apps.Settings.WebRoot + '/api/VitaTest/GetSoftwares' }, function (result, data) {

                    let isLocal = document.location.origin.indexOf('localhost') > -1;

                    let unarchivedSoftware = Enumerable.From(Apps.Data.TestManagerSoftware.data)
                        .Where(function (tms) { return tms.archived === false && (tms.localHostOnly === false || (tms.localHostOnly && isLocal)); }).ToArray();
                    //Apps.Util.Get('api/VitaTest/GetTests?db=local', function (error, result) {

                        //$.each(unarchivedSoftware, function (si, s) {
                        //    let softwareTests = Enumerable.From(tests).Where('$.softwareID === ' + s.softwareID).ToArray();
                        //    s['TestCount'] = softwareTests.length;
                        //});

                        var table = Apps.Grids.GetTable({
                            title: '<span style="cursor:pointer;" onclick="Apps.Pages.TestManagerSoftware.Event(\'show_table\');">Vitacost Areas</span>',
                            data: unarchivedSoftware,
                            tableactions: [
                                {
                                    text: 'Add Area', actionclick: function () {
                                        Apps.Pages.TestManagerSoftware.Event('add_software');
                                    }
                                },
                                {
                                    text: 'Inventory & Availability', actionclick: function (td, rowdata) {
                                        Apps.Pages.VA505_CurrentProductRestrictions.Show();
                                    }
                                },
                                {
                                    text: 'Search Templates', actionclick: function (td, rowdata) {
                                        Apps.Components.VitaTemplates.Show();
                                    }
                                },
                                {
                                    text: 'View ShopRunner Products', actionclick: function (td, rowdata) {
                                        Apps.Pages.ViewShopRunnerProducts.Show();
                                    }
                                },
                                {
                                    text: 'View Configs', actionclick: function (td, rowdata) {
                                        Apps.Pages.ViewConfigs.Show();
                                    }
                                }

                            ],
                            rowbuttonwidthpercent: 25,
                            rowbuttons: [
                                {
                                    text: 'Features', buttonclick: function (td, rowdata) {
                                        Apps.Pages.TestManagerSoftware.Event('select_software', arguments);
                                    }
                                }
                                ,
                                {
                                    text: 'Docs', buttonclick: function (td, rowdata) {
                                        Apps.Pages.TestManagerSoftware.Event('show_docs', arguments);
                                    }
                                }
                                ,
                                {
                                    text: 'Links', buttonclick: function (td, rowdata) {
                                        Apps.Pages.TestManagerSoftware.Event('show_linklist', arguments);
                                    }
                                }
                                ,
                                {
                                    text: 'Archive', buttonclick: function (td, rowdata) {
                                        Apps.Pages.TestManagerSoftware.Event('remove_software', arguments);
                                    }
                                }
                           ],
                            fields: [
                                { name: 'softwareID' },
                                {
                                    name: 'softwareName',
                                    editclick: function (td, rowdata, editControl) { },
                                    saveclick: function (td, item, editControl) {
                                        Apps.Pages.TestManagerSoftware.Event('save_software_name', arguments);
                                    }
                                },
                                {
                                    name: 'host',
                                    editclick: function (td, rowdata, editControl) { },
                                    saveclick: function (td, item, editControl) {
                                        Apps.Pages.TestManagerSoftware.Event('save_host', arguments);
                                    }
                                },
                                { name: 'localHostOnly' }
                            ],
                            columns: [
                                { fieldname: 'softwareID', text: 'ID', hidden: true },
                                
                                { fieldname: 'softwareName', text: ' ' },
                                {
                                    fieldname: 'host', text: 'Host/URL', format: function (software) {
                                        if (software.host)
                                            return software.host;
                                        else
                                            return 'no host';
                                    }
                                },
                                {
                                    fieldname: 'localHostOnly', text: 'Local Only', format: function (software) {
                                        let checkedString = software.localHostOnly ? 'checked' : '';
                                        let softwareString = escape(JSON.stringify(software));
                                        return '<span style="cursor:pointer;"><input ' + checkedString + ' onchange="Apps.Pages.TestManagerSoftware.Event(\'localhostonly_changed\',[this,\'' + softwareString + '\']);" type="checkbox"></span>';
                                    }
                                }
                            ]
                        });

                        if (callback)
                            callback(table);
                  //  });
                });
           // });
        },
        Event: function (sender, args, callback)
        {
            Apps.Debug.Trace(this, 'TestManagerSoftware Event: ' + sender);

            switch (sender)
            {
                case 'view':

                    Me.Show();
                    break;

                case 'hide':

                    Apps.Components.TestManagerSoftware.Hide();
                    break;

                case 'select_software':

                    let selectedSoftware = JSON.parse(args[1]);

                    Apps.Pages.TestManager.SelectSoftware(selectedSoftware);

                    Me.Event('hide_table');

                    break;

                case 'add_software':

                    let newSoftware = {
                        softwareName: 'no name',
                        softwareTypeID: 1,
                        description: 'no description',
                        host: 'no host'
                    };

                    Apps.Util.PostWithData(Apps.Settings.WebRoot + '/api/VitaTest/AddSoftware?db=' + Apps.Settings.DB, JSON.stringify(newSoftware), function (error, result) {

                        Apps.Pages.TestManager.RefreshSoftware();

                    });
                    break;

                case 'save':



                    break;

                case 'save_software_name':

                    let software = args[1];

                    software.softwareName = $(args[2]).val();

                    Apps.Util.PostWithData(Apps.Settings.WebRoot + '/api/VitaTest/AddSoftware?db=' + Apps.Settings.DB, JSON.stringify(software), function (error, result) {

                        Apps.Pages.TestManager.RefreshSoftware();

                    });

                    break;

                case 'save_software_color':

                    let softwareColor = args[1];

                    software.color = $(args[2]).val();

                    Apps.Util.PostWithData(Apps.Settings.WebRoot + '/api/VitaTest/AddSoftware?db=' + Apps.Settings.DB, JSON.stringify(software), function (error, result) {

                        Apps.Pages.TestManager.RefreshSoftware();

                    });

                    break;

                case 'save_host':

                    let softwareForHost = args[1];

                    softwareForHost.host = $(args[2]).val();

                    Apps.Util.PostWithData(Apps.Settings.WebRoot + '/api/VitaTest/AddSoftware?db=' + Apps.Settings.DB, JSON.stringify(softwareForHost), function (error, result) {

                        Apps.Pages.TestManager.RefreshSoftware();

                    });

                    break;
               case 'remove_software':

                    if (confirm('Are you sure?')) {

                        let softwareToRemove = JSON.parse(args[1]);

                        softwareToRemove.archived = true;

                        Apps.Util.PostWithData(Apps.Settings.WebRoot + '/api/VitaTest/AddSoftware?db=' + Apps.Settings.DB, JSON.stringify(softwareToRemove), function (error, result) {

                            Apps.Pages.TestManager.RefreshSoftware();

                        });
                    }
                    break;

                case 'show_template_search':



                    break;

                case 'show_linklist':

                    let softwareToLink = JSON.parse(args[1]);

                    Apps.Components.Docs.CreateMyDoc(Me.DocTypeID, softwareToLink.softwareID, softwareToLink.softwareName, softwareToLink.description, -1, function (doc, docType) {

                        Apps.Components.Docs.ShowLinkPicker(doc, docType);

                    });

                    break;

                case 'show_docs':

                    let soft = JSON.parse(args[1]);

                    //Create doc for myself if needed
                    Apps.Components.Docs.CreateMyDoc(Me.DocTypeID, soft.softwareID, soft.softwareName, '', -1, function (doc, docType) {

                        Apps.Components.Docs.ShowMyDocs(doc, docType);

                    });

                    break;

                case 'hide_table':

                    $.each($('#divTestManager_Software').find('tr'), function (index, tr) {

                        if (index > 0)
                            $(tr).hide(400);
                    });

                    break;

                case 'show_table':

                    $.each($('#divTestManager_Software').find('tr'), function (index, tr) {

                        if (index > 0)
                            $(tr).show(400);
                    });

                    break;

                case 'localhostonly_changed':

                    let checkBox = args[0];
                    let softwareForLocalHostOnly = JSON.parse(unescape(args[1]));
                    let isChecked = $(checkBox).prop('checked');

                    softwareForLocalHostOnly.localHostOnly = isChecked;

                    Apps.Util.PostWithData(Apps.Settings.WebRoot + '/api/VitaTest/AddSoftware?db=' + Apps.Settings.DB, JSON.stringify(softwareForLocalHostOnly), function (error, result) {

                        Apps.Pages.TestManager.RefreshSoftware();

                    });

                    break;
            }
        }

    };
    return Me;
})