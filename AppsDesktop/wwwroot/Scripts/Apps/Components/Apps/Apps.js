define([], function () {
    var Me = {
        Initialize: function () {

            //Templates
            Me.UI.Show(); //Drops component html file with templates (no immediate UI, rb 3/13/2021)
            Me.UI.Templates.AppTabstrip.Drop();

            //Data sources
            Apps.Data.RegisterGET('Systems', '/api/Apps/GetSystems');
            Apps.Data.RegisterGET('App', '/api/Apps/GetApp?appId={0}');
            Apps.Data.RegisterGET('SoftwareTypes', '/api/Apps/GetSoftwareTypes');
            Apps.Data.RegisterPOST('UpsertApp', '/api/Apps/UpsertApp');

            Apps.Data.SoftwareTypes.Refresh();

            //Adjust dropdown menu for home page
            $('.dropdown-content').css('top', '35px');
            $('.dropdown-content').css('left', '-105px');

            $(window).resize(function () { Me.Resize(); });
        },
        Resize: function () {
            let windowHeight = $(window).height();
            let windowWidth = $(window).width();

            $('#Apps_Events_Container_Div').height(windowHeight - 120);

            $('.AppContentStyle').height(windowHeight - 59);
            $('.tabstripApp-tabstrip-custom').height(windowHeight - 59 - 83);

        },
        ShowApp: function (appId, tabIndex) {

            Apps.Components.Apps.Track.Events.HideEvents();

            Me.AppList.UI.Templates.AppWidgetContainer.Hide(400);
            Me.UI.Templates.AppTabstrip.Show(400);

            Me.LoadAppAndShowAppView(appId, function () {
                Apps.Tabstrips.Select('tabstripApp', tabIndex);
            });
        },
        TabSelected: function (tabId, tabIndex) {

            let tabLabels = $('#contentAppView > div.css3-tabstrip.tabstripApp-tabstrip-custom > ul').children();
            $.each(tabLabels, function (index, label) {
                $(label).css('position', 'relative').css('top', '0px');
            });

            if (tabIndex == 0) {
                Apps.Components.Learn.Show();
            }
            else if (tabIndex == 1) {

                Me.Plan.Show();

                //"Create" tab when selected
                $('#contentAppView > div.css3-tabstrip.tabstripApp-tabstrip-custom > ul > li:nth-child(1) > label')
                    .css('position', 'relative').css('top', '1px');
            }
            else if (tabIndex == 2) {

                Me.Create.Show();

                //"Create" tab when selected
                $('#contentAppView > div.css3-tabstrip.tabstripApp-tabstrip-custom > ul > li:nth-child(2) > label')
                    .css('position', 'relative').css('top', '1px');

            }
            else if (tabIndex == 3) {

                Me.Test.Show();

                //"Test" tab when selected
                $('#contentAppView > div.css3-tabstrip.tabstripApp-tabstrip-custom > ul > li:nth-child(3) > label')
                    .css('position', 'relative').css('top', '1px');

            }
            else if (tabIndex == 4) {
                Me.Publish.Show();

                //"Publish" tab
                $('#contentAppView > div.css3-tabstrip.tabstripApp-tabstrip-custom > ul > li:nth-child(4) > label')
                    .css('position', 'relative').css('top', '1px');

            }
            else if (tabIndex == 5) {
                Apps.Notify('info', 'Implement Track');
            }
        },
        LoadAppAndShowAppView: function (appId, callback) {

            Apps.Data.App.Refresh([appId], function () {

                //Me.Data.GetApp(appId, function () {

                //At this point, the only entry point into
                //the app screens, Apps.Data.App is available everywhere
                //Me.UI.AppView.Show(400);
                //Me.Hidden = false;

                if ($('.tabstripApp-tabstrip-custom').length == 0) {
                    //let tabhtml = Me.UI.Templates.AppTabstrip.HTML();

                    Apps.Tabstrips.Initialize('tabstripApp');
                    Apps.Tabstrips.Select('tabstripApp', 2);
                    Apps.Tabstrips.SelectCallback = Me.TabSelected; //TODO make sure this can't be overriden...refactor whole thing
                    //Apps.Tabstrips.Content('tabstripApp', 0, Me.UI.Templates.AppTabstrip.Show().HTML());
                }


                //Position/tweak App tabstrip
                $('.tabstripApp-tabstrip-custom')
                    .css('position', 'relative')
                    .css('top', '21px');
                    //.css('pointer-events', 'none');

                $('#Test_List_TemplateContent').addClass('Test_List_TemplateContent_Style');

                Me.Resize();
                //Me.Create.Initialize(Me.CurrentApp);
                //Me.RefreshTestPlans();

                if (callback)
                    callback();

            });

        },
        CloseAppsHome: function () {
            Me.UI.AppsHome.Hide(400);
            Me.Hidden = true;
            clearInterval(Me.IntervalID);
        },
        CloseAppView: function () {
            Me.UI.Templates.AppTabstrip.Hide(400); //Hide tabstrip that edits one app
            Me.AppList.UI.Templates.AppWidgetContainer.Show(400); //Show app icon list
        },
        GetAppModel: function (callback) {
            Apps.Get2('/api/Apps/GetAppModel', function (result) {
                if (result.Success) {
                    callback(result.Data);
                }
                else
                    Apps.Notify('warning', 'Failed to get app model.');
            });
        },

        Edit: function (appId) {

            Apps.Data.Systems.Refresh(null, function (systemsResult) {

                Apps.Data.App.Refresh([appId], function (result) {

                    let app = Apps.Data.App.Data[0];

                    let isChecked = app.IsEnabled ? 'checked' : '';
                    let projectFileExists = app.ProjectFileExists ? 'checked' : '';
                    let editAppHTML = Me.UI.Templates.EditApp.HTML(
                        [
                            app.AppName,
                            isChecked,
                            app.SystemID,
                            app.AppID,
                            app.MachineName,
                            app.WorkingFolder,
                            app.ProjectFileFullName,
                            projectFileExists
                        ]);

                    Apps.Components.Helpers.Dialogs.Content('Apps_EditApp_Dialog', editAppHTML);
                    Apps.Components.Helpers.Dialogs.Open('Apps_EditApp_Dialog');

                    Apps.Util.RefreshCombobox(Apps.Data.Systems.Data, 'Apps_EditAppSystem_Select', app.SystemID, 'Select A System', 'SystemID', 'SystemName', function () {
                        //Selected
                    });

                    Apps.Util.RefreshCombobox(Apps.Data.SoftwareTypes.Data, 'Apps_EditSoftwareType_Select', app.SoftwareType, 'Select A Software Type', 'SoftwareTypeID', 'SoftwareTypeName', function () {
                        //Selected
                    });
                });
            });
        },
        Save: function () {

            let systemId = $('#Apps_EditAppSystem_Select').val();
            let softwareTypeId = $('#Apps_EditSoftwareType_Select').val();
            let app = Apps.Data.App.Data[0];

            app.AppName = $('#Apps_EditAppName_Textbox').val();
            app.IsEnabled = $('#Apps_EditAppEnabled_Checkbox').prop('checked');
            app.SystemID = systemId === null ? 0 : systemId;
            app.SoftwareType = softwareTypeId;
            app.MachineName = $('#Apps_EditApp_MachineName_Textbox').val();
            app.WorkingFolder = $('#Apps_EditApp_WorkingFolder_Textbox').val();
            app.ProjectFileFullName = $('#Apps_EditApp_ProjectFile_Textbox').val();

            Apps.Post2('/api/Apps/UpsertApp', JSON.stringify(app), function (result) {
                if (result.Success) {
                    Apps.Notify('success', 'App saved!');
                    Apps.Components.Helpers.Dialogs.Close('Apps_EditApp_Dialog');
                }
            });
        },
        Ping: function (machineName, workingFolder) {

            var pingElements = $('[data-ping-machinename="' + machineName + '"][data-ping-workingfolder="' + escape(workingFolder) + '"]');

            $.each(pingElements, function (index, pingElement) {
                $(pingElement).css('background-color', 'lightgreen');
                setTimeout(function () {
                    $(pingElement).css('background-color', 'inherit');
                }, 200);
            });
        },
        Deploy: function (appId) {

        },
        New: function (newWhat) {
            if (newWhat == 'app') {
                Me.GetAppModel(function (app) {
                    Me.CurrentApp = app;
                    let isChecked = app.IsEnabled ? 'checked' : '';
                    let editAppHTML = Apps.Util.GetHTML('Apps_EditApp_Template', [Me.CurrentApp.AppName, isChecked])
                    Apps.Components.Helpers.Dialogs.Content('Apps_EditApp_Dialog', editAppHTML);
                    Apps.Components.Helpers.Dialogs.Open('Apps_EditApp_Dialog');
                });
            }
            else if (newWhat == 'system') {
                Me.GetSystemModel(function (system) {
                    Me.CurrentSystem = system;
                    let editHTML = Apps.Util.GetHTML('Apps_EditSystem_Template', [Me.CurrentSystem.SystemName, Me.CurrentSystem.IsEnabled])
                    Apps.Components.Helpers.Dialogs.Content('Apps_EditSystem_Dialog', editHTML);
                    Apps.Components.Helpers.Dialogs.Open('Apps_EditSystem_Dialog');
                });
            }
        },
        GetSystemModel: function (callback) {
            Apps.Get2('/api/Apps/GetSystemModel', function (result) {
                if (result.Success) {
                    callback(result.Data);
                }
                else
                    Apps.Notify('warning', 'Failed to get system model.');
            });
        },
        SaveSystem: function () {
            Me.CurrentSystem.SystemName = $('#Apps_EditSystemName_Textbox').val();
            Me.CurrentSystem.IsEnabled = $('#Apps_EditSystemEnabled_Checkbox').prop('checked');
            Apps.Post2('/api/Apps/UpsertSystem', JSON.stringify(Me.CurrentSystem), function (result) {
                if (result.Success) {
                    Apps.Notify('success', 'System saved!');
                    Apps.Components.Helpers.Dialogs.Close('Apps_EditSystem_Dialog');
                }
            });
        },
        GetSystems: function () {

        },
        Archive: function (appId) {
            if (confirm('Are you sure?')) {
                Apps.Data.App.Refresh([appId], function (result) {

                    let app = Apps.Data.App.Data[0];
                    app.Archived = true;

                    Apps.Data.Post('UpsertApp', app, function (result) {
                        Apps.Notify('success', 'App deleted.');
                    });
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
        Tests: function () {
            //refresh 
        },
        Event: function (sender, args) {
            switch (sender) {
                case 'ShowApp': Me.ShowApp(args[0], args[1]); break;
            }
        },
        Test: function () {

            Apps.Notify('info', 'apps is testing!')

            //Click app publish icon for app 2. Publish profile list shows.
            F('#Apps_TitleLabel_ID2').click();

            //Click on publish profile 1
            F('#Publish_List_Edit_Button_ID2').click();

            //When dialog shows save existing name and add "123"
            var existingPubName = '';
            F('#Apps_Publish_Edit_Name_Text').exists(function () {
                existingPubName = $('#Apps_Publish_Edit_Name_Text').val();
                Apps.Notify('info', 'Saved off original name: ' + existingPubName);
            }).type(123);

            //Click save button
            F('#Apps_Publish_Edit_Dialog_Save').click(); //Save

            //Click publish icon again. Publish profile list shows
            F('#Apps_TitleLabel_ID2').click();

            //Test that profile name is same as that changed (old name + '123')


            //QUnit.module('add', function () {
            //    QUnit.test('publish profile should have new name.', function (assert) {

            //        assert.equal($('#Apps_Publish_Edit_Name_Text').val(), existingPubName);
            //    });
            //});

            //QUnit.start();
            //QUnit.done(function (details) {

            //});

        }
    };
    return Me;
});