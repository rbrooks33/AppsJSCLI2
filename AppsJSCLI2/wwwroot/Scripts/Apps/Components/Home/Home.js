define([], function () {
    var Me = {
        Enabled: true,
        Color: 'blue',
        Name: 'Home',
        Initialize: function (callback) {

            Apps.LoadTemplate('Home', Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components/Home/Home.html', function () {

                Apps.LoadStyle(Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components/Home/Home.css');

                if (callback)
                    callback();
            });

        },
        Show: function()
        {
            Me.Initialize(function () {
                Apps.UI.Home.Show();
            });

            //Me.Event('load_login_html');
            //Me.LoadSignalR();
            Me.LoadDirectories();
        },
        LoadSignalR: function () {
            //Connect SignalR
            Apps.connection = new signalR.HubConnectionBuilder()
                .withUrl("/desktopHub")
                .configureLogging(signalR.LogLevel.Information)
                .build();

            Apps.connection.start().catch(err => console.error(err.toString()));

            Apps.connection.on("FoundAppsJSFolder", (message) => { });
        },
        LoadDirectories() {
            Apps.Get2('api/Overview/GetFoundDirectories', function (result) {

                let unarchivedDirs = Enumerable.From(result.Data.Directories)
                    .Where(function (d) { return d.Archived === false; })
                    .ToArray();

                let tableTitle = 'Previously-Discovered AppsJS Project Folders';

                $.each(unarchivedDirs, function (index, dir) {
                    if (!dir.FriendlyName)
                        dir.FriendlyName = '&nbsp;&nbsp;&nbsp;&nbsp;';
                });

                var dirs = Apps.Grids.GetTable({
                    data: unarchivedDirs,
                    title: tableTitle,
                    rowactions: [
                        {
                            text: 'View', actionclick: function () {
                                Apps.Components.Overview.Event('view_folder', arguments);
                            }
                        },
                        {
                            text: 'Archive', actionclick: function () {
                                Apps.Components.Overview.Event('archive_folder', arguments);
                            }
                        }
                    ],
                    fields: [
                        {
                            name: 'FriendlyName',

                            editclick: function (td, rowdata, editControl) { },
                            saveclick: function (td, item, editControl) {
                                Apps.Components.Home.Event('save', arguments);
                            } },
                        { name: 'Path' }
                    ],
                    columns: [
                        { fieldname: 'FriendlyName', text: 'Friendly Name' },
                        { fieldname: 'Path', text: 'Path' }
                    ]
                });

                $('#Home_FoundProjectsContainer').html(dirs);

                //Give the table title some breathing space and make smaller
                let titleTd = $('#Index_FoundProjectsContainer > table > tbody > tr:nth-child(1) > td');
                titleTd.attr('colspan', 4).html('<h4>' + tableTitle + '</h4>');

                ////Tabs
                //Apps.Tabstrips.Initialize('Index_MainTabstrip');
                //Apps.Tabstrips.Select('Index_MainTabstrip', 0);

                ////Search content and border
                //$('#Index_MainTabstrip_HomeContent')
                //    .html($('#Index_WebRootSearch'))
                //    .css('border', '1px solid lightblue');

                ////Hide selected bottom border of tab by moving it down a little
                //$('#Index_HeaderRow > div.css3-tabstrip.Index_MainTabstrip-tabstrip-custom > ul > li:nth-child(1) > label')
                //    .css('position', 'relative').css('top', '1px');

                ////Docs content and border
                //$('#Index_MainTabstrip_DocsContent')
                //    .html($('#Index_DocsManager'))
                //    .css('border', '1px solid lightblue')
                //    .css('position', 'absolute')
                //    .css('left', '8px')
                //    .css('width', '100%');

                ////Hide Docs tab bottom row
                //$('#Index_HeaderRow > div.css3-tabstrip.Index_MainTabstrip-tabstrip-custom > ul > li:nth-child(2) > label')
                //    .css('position', 'relative').css('top', '1px');

                //Apps.Components.Docs.Show();
            });
            //$('#Index_WebRootFolder').off().on('change keyup', function (e) {

            //    Apps.Get('api/Overview/GetOpened', function (error, result) {
            //        if (!error && result.Success) {
            //            $('#Index_WebRootFolder').val(result.Data);
            //        }
            //        else {
            //            //Apps.Notify('warning', 'There was a problem getting the current config web root.');
            //            Apps.Dialogs.Open('AppsErrorDialog', 200, 200);
            //        }
            //    });

            //});
            ////Temp: setup click on notify:
            //$('.vnotify-container').on('click', function (e) {
            //    Apps.Notify('info', 'clicked!');
            //});

        },
        View: function() {

            let webRootFolder = $('#Index_WebRootFolder').val();
            Apps.Components.Overview.Event('view_project', webRootFolder);
},
        Search: function () {

            let folderPath = $('#Index_WebRootFolder').val();

            Apps.Get('api/Overview/FolderExists?folderPath=' + folderPath, function (error, result) {
                if (!error) {
                    if (result.Success) {
                        //search
                    }
                    else {
                        //folder doesn't exist (or blank)
                        if (confirm('That folder doesn\'t exist (or it\'s blank). Do you want me to start searching from the C:\\ drive?')) {

                            Apps.Get2('api/Overview/SearchCDrive', function (error, result) {
                                Apps.Notify('info', 'Search started. We\'ll let you know if we find anything.');
                            });
                        }
                    }
                }
                else
                    Apps.Notify('warning', 'Something happened on the way to the finding whether the folder exists.');
            });
        },
        Hide: function()
        {
            Apps.UI.Home.Hide();
        },
        Event: function (sender, args, callback)
        {
            switch (sender)
            {
                case 'load_login_html':
                    $('#Home_LoginContainer').html(Apps.UI.Login.Selector);
                    break;

                case 'save':

                    Apps.Notify('success', 'Lets just, say for arguments sake, that it was saved :)');

                    break;
            }
        }

    };
    return Me;
})