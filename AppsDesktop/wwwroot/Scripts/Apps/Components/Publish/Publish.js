define([], function () {
    var Me = {
        EditorPre: null,
        EditorPost: null,
        CurrentApp: null,
        CurrentPublishProfile: null,
        Initialize: function (callback) {
            Apps.LoadTemplate('Publish', '/Scripts/Apps/Components/Publish/Publish.html', function () {
                Apps.LoadStyle('/Scripts/Apps/Components/Publish/Publish.css');

                Apps.UI.Publish.Show();

                Me.Resize();
                $(window).resize(function () { Me.Resize(); });

                if(callback)
                    callback();
            });
        },
        Resize: function () {
            let windowWidth = $(window).width();
            let publishDeployTabWidth = windowWidth - 150;
            $('#Publish_Deploy_TemplateContent').width(publishDeployTabWidth);
        },
        GetModel: function (callback) {
            Apps.Get2('/api/Apps/GetPublishProfileModel', function (result) {
                if (result.Success) {
                    Me.CurrentPublishProfile = result.Data;
                    callback(Me.CurrentPublishProfile);
                }
            });
        },
        CloneRepo: function () {

            if (!Me.CurrentPublishProfile.LocalRepoPathExists) {
                let remoteRepoUrl = $('#Apps_Publish_Repo_RemoteURL_Text').val();
                let publishProfileId = Me.CurrentPublishProfile.PublishProfileID;

                Apps.Get2('/api/Publish/CloneRepo?remoteRepoUrl=' + remoteRepoUrl + '&publishProfileId=' + publishProfileId, function (result) {
                    if (result.Success) {
                        Apps.Notify('success', 'Cloned repo!');

                    }
                    else
                        Apps.Notify('warning', 'Prob getting repo.');
                });
            }
            else
                Apps.Notify('warning', 'The local repo at "' + Me.CurrentPublishProfile.LocalRepoPath + '" appears to already exist.');
        },
        //Entry point from App UI
        ShowList: function (appId) {

            Apps.Get2('/api/Apps/GetApp?appId=' + appId, function (result) {
                if (result.Success) {

                    Me.CurrentApp = result.Data[0]; // JSON.parse(unescape(appString));
                    Me.Initialize(function () {
                        //Apps_Publish_List_Dialog
                        let html = Apps.Util.GetHTML('Apps_Publish_List_Template')
                        Apps.Components.Helpers.Dialogs.Content('Apps_Publish_List_Dialog', html);
                        Apps.Components.Helpers.Dialogs.Open('Apps_Publish_List_Dialog');

                        let tableHtml = '';
                        tableHtml += '<table>';

                        $.each(Me.CurrentApp.PublishProfiles, function (index, pp) {

                            tableHtml += '  <tr>';
                            tableHtml += '    <td><div id="Publish_List_Edit_Button_ID' + pp.AppID + '" class="btn btn-warning" onclick="Apps.Components.Publish.Edit(' + pp.PublishProfileID + ');">Edit</div></td>';
                            tableHtml += '    <td>' + pp.Name + '</td>';
                            html += '  </tr>';
                        });

                        tableHtml += '</table>';

                        $('#Apps_Publish_List_Container').html(tableHtml);


                    });
                }
                else
                    Apps.Notify('warning', 'Problem getting current app.');
            });
        },
        Edit: function (publishProfileId) {

            Apps.Components.Helpers.Dialogs.Close('Apps_Publish_List_Dialog');

            Apps.Get2('/api/Apps/GetPublishProfile?publishProfileId=' + publishProfileId, function (result) {
                if (result.Success) {

                    Me.CurrentPublishProfile = result.Data;

                    //Me.Initialize(function () {


                    let html = Apps.Util.GetHTML('Apps_Publish_Edit_Template', [publishProfileId])
                    Apps.Components.Helpers.Dialogs.Content('Apps_Publish_Edit_Dialog', html);
                    Apps.Components.Helpers.Dialogs.Open('Apps_Publish_Edit_Dialog');

                    Apps.Tabstrips.Initialize('tabstripPublish');
                    Apps.Tabstrips.Select('tabstripPublish', 1);

                    $('#Publish_Deploy_TemplateContent').css('margin-left', '-73px');

                    Me.EditorPre = ace.edit("Apps_Publish_PreBuildScript_Editor");
                    Me.EditorPre.setTheme("ace/theme/monokai");
                    Me.EditorPre.session.setMode("ace/mode/csharp");
                    Me.EditorPre.renderer.onResize(true);
                    Me.EditorPre.setValue(Me.CurrentPublishProfile.PreBuildScript ? Me.CurrentPublishProfile.PreBuildScript : '');

                    Me.EditorPost = ace.edit("Apps_Publish_PostBuildScript_Editor");
                    Me.EditorPost.setTheme("ace/theme/monokai");
                    Me.EditorPost.session.setMode("ace/mode/csharp");
                    Me.EditorPost.renderer.onResize(true);
                    Me.EditorPost.setValue(Me.CurrentPublishProfile.PostBuildScript ? Me.CurrentPublishProfile.PostBuildScript : '');

                    $('#Apps_Publish_Edit_Name_Text').val(Me.CurrentPublishProfile.Name);
                    $('#Apps_Publish_Edit_Description_Textarea').val(Me.CurrentPublishProfile.Description);
                    $('#Apps_Publish_Edit_ProjectFilePath').val(Me.CurrentPublishProfile.ProjectFilePath);
                    $('#Apps_Publish_Edit_DestinationFolderPath').val(Me.CurrentPublishProfile.DestinationFolderPath);

                    $('#Apps_Publish_PostBuildScriptEnabled_Checkbox').prop('checked', Me.CurrentPublishProfile.RunPostBuildScript);
                    $('#Apps_Publish_PreBuildScriptEnabled_Checkbox').prop('checked', Me.CurrentPublishProfile.RunPreBuildScript);

                    //Test
                    $('#Apps_Publish_Edit_TestProjectFilePath').val(Me.CurrentPublishProfile.TestProjectFilePath);

                    //Repo
                    $('#Apps_Publish_Repo_RemoteURL_Text').val(Me.CurrentPublishProfile.RemoteRepoURL);
                    $('#Apps_Publish_Repo_LocalFolder').val(Me.CurrentPublishProfile.LocalRepoPath);
                    $('#Apps_Publish_Repo_LocalFolderExists_Checkbox').prop('checked', Me.CurrentPublishProfile.LocalRepoPathExists);

                    $('#Publish_Repo_TemplateContent').width('100%');

                    //});
                    Me.Resize();

                }
                else {
                    Apps.Notify('warning', 'Problem getting app to show.');
                }
            });
        },
        New: function () {
            Me.GetModel(function (ppModel) {

                ppModel.AppID = Me.CurrentApp.AppID;

                Apps.Post2('/api/Apps/UpsertPublishProfile', JSON.stringify(ppModel), function (result) {
                    if (result.Success) {
                        Apps.Notify('success', 'New Publish Profile created!');
                    }
                    else
                        Apps.Notify('warning', 'Failed creating profile.');
                });
            });
            
        },
        CompilePre: function (publishProfileId, selectedCodeOnly) {

            Apps.Components.Apps.Events.Pause = true;

            let code = Me.EditorPre.getValue();
            if (selectedCodeOnly)
                code = Me.EditorPre.getSelectedText();

            Apps.Get2('/api/Apps/Compile?code=' + code, function (result) {
                if (result.Success) {
                    Apps.Notify('success', 'compiled!');

                    Apps.Components.Apps.Events.Pause = false;

                }
                else {
                    Apps.Notify('warning', 'not compiled!');
                }
                $('#Apps_Publish_Results').val("Success messages: " + JSON.stringify(result.SuccessMessages) + ". Fail messages: " + JSON.stringify(result.FailMessages));
            });
        },
        CompilePost: function (publishProfileId, selectedCodeOnly) {

            Apps.Components.Apps.Events.Pause = true;

            let code = Me.EditorPost.getValue();
            if (selectedCodeOnly)
                code = Me.EditorPost.getSelectedText();

            Apps.Get2('/api/Apps/Compile?code=' + code, function (result) {
                if (result.Success) {
                    Apps.Notify('success', 'compiled!');

                    Apps.Components.Apps.Events.Pause = false;

                }
                else {
                    Apps.Notify('warning', 'not compiled!');
                }
                $('#Apps_Publish_Results').val("Success messages: " + JSON.stringify(result.SuccessMessages) + ". Fail messages: " + JSON.stringify(result.FailMessages));
            });
        },
        Publish: function () {

            Apps.Components.Track.Events.Pause = true;

            let destinationFolder = $('#Apps_Publish_Edit_DestinationFolderPath').val();
            let projectPath = $('#Apps_Publish_Edit_ProjectFilePath').val();

            Apps.Post2('/api/Apps/Publish?projectPath=' + projectPath + '&destinationFolder=' + destinationFolder, JSON.stringify(Me.CurrentPublishProfile), function (result) {
                if (result.Success) {

                    Apps.Notify('success', 'Published!');
                    $('#Apps_Publish_Results').val("Success messages: " + JSON.stringify(result.SuccessMessages) + ". Fail messages: " + JSON.stringify(result.FailMessages));

                    Apps.Components.Track.Events.Pause = false;
                }
                else {
                    Apps.Notify('warning', 'Not published! See events.');
                }
            });
        },
        Save: function () {

            Me.CurrentPublishProfile.Name = $('#Apps_Publish_Edit_Name_Text').val();
            Me.CurrentPublishProfile.Description = $('#Apps_Publish_Edit_Description_Textarea').val();
            Me.CurrentPublishProfile.ProjectFilePath = $('#Apps_Publish_Edit_ProjectFilePath').val();
            Me.CurrentPublishProfile.DestinationFolderPath = $('#Apps_Publish_Edit_DestinationFolderPath').val();

            Me.CurrentPublishProfile.PostBuildScript = Me.EditorPost.getValue();
            Me.CurrentPublishProfile.RunPostBuildScript = $('#Apps_Publish_PostBuildScriptEnabled_Checkbox').prop('checked');

            Me.CurrentPublishProfile.PreBuildScript = Me.EditorPre.getValue();
            Me.CurrentPublishProfile.RunPreBuildScript = $('#Apps_Publish_PreBuildScriptEnabled_Checkbox').prop('checked');

            //Test
            Me.CurrentPublishProfile.TestProjectFilePath = $('#Apps_Publish_Edit_TestProjectFilePath').val();

            //Repo
            Me.CurrentPublishProfile.RemoteRepoURL = $('#Apps_Publish_Repo_RemoteURL_Text').val();
            Me.CurrentPublishProfile.LocalRepoPath = $('#Apps_Publish_Repo_LocalFolder').val();
            //read-only (gotten on load)
            //Me.CurrentPublishProfile.LocalRepoPathExists = $('#Apps_Publish_Repo_LocalFolderExists_Checkbox').prop('checked');

            Apps.Post2('/api/Apps/UpsertPublishProfile', JSON.stringify(Me.CurrentPublishProfile), function (result) {
                if (result.Success) {
                    Apps.Notify('success', 'App saved!');
                    Apps.Components.Helpers.Dialogs.Close('Apps_Publish_Edit_Dialog');
                }
            });
        }
    };
    return Me;
});