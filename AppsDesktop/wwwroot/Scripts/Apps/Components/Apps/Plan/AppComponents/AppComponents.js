define([], function () {
    var Me = {
        Initialize: function (parent, callback) {
            Apps.LoadTemplate('AppComponents', '/Scripts/Apps/Components/Apps/Plan/AppComponents/AppComponents.html', function () {
                Apps.LoadStyle('/Scripts/Apps/Components/Apps/Plan/AppComponents/AppComponents.css');

                Apps.UI.AppComponents.Drop(); //Use Drop to put hidden on dom

                Apps.Data.RegisterGET('AppComponents', '/api/AppComponent/GetAppComponents?appId={0}');
                Apps.Data.RegisterGET('AppComponentModel', '/api/AppComponent/GetAppComponentModel');

                Apps.Data.AppComponentModel.Refresh();

                Apps.Data.RegisterPOST('UpsertAppComponent', '/api/AppComponent/UpsertAppComponent');

                if (callback)
                    callback();
            });
        },
        Show: function () {

            //Apps.Data.App.Refresh([], function () { //Blank out model since is used for "new" etc.

                var app = Apps.Data.App.Data[0];

                Apps.Data.AppComponents.Refresh([app.AppID], function () {


                    let table = Apps.Grids.GetTable({
                        id: "gridAppComponents",
                        data: Apps.Data.AppComponents.Data,
                        title: app.AppName + ' <span style="color:lightgrey;">App Components</span>',
                        tableactions: [
                            {
                                text: "Add Component",
                                actionclick: function () {
                                    Apps.Data.AppComponents.Selected = null;
                                    Apps.Components.Apps.Plan.AppComponents.Upsert();
                                }

                            }
                        ],
                        tablestyle: "",
                        rowactions: [
                            {
                                text: "Delete",
                                actionclick: function (td, appComponent, tr) {
                                    if (confirm('Are you sure?')) {
                                        appComponent.Archived = true;
                                        Apps.Data.AppComponents.Selected = appComponent;
                                        Apps.Components.Apps.Plan.AppComponents.Upsert();
                                    }
                                }
                            }
                        ],
                        rowbuttons: [
                            {
                                text: "Stories",
                                buttonclick: function (td, appComponent, tr) {
                                    Apps.Components.Apps.Plan.AppComponents.ShowStories(td, appComponent, tr);
                                }
                            }
                        ],
                        fields: [
                            { name: 'ID' },
                            {
                                name: 'AppComponentName',
                                editclick: function (td, rowdata, editControl) {
                                },
                                saveclick: function (td, appComponent, input) {
                                    appComponent.AppID = Apps.Data.App.Data[0].AppID;
                                    appComponent.AppComponentName = $(input).val();
                                    Apps.Data.AppComponents.Selected = appComponent;
                                    Apps.Components.Apps.Plan.AppComponents.Upsert();
                                }
                            },
                            {
                                name: 'AppComponentDescription',
                                editclick: function (td, rowdata, editControl) {
                                },
                                saveclick: function (td, appComponent, input) {
                                    appComponent.AppID = Apps.Data.App.Data[0].AppID;
                                    appComponent.AppComponentDescription = $(input).val();
                                    Apps.Data.AppComponents.Selected = appComponent;
                                    Apps.Components.Apps.Plan.AppComponents.Upsert();
                                }
                            }
                        ],
                        columns: [
                            {
                                fieldname: 'ID',
                                text: 'ID'
                            },
                            {
                                fieldname: 'AppComponentName',
                                text: 'Name',
                                format: function (appComponent) {
                                    let result = '&nbsp;&nbsp;&nbsp;&nbsp;';
                                    if (appComponent.AppComponentName)
                                        result = '<span style="font-size:22px;">' + appComponent.AppComponentName + '</span>';

                                    return result;
                                }
                            },
                            {
                                fieldname: 'AppComponentDescription',
                                text: 'Description',
                                format: function (appComponent) {
                                    let result = '&nbsp;&nbsp;&nbsp;&nbsp;';
                                    if (appComponent.AppComponentDescription)
                                        result = appComponent.AppComponentDescription;

                                    return result;
                                }
                            }
                        ]
                    });

                    $('#App_Plan_TemplateContent').html(table.outerHTML);
                });

            //});
        },
        Upsert: function () {

            let appComponent = Apps.Data.AppComponentModel.Data;
            if (Apps.Data.AppComponents.Selected)
                appComponent = Apps.Data.AppComponents.Selected;

            appComponent.AppID = Apps.Data.App.Data[0].AppID;

            Apps.Data.Post('UpsertAppComponent', appComponent, function () {
                Apps.Data.AppComponents.Selected = null;
                Apps.Notify('success', 'Upserted app component.');
                Me.Show();
            });
        },
        //Put in row below selected item
        ShowStories: function (td, appComponent, tr) {

            Apps.Data.AppComponents.Selected = appComponent;

            let row = $('#Plan_AppComponents_StoriesRow' + appComponent.ID);

            if (row.length == 0) {

                Me.Stories.GetStories(appComponent, function (html) {

                    $(tr).after('<tr><td id="Plan_AppComponents_StoriesRow' + appComponent.ID + '" style="display:none;" colspan="5">' + html + '</td></tr>');

                    row = $('#Plan_AppComponents_StoriesRow' + appComponent.ID);

                    row.show(400);

                });
            }
            else
                row.detach();
        },
        //Refresh existing row below selected item
        RefreshStories: function (appComponent) {

            Apps.Data.AppComponents.Selected = appComponent;

            let row = $('#Plan_AppComponents_StoriesRow' + appComponent.ID);

            if (row.length == 1) {

                Me.Stories.GetStories(appComponent, function (html) {

                    row.html(html);

                });
            }
        },

    };
    return Me;
});

