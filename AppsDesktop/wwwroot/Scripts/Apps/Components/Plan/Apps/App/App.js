define(['./Develop/Develop.js'], function (develop) {
    var Me = {
        Develop: develop,
        CurrentApp: null,
        Hidden: true,
        IntervalID: 0,
        Initialize: function (callback) {

            Apps.LoadTemplate('App', '/Scripts/Apps/Components/Plan/Apps/App/App.html', function () {

                Apps.LoadStyle('/Scripts/Apps/Components/Plan/Apps/App/App.css');


                //Me.IntervalID = setInterval(Me.Interval, 15000);
                Me.Resize();
                $(window).resize(function () { Me.Resize(); });

                Me.Develop.Initialize();

                if (callback)
                    callback();
            });
        },
        Interval: function () {
            if (!Me.Hidden) {
                Apps.Notify('info', 'interval');



            }
        },
        Resize: function () {
            let windowHeight = $(window).height();
            $('.AppContentStyle').height(windowHeight - 59);
            $('.tabstripApp-tabstrip-custom').height(windowHeight - 59 - 75);
        },
        Show: function (appId) {

            //Apps.Notify('info', 'hiya there');

            Me.Initialize(function () {

                Apps.Get2('/api/Apps/GetApp?appId=' + appId, function (result) {

                    if (result.Success) {

                        Me.CurrentApp = result.Data[0]; // JSON.parse(unescape(appString));

                        Apps.UI.App.Show(400);
                        Me.Hidden = false;

                        if ($('.tabstripApp-tabstrip-custom').length == 0) {
                            Apps.Tabstrips.Initialize('tabstripApp');
                            Apps.Tabstrips.Select('tabstripApp', 2);
                            Apps.Tabstrips.SelectCallback = Me.TabSelected;
                        }

                        $('.tabstripApp-tabstrip-custom').css('position', 'relative').css('top', '41px');
                        $('#Test_List_TemplateContent').addClass('Test_List_TemplateContent_Style');

                        Me.RefreshTestPlans();
                        Me.Resize();

                    }
                    else
                        Apps.Notify('warning', 'Problem loading app.');
                });
            });

        },
        TabSelected: function (tabId, tabIndex) {
            if (tabIndex == 1) {
                Apps.Notify('info', 'develop');
            }
        },
        RefreshTestPlans: function () {
            Apps.Components.Test.GetTestPlans(Me.CurrentApp, function (html) {

                $('#Test_List_TemplateContent').html(html);

            });
        },
        Archive: function (appId) {
            if (confirm('Are you sure?')) {

                //Set client to archived (TODO: refactor)
                let clientAppList = Enumerable.From(Apps.Components.Plan.Apps.CurrentApps).Where('$.AppID == ' + appId).ToArray();
                if (clientAppList.length == 1) {
                    clientAppList[0].Archived = true;
                    let existingAppDiv = $('.Apps_App_DivStyle_ID' + appId);
                    existingAppDiv.detach();
                }
                Apps.Get2('/api/Apps/GetApp?appId=' + appId, function (result) {

                    if (result.Success) {

                        let app = result.Data[0];
                        app.Archived = true;

                        Apps.Post2('/api/Apps/UpsertApp', JSON.stringify(app), function (result) {
                            if (result.Success) {
                                Apps.Notify('success', 'App deleted.');
                            }
                            else
                                Apps.Notify('warning', 'Problem deleting app.');
                        });
                    }
                    else
                        Apps.Notify('warning', 'Problem getting app for delete.');
                });
            }
        },
        Run: function (appId) {
            Apps.Get2('/api/Apps/Run?appId=' + appId, function (result) {
                if (result.Success) {
                    Apps.Notify('success', 'App #' + appId + ' started.');
                }
                else
                    Apps.Notify('warning', 'Problem running app #' + appId + '.');
                
            });
        },
        AddAppsJS: function (appId) {
            Apps.Get2('/api/Apps/AddAppsJS?appId=' + appId, function (result) {
                if (result.Success) {
                    Apps.Notify('success', 'App #' + appId + ' appsjs added.');
                }
                else
                    Apps.Notify('warning', 'Problem adding appsjs for app #' + appId + '.');

            });
        },
        Close: function () {
            Apps.UI.App.Hide(400);
            Me.Hidden = true;
            clearInterval(Me.IntervalID);
        },
        Tests: function () {
            //refresh 
        }
    };
    return Me;
});