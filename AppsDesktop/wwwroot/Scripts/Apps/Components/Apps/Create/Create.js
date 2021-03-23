define([], function () {
    var Me = {
        AppsData: Apps.Components.Apps.Data,
        Initialize: function (parent) {
            Me.UI.Drop();
            Apps.Data.RegisterGET('CreateSoftware', '/api/Create/CreateAppSoftware?softwareType=[0]');
        },
        Show: function () {

            //Me.AppsData.GetFiles(Me.AppsData.App.Data.AppID, function () {
            Me.AppsData.Load('Files', [Me.AppsData.App.Data.AppID], function () {

                let html = '';
                html += '<table>';

                $.each(Me.AppsData.Files.Data, function (index, file) {

                    html += '  <tr>';
                    html += '    <td>' + file.FullName + '</td>';
                    html += '  </tr>';
                    html += '  <tr>';
                    html += '    <td>';

                    html += '       <table>';
                    $.each(file.SoftwareFileCodes, function (index, code) {
                        html += '         <tr>';
                        html += '           <td style="padding-left:20px;">' + code.Name + '</td>';
                        html += '         </tr>';
                    });
                    html += '       </table>';

                    html += '    </td>';
                    html += '  </tr>';

                });

                html += '</table>';

                let pageHtml = Apps.Util.GetHTML('App_Create_Template');
                pageHtml += html;

                $('#App_Create_TemplateContent').html(pageHtml);

                Me.Editor = ace.edit("App_Create_Project_Config_Editor");
                Me.Editor.setTheme("ace/theme/monokai");
                Me.Editor.session.setMode("ace/mode/csharp");
                Me.Editor.renderer.onResize(true);

                let editorContainer = $('#App_Create_Files_Container').find('.ace_editor');
                editorContainer.css('height', '500px');

            });
        },
        List: function (createType) {
            
            if (createType === 'software') {


                let html = Apps.Util.GetHTML('Create_Software_List_Template');

                let dialog = Apps.Components.Helpers.Dialogs;
                dialog.Content('Create_Software_List_Dialog', html);
                dialog.Open('Create_Software_List_Dialog');


            }
        },
        New: function (softwareType) {

            if (softwareType === 'net_core_web_service') {
                Apps.Data.CreateSoftware.Refresh([3], function () {
                    Apps.Components.Helpers.Dialogs.Close('Create_Software_List_Dialog');
                });
            }
            else if (softwareType === 'net_webapp_with_appsjs131') {

            }

            Apps.Notify('info', 'created!');
        }
    };
    return Me;
});