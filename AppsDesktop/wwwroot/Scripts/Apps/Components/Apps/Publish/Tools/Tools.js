define([], function () {
    var Me = {
        Initialize: function () {

            Me.UI.Drop();        },
        Show: function () {
            Apps.UI.Tools.Show(400);
        },
        Hide: function () {
            Apps.UI.Tools.Hide(400);
        },
        GetPermissions: function () {

            let folder = $('#Apps_Publish_Tools_Perms_Folder_Textarea').val();
            let username = $('#Apps_Publish_Tools_Perms_Username_Textarea').val();

            Apps.Get2('/api/Publish/GetPermissions?folder=' + folder + '&username=' + username, function (result) {
                if (result.Success) {
                    Apps.Notify('success', 'Got perms!');

                    let html = '';
                    html += '<table>';
                    $.each(result.Data, function (index, data) {
                        html += '  <tr>';
                        html += '    <td>' + data + '</td>';
                        html += '  </tr>';
                    });
                    html += '</table>';

                    $('#Apps_Publish_Tools_Perms_Container').html(html);
                }
                else
                    Apps.Notify('success', 'Problem getting perms.');
            });

        }
    };
    return Me;
});