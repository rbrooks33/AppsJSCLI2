define(['./AppComponents/AppComponents.js'], function (appcomponents) {
    var Me = {
        AppComponents: appcomponents,
        Components: [appcomponents],
        CurrentApp: null,
        CurrentSystem: null,
        CurrentApps: null, //TODO: refactor to use Apps.Data
        Initialize: function () {
            Apps.LoadTemplate('Apps', Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components/Plan/Apps/Apps.html', function () {

                Apps.LoadStyle(Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components/Plan/Apps/Apps.css');
                Apps.UI.Apps.Show(400);

                Apps.LoadComponentTemplate(Me, 'AppsHome', 'Plan_Apps_AppsHome_Template');
                Apps.LoadComponentTemplate(Me, 'AppView', 'Plan_Apps_AppView_Template');
                Apps.LoadComponentTemplate(Me, 'AppDiv', 'Plan_Apps_AppDiv_Template');

                Me.UI.AppsHome.Show(400);
                Me.GetApps();
                Me.StartInterval();

                //Adjust dropdown menu for home page
                $('.dropdown-content').css('top', '35px');
                $('.dropdown-content').css('left', '-110px');

            });

            $(window).resize(function () { Me.Resize(); });
        },
        StartInterval: function () {
            setInterval(Me.Interval, 5000);
        },
        Interval: function () {
            //Apps.Notify('info', 'hiya');
            Me.GetApps();
            //Apps.Components.Track.Events.Show();
            Apps.Components.Track.Events.Refresh();
        },
        Resize: function () {
            let windowHeight = $(window).height();
            let windowWidth = $(window).width();

            $('#Apps_Events_Container_Div').height(windowHeight - 120);

            $('.AppContentStyle').height(windowHeight - 59);
            $('.tabstripApp-tabstrip-custom').height(windowHeight - 59 - 83);

        },
        ShowAppsHome: function (appId, callback) {

            $('#Apps_AppContainer_Div').hide(400);

            Apps.Get2('/api/Apps/GetApp?appId=' + appId, function (result) {

                if (result.Success) {

                    Me.CurrentApp = result.Data[0]; // JSON.parse(unescape(appString));

                    Apps.UI.Apps.Show(400);
                    Me.Hidden = false;

                    if ($('.tabstripApp-tabstrip-custom').length == 0) {
                        Apps.Tabstrips.Initialize('tabstripApp');
                        Apps.Tabstrips.Select('tabstripApp', 2);
                        Apps.Tabstrips.SelectCallback = Me.TabSelected;
                    }

                    $('.tabstripApp-tabstrip-custom').css('position', 'relative').css('top', '41px');
                    $('#Test_List_TemplateContent').addClass('Test_List_TemplateContent_Style');

                    Me.Resize();
                    //Me.Create.Initialize(Me.CurrentApp);
                    //Me.RefreshTestPlans();

                    if (callback)
                        callback();
                }
                else
                    Apps.Notify('warning', 'Problem loading app.');
            });
        },
        CloseAppsHome: function () {
            //Apps.UI.Apps.Hide(400);
            Me.UI.AppsHome.Hide(400);

            Me.Hidden = true;
            clearInterval(Me.IntervalID);
            $('#Apps_AppContainer_Div').hide(400);
        },
        CloseAppView: function () {
            Me.UI.AppView.Hide(400);
            Me.UI.AppsHome.Show(400);

            //Apps.UI.Apps.Show(400);
        },

        ShowPlan: function (appId) {

            Apps.UI.Apps.Hide(400);
            Me.UI.AppView.Show(400);
            Me.Show(appId, function () {
                Apps.Tabstrips.Select('tabstripApp', 0);
            });
            //let app = JSON.parse(unescape(appString));
            //Me.AppComponents.Show(app);
            //Apps.Get2('/api/Apps/GetApp?appId=' + appId, function (result) {

            //    if (result.Success) {

            //        switch (appWhat) {
            //            case 'stories': Me.App.Stories.Show(); break;
            //        }

            //    }
            //    else
            //        Apps.Notify('warning', 'Problem loading app.');
            //});
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
        
        GetApps: function () {

            //Gets both apps and related systems
            Apps.Get2('/api/Apps/GetApps', function (result) {
                if (result.Success) {

                    let apps = result.Data.Apps;
                    let systems = result.Data.Systems;

                    Me.CurrentApps = apps;

                    $.each(apps, function (index, app) {
                        if (app.SystemID <= 0) {
                            let appHTML = Apps.Util.GetHTML('Plan_Apps_App_Template', [app.AppID, app.AppName, app.MachineName, escape(app.WorkingFolder), escape(JSON.stringify(app))]);
                            let existingAppDiv = $('.Apps_App_DivStyle_ID' + app.AppID);
                            //let existingPingDiv = $('#Apps_Plan_Div_ID' + app.AppID);

                            if (existingAppDiv.length >= 1) {
                                if (app.Archived) {
                                    existingAppDiv.detach();
                                }
                                else {
                                    //Update
                                    Me.UpdateAppHTML(app);
                                }
                            }
                            else {
                                $('#Apps_AppContainer_Div').append(appHTML);
                            }
                        }
                    });
                    $.each(systems, function (index, system) {

                        let systemHTML = Apps.Util.GetHTML('Apps_SystemContainer_Div', [system.SystemID, system.SystemName]);
                        let existingSystemDiv = $('#Apps_SystemContainer_Div_ID' + system.SystemID);

                        if (existingSystemDiv.length >= 1) {
                            //Update system div
                        }
                        else {
                            //Create system div
                            $('#Apps_AppContainer_Div').append(systemHTML);
                        }
                        //Add system apps
                        $.each(system.Apps, function (index, systemApp) {

                            let appHTML = Apps.Util.GetHTML('Plan_Apps_App_Template', [systemApp.AppID, systemApp.AppName, systemApp.MachineName, escape(systemApp.WorkingFolder), escape(JSON.stringify(systemApp))]);
                            let existingAppDiv = $('#Apps_SystemContainer_Div_ID1').find('.Apps_App_DivStyle_ID' + systemApp.AppID);

                            if (existingAppDiv.length >= 1) {
                                //Update
                                Me.UpdateAppHTML(systemApp);
                            }
                            else {
                                //Add to system div
                                existingSystemDiv.append(appHTML);
                            }
                        });
                    });
                }
            });
        },
        UpdateAppHTML: function (app) {

            //let appNameElement = $('.Apps_AppName_Label_ID' + app.AppID);
            let appDivStyle = $('.Apps_App_DivStyle_ID' + app.AppID);

            let planDiv = $('.Apps_Plan_Div_ID' + app.AppID);
            let createDiv = $('.Apps_Create_Div_ID' + app.AppID);
            let testDiv = $('.Apps_Test_Div_ID' + app.AppID);
            let publishDiv = $('.Apps_Publish_Div_ID' + app.AppID);
            let trackDiv = $('.Apps_Track_Div_ID' + app.AppID);

            //Main Div
            appDivStyle.css('border-color', 'lightgrey');
            if (app.IsEnabled) {
                appDivStyle.css('border-color', 'green');
            }

            //AppsJS Div
            let appJsDiv = $('#Apps_AppsJSExists_Div_ID' + app.AppID);
            if (app.IsAppsJSExists) {
                appJsDiv.css('background-color', 'lightgreen');
            }
            else
                appJsDiv.css('background-color', 'lightgrey');

            //Create Div
            createDiv.css('border-color', 'lightgrey');
            if (app.WorkingFolderExists) {
                createDiv.css('border-color', 'green'); 
            }


        },
        Edit: function (appId) {
            Apps.Get2('/api/Apps/GetSystems', function (systemsResult) {
                if (systemsResult.Success) {

                    Apps.Get2('/api/Apps/GetApp?appId=' + appId, function (result) {
                        if (result.Success) {

                            Me.CurrentApp = result.Data[0]; // JSON.parse(unescape(appString));
                            Apps.Components.Publish.CurrentApp = result.Data[0];

                            let isChecked = Me.CurrentApp.IsEnabled ? 'checked' : '';
                            let projectFileExists = Me.CurrentApp.ProjectFileExists ? 'checked' : '';

                            let editAppHTML = Apps.Util.GetHTML('Apps_EditApp_Template',
                                [
                                    Me.CurrentApp.AppName,
                                    isChecked,
                                    Me.CurrentApp.SystemID,
                                    Me.CurrentApp.AppID,
                                    Me.CurrentApp.MachineName,
                                    Me.CurrentApp.WorkingFolder,
                                    Me.CurrentApp.ProjectFileFullName,
                                    projectFileExists
                                ])

                            Apps.Components.Helpers.Dialogs.Content('Apps_EditApp_Dialog', editAppHTML);
                            Apps.Components.Helpers.Dialogs.Open('Apps_EditApp_Dialog');

                            Apps.Util.RefreshCombobox(systemsResult.Data, 'Apps_EditAppSystem_Select', Me.CurrentApp.SystemID, 'Select A System', 'SystemID', 'SystemName', function () {
                                //Selected
                            });
                        }
                    });
                }
            });
        },
        Save: function () {

            let systemId = $('#Apps_EditAppSystem_Select').val();

            Me.CurrentApp.AppName = $('#Apps_EditAppName_Textbox').val();
            Me.CurrentApp.IsEnabled = $('#Apps_EditAppEnabled_Checkbox').prop('checked');
            Me.CurrentApp.SystemID = systemId === null ? 0 : systemId;
            Me.CurrentApp.MachineName = $('#Apps_EditApp_MachineName_Textbox').val();
            Me.CurrentApp.WorkingFolder = $('#Apps_EditApp_WorkingFolder_Textbox').val();
            Me.CurrentApp.ProjectFileFullName = $('#Apps_EditApp_ProjectFile_Textbox').val();

            Apps.Post2('/api/Apps/UpsertApp', JSON.stringify(Me.CurrentApp), function (result) {
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
        TabSelected: function (tabId, tabIndex) {
            if (tabIndex == 1) {
                Apps.Notify('info', 'create');
                Me.Create.Show();
            }
        },
        RefreshTestPlans: function () {


            Me.TestPlans.GetTestPlans(Me.CurrentApp, function (html) {

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
        Tests: function () {
            //refresh 
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