define(['./Code/Code.js','./Templates/Templates.js'], function (code, templates) {
    var Me = {
        Code: code,
        Templates: templates,
        Initialize: function () {
            Apps.LoadTemplate('Create', '/Scripts/Apps/Components/Create/Create.html', function () {
                Apps.UI.Create.Drop();
                Me.Templates.Initialize();
            });
        },
        Show: function () {

            Apps.Get2('/api/Create/GetFiles?appId=' + Me.Data.CurrentApp.AppID, function (result) {

                if (result.Success) {
                    Apps.Notify('success', 'Got files. ' + result.Data.length);

                    let html = '';
                    html += '<table>';

                    $.each(result.Data, function (index, file) {

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
                }
                else
                    Apps.Notify('warning', 'Problem getting files.');

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
                //
                Apps.Get2('/api/Create/CreateAppSoftware?softwareType=3', function (result) {

                    if (result.Success) {
                        Apps.Notify('info', 'created!');
                        Apps.Components.Helpers.Dialogs.Close('Create_Software_List_Dialog');
                    }
                    else
                        Apps.Notify('warning', 'not create');

                });
            }
        }
    };
    return Me;
});