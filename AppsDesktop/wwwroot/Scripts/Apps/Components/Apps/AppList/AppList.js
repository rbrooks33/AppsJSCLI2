define([], function () {
    var Me = {
        Parent: null,
        Initialize: function () {
            Me.UI.Drop();
            Me.UI.Templates.AppWidgetContainer.Drop().Show(400); //Put directly on DOM
        },
        Show: function () {
            Me.UI.Show(400);
        },
        Hide: function () {
            Me.UI.Hide(400);
        },
        GetApps: function () {

            //Gets both apps and related systems
            Apps.Get2('/api/Apps/GetApps', function (result) {
                if (result.Success) {

                    let apps = result.Data.Apps;
                    let systems = result.Data.Systems;

                    $.each(apps, function (index, app) {
                        if (app.SystemID <= 0) {

                            let softwareTypeName = Enumerable.From(Apps.Data.SoftwareTypes.Data).Where(function (st) {
                                return st.SoftwareTypeID == app.SoftwareType;
                            }).ToArray()[0].SoftwareTypeName;

                            let appHTML = Me.UI.Templates.App.HTML(
                                [
                                    app.AppID,
                                    app.AppName,
                                    app.MachineName,
                                    escape(app.WorkingFolder),
                                    escape(JSON.stringify(app)),
                                    softwareTypeName
                                ]);

                            let existingAppDiv = $('.Apps_App_DivStyle_ID' + app.AppID);

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

                        let systemHTML = Me.UI.Templates.SystemContainer.HTML([system.SystemID, system.SystemName]);

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

                            let appHTML = Me.UI.Templates.App.HTML([systemApp.AppID, systemApp.AppName, systemApp.MachineName, escape(systemApp.WorkingFolder), escape(JSON.stringify(systemApp))]);
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
        StartInterval: function () {
            setInterval(Me.Interval, 5000);
        },
        Interval: function () {
            Me.GetApps();
            Apps.Components.Apps.Track.Events.Refresh();
        }

    };
    return Me;
});