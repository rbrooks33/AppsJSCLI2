define(['../../Resources/grid.js'], function (Grid) {
    var Me = {
        Enabled: true,
        Color: 'blue',
        Name: 'Overview',
        Messages: null,
        ViewData: null,
        Initialize: function (callback) {

            Apps.LoadTemplate('Overview', Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components/Overview/Overview.html', function () {

                Apps.LoadStyle(Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components/Overview/Overview.css');

                //Apps.Components.Overview.Event('view');
                $('#Index_OverviewContainer').html(Apps.UI.Overview.Selector);


                //In case one needs to manually re-initialize and do something
                if (callback)
                    callback();
            });

        },
        Show: function(viewData)
        {
            Me.ViewData = viewData;

            Apps.UI.Overview.Show();

            //Set up "Add Component" dialog
            var addComponentContent = Apps.BindTemplate('Overview_AddComponentTemplate');

            Apps.Dialogs.Register2('Overview_AddComponentDialog', {
                width: 500,
                height: 450,
                style: 'position:absolute;left:100px;top:100px;',
                title: { color: 'steelblue', text: 'Add Component' },
                content: addComponentContent,
                saveclick: function (id) {
                    Apps.Components.Overview.Event('add_component');
                    Apps.Dialogs.Close('Overview_AddComponentDialog');
                },
                cancelclick: function (id) {
                    Apps.Dialogs.Close('Overview_AddComponentDialog');
                }

            });

            $('#Overview_WebRootPath').text(Me.ViewData.BaseWebRootFolder);

            var table = '<table>';
           
            $.each(Me.ViewData.ValidationSteps, function (index, step) {
                let color = step.Passed ? 'green' : 'red';
                table += '<tr style="color:' + color + '">';
                table += '  <td>' + step.Step + '</td>';
                table += '  <td>' + step.Passed + '</td>';
                table += '</tr>';
            });
            table += '</table>';

            $('#Overview_ValidationSteps').html(table);

            Me.Event('get_component_report');
            Me.Event('get_resource_report');
        },
        Hide: function()
        {
            Apps.UI.Overview.Hide();
        },
        Event: function (sender, args, callback)
        {
            switch (sender) {
                case 'view':

                    Me.Show();
                    break;
                case 'get_component_report':

                    Apps.Get2('api/Overview/GetComponentReport', function (result) {

                        var table = Grid.GetTable({
                            data: result.Data.Components,
                            title: 'Components',
                            tableactions: [
                                //{
                                //    text: "Create Components",
                                //    actionclick: function () {
                                //        //Projects.UpsertProject('-1', 'ProjectName', '[new project]');
                                //    }
                                //},
                                {
                                    text: 'Add Component',
                                    actionclick: function () {
                                        Apps.Dialogs.Open('Overview_AddComponentDialog');
                                    }
                                }],
                            rowactions: [{
                                text: 'Delete', actionclick: function () {
                                    Apps.Components.Overview.Event('delete_component', arguments);
                                }
                            }
                            ],
                            fields: [
                                { name: 'IsOnDisk'},
                                { name: 'Name' },
                                { name: 'Description' },
                                { name: 'Version' },
                                { name: 'ComponentFolder' },
                                { name: 'TemplateFolder' },
                                { name: 'Load' },
                                { name: 'Initialize' },
                                { name: 'Color' },
                                { name: 'ModuleType' },
                                { name: 'Framework' }
                            ],
                            columns: [
                                { fieldname: 'IsOnDisk', text: 'On Disk'},
                                { fieldname: 'Name', text: 'Name' },
                                {
                                    fieldname: 'Description', text: 'Description'
                                },
                                { fieldname: 'Version', text: 'Version' },
                                { fieldname: 'ComponentFolder', text: 'Component Folder' },
                                { fieldname: 'TemplateFolder', text: 'Template Folder' },
                                { fieldname: 'Load', text: 'Load' },
                                { fieldname: 'Initialize', text: 'Initialize' },
                                { fieldname: 'Color', text: 'Color' },
                                { fieldname: 'ModuleType', text: 'Module Type' },
                                { fieldname: 'Framework', text: 'Framework' }
                            ]
                        });
                        $('#Overview_ComponentTable').html(table);

                    });
                    break;

                case 'get_resource_report':

                    Apps.Get2('api/Overview/GetResourceReport', function (result) {

                        var table = Grid.GetTable({
                            data: result.Data.Resources,
                            title: 'Resources',
                            tableactions: [
                                {
                                    text: 'Add Resource',
                                    actionclick: function () {

                                    }
                                }],
                            rowactions: [{
                                text: 'do', actionclick: function () {
                                }
                            }
                            ],
                            fields: [
                                { name: 'Name' },
                                { name: 'Description' },
                                { name: 'Enabled' },
                                { name: 'LoadFirst' },
                                { name: 'Order' },
                                { name: 'FileName' },
                                { name: 'ModuleType' }
                            ],
                            columns: [
                                { fieldname: 'Name', text: 'Name' },
                                { fieldname: 'Description', text: 'Description' },
                                { fieldname: 'Enabled', text: 'Enabled' },
                                { fieldname: 'LoadFirst', text: 'Load First' },
                                { fieldname: 'Order', text: 'Order' },
                                { fieldname: 'FileName', text: 'File Name' },
                                { fieldname: 'ModuleType', text: 'Module Type' }
                            ]
                        });
                        $('#Overview_ResourceTable').html(table);

                    });
                    break;

                case 'add_component':

                    let newComponent = {
                        Name: $('#Overview_NewComponentName').val(),
                        Description: $('#Overview_AddComponentDescription').val(),
                        Version: $('#Overview_AddComponentVersion').val(),
                        ModuleType: $('#Overview_AddComponentModuleTypes').val()
                    };

                    Apps.Post2('api/CLI/AddComponent', JSON.stringify(newComponent), function (result) {
                        Apps.Notify('success', newComponent.Name + ' component created successfully!');
                    });

                    break;
                case 'delete_component':

                    let componentString = args[1];
                    var componentRow = args[2];

                    if (confirm('WARNING: This will not only delete all components from the config by that name but also all files in that component\'s folder (only recoverable through OS Trash)!')) {
                        Apps.Post2('api/CLI/DeleteComponent', componentString, function (result)
                        {
                            componentRow.remove();
                            $.each(result.Messages, function (index, message) {
                                Apps.Notify('success', 'Message #' + index + 1 + ': ' + message);
                            });
                            Apps.Notify('success', 'Component successfully deleted!');
                        });
                    }


                    break;

                case 'view_project':

                    Apps.Get2('api/Overview/View?webRootFolder=' + args, function (result) {
                        Apps.Components.Overview.Show(result.Data);
                    });

                    break;

                case 'view_folder':

                    //Called by grid
                    let folderPathToView = JSON.parse(args[1]).Path;
                    Me.Event('view_project', folderPathToView);

                    break;

                case 'archive_folder':

                    //Called by grid
                    if (confirm('Are you sure that you want to archive? You can show later (once the show button exists :).')) {
                        let folderPathToArchive = JSON.parse(args[1]).Path;
                        var trToArchive = args[2];

                        Apps.Get2('api/Overview/ArchiveFoundDirectory?path=' + folderPathToArchive, function (result) {
                            Apps.Notify('success', 'Found folder archived.');
                            //Remove row
                            trToArchive.hide(1000);
                            //trToArchive.remove();
                        });
                    }

                    break;
            }
        }

    };
    return Me;
})