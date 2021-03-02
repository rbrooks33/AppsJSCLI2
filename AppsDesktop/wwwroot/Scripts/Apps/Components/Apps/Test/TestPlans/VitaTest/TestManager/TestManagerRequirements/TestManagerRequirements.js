define([], function () {
    var Me = {
        Enabled: true,
        Color: 'blue',
        Name: 'TestManagerRequirements',
        UniqueID: null, //Primary key
        Items: [], //Collection of items
        Software: null, //Represents a single item in collection
        DocTypeID: 5, //See https://localhost:44326/api/Docs/GetDocTypes
        Initialize: function () {

            Apps.Debug.Trace(this);

        },
        Show: function () {
            Apps.Debug.Trace(this);
            Apps.UI.TestManagerRequirements.Show();
        },
        Hide: function () {
            Apps.Debug.Trace(this);
            Apps.UI.TestManagerRequirements.Hide();
        },
        Table: function (software, callback) {

            Me.Software = software;

            Apps.LoadTemplate('TestManagerRequirements', Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components/VitaTest/Modules/TestManager/Modules/TestManagerRequirements/TestManagerRequirements.html', function () {

                Apps.LoadStyle(Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components/VitaTest/Modules/TestManager/Modules/TestManagerRequirements/TestManagerRequirements.css');

                Apps.RegisterDataSingle({
                    name: 'TestManagerRequirements', path: Apps.Settings.WebRoot + '/api/VitaTest/GetRequirements?db=' + Apps.Settings.DB + '&softwareId=' + software.softwareID
                }, function (result, data) {

                    let unarchivedRequirements = Enumerable
                        .From(Apps.Data.TestManagerRequirements.data)
                        .Where(function (tms) { return tms.archived === false; })
                        .OrderBy(function (tms) { return tms.order; })
                        .ToArray();

                    $.each(unarchivedRequirements, function (index, ur) {
                        if (!ur.order || ur.order.length === 0)
                            ur.order = 1;

                        if (!ur.latest || ur.order.latest === 0)
                            ur.latest = '&nbsp;&nbsp;&nbsp;&nbsp;';

                        if (!ur.grabbed || ur.grabbed.length === 0)
                            ur.grabbed = '&nbsp;&nbsp;&nbsp;&nbsp;';
                    });

                    var table = Apps.Grids.GetTable({
                        title: '<i>' + software.softwareName + '</i> Features',
                        data: unarchivedRequirements,
                        tableactions: [
                            {
                                text: 'Add Ticket Or Requirement', actionclick: function () {
                                    Apps.Pages.TestManagerRequirements.Event('add');
                                }
                            }
                        ],
                        rowbuttonwidthpercent: 5,
                        rowbuttons: [
                            {
                                text: 'Test Scope', buttonclick: function () {
                                    Apps.Pages.TestManagerRequirements.Event('select', arguments);
                                }
                            }
                            //,
                            //{
                            //    text: 'Docs', buttonclick: function () {
                            //        Apps.Pages.TestManagerRequirements.Event('show_docs', arguments);
                            //    }
                            //}
                            //,
                            //{
                            //    text: 'Links', buttonclick: function () {
                            //        //Apps.Pages.TestManagerRequirements.Event('remove', arguments);
                            //    }
                            //}
                        ],
                        fields: [
                            { name: 'softwareRequirementID' },
                            {
                                name: 'grabbed',
                                edittype: 'editor',
                                editclick: function (td, rowdata, editControl) { },
                                saveclick: function (td, req, editControl) {
                                    req.grabbed = $(editControl).val();
                                    Apps.Pages.TestManagerRequirements.Event('save', req);
                                }
                            },
                             {
                                name: 'order',
                                editclick: function () { },
                                saveclick: function (td, req, editControl) {
                                    //let req = arguments[1]; //TODO: fix this discrepancy
                                    req.order = $(editControl).val();
                                    Apps.Pages.TestManagerRequirements.Event('save', req);
                                }
                            }
                            ,
                           {
                                name: 'color',
                                editclick: function (td, rowdata, editControl) { },
                                saveclick: function (td, req, editControl) {
                                    req.color = $(editControl).val();
                                    Apps.Pages.TestManagerRequirements.Event('save', req);
                                }
                            },
                            {
                                name: 'softwareRequirementName',
                                editclick: function () { },
                                saveclick: function (td, req, editControl) {
                                    //let req = arguments[1]; //TODO: fix this discrepancy
                                    req.softwareRequirementName = $(editControl).val();
                                    Apps.Pages.TestManagerRequirements.Event('save', req);
                                }
                            },
                            {
                                name: 'softwareRequirementDescription',
                                edittype: 'editor',
                                editclick: function () { },
                                saveclick: function (td, req, editControl) {

                                    //let req = arguments[1]; //TODO: fix this discrepancy
                                    req.softwareRequirementDescription = $(editControl).val();
                                    Apps.Pages.TestManagerRequirements.Event('save', req);

                                    //Apps.Pages.TestManagerRequirements.Event('save', arguments);
                                }
                            },
                             {
                                name: 'latest',
                                edittype: 'editor',
                                editclick: function (td, rowdata, editControl) { },
                                saveclick: function (td, req, editControl) {
                                    req.latest = $(editControl).val();
                                    Apps.Pages.TestManagerRequirements.Event('save', req);
                                }
                            }
                       ],
                        columns: [
                            { fieldname: 'softwareRequirementID', text: 'ID', hidden: true },
                            { fieldname: 'grabbed', text: 'Grabbed By'},
                            { fieldname: 'order', text: 'Order' },
                            {
                                fieldname: 'color', text: 'Related', format: function (software) {
                                    let defaultColor = '<div style="background-color:white;border:1px solid black;border-radius:3px;width:72px;height:22px;"></div>';

                                    if (software.color)
                                        defaultColor = '<div style="background-color:' + software.color + ';border:1px solid black;border-radius:3px;width:72px;height:22px;"></div>';

                                    return defaultColor;
                                }
                            },
                            {
                                fieldname: 'softwareRequirementName', text: 'Name', format: function (req) {
                                    if (req.softwareRequirementName === null)
                                        return '&nbsp;&nbsp;&nbsp;&nbsp;';
                                    else
                                        return req.softwareRequirementName;
                                }
                            },
                            {
                                fieldname: 'softwareRequirementDescription', text: 'Summary', format: function (req) {
                                    if (req.softwareRequirementDescription === null)
                                        return '&nbsp;&nbsp;&nbsp;&nbsp;';
                                    else if (req.softwareRequirementDescription.length === 0)
                                        return '&nbsp;&nbsp;&nbsp;&nbsp;';
                                    else
                                        return req.softwareRequirementDescription;
                                }
                            },
                            {
                                fieldname: 'latest', text: 'Latest Update'
                            }
                        ]
                    });

                    if (callback)
                        callback(table);
                });
            });
        },
        Event: function (sender, args, callback) {
            //TODO: change pages to components if a top-level
            Apps.Debug.Trace(this, 'TestManagerRequirements Event: ' + sender);

            switch (sender) {
                case 'view':

                    Me.Show();
                    break;

                case 'hide':

                    Apps.Components.TestManagerRequirements.Hide();
                    break;

                case 'select':

                    let selectedReq = JSON.parse(args[1]);

                    Apps.Pages.TestManager.SelectRequirement(selectedReq);
                    break;

                case 'add':

                    let newReq = {
                        softwareId: Apps.Pages.TestManagerRequirements.Software.softwareID,
                        softwareRequirementName: 'no name'
                    };

                    Apps.Util.PostWithData(Apps.Settings.WebRoot + '/api/VitaTest/AddRequirement?db=local', JSON.stringify(newReq), function (error, result) {

                        Apps.Pages.TestManager.RefreshRequirements(Apps.Pages.TestManagerRequirements.Software);

                    });
                    break;

                case 'save':

                    let req = args;

                    if (!req.order || req.order.length === 0)
                        req.order = 1;

                    if (!req.color || req.color.length === 0)
                        req.color = 'white';

                    Apps.Util.PostWithData(Apps.Settings.WebRoot + '/api/VitaTest/AddRequirement?db=local', JSON.stringify(req), function (error, result) {

                        Apps.Pages.TestManager.RefreshRequirements(Apps.Pages.TestManagerRequirements.Software);

                    });

                    break;
                case 'remove':

                    if (confirm('Are you sure?')) {

                        let softwareToRemove = JSON.parse(args[1]);

                        softwareToRemove.archived = true;

                        Apps.Util.PostWithData(Apps.Settings.WebRoot + '/api/VitaTest/AddRequirement?db=' + Apps.Settings.DB, JSON.stringify(softwareToRemove), function (error, result) {

                            Apps.Pages.TestManager.RefreshRequirements(Apps.Pages.TestManagerRequirements.Software);

                        });
                    }
                    break;

                case 'show_docs':

                    let docReq = JSON.parse(args[1]);

                    //Create doc for myself if needed
                    Apps.Components.Docs.CreateMyDoc(docReq.softwareRequirementID, Me.DocTypeID, docReq.softwareRequirementName, '', function (doc, docType) {

                        Apps.Components.Docs.ShowMyDocs(doc, docType);

                    });

                    break;

            }
        }

    };
    return Me;
});