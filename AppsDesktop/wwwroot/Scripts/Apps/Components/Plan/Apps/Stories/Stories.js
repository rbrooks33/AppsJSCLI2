define(['./Controls/Controls.js'], function (controls) {
    var Me = {
        StoryModel: null,
        Controls: controls,
        Initialize: function (callback) {

            Apps.LoadTemplate('Stories', '/Scripts/Apps/Components/Plan/Stories/Stories.html', function () {
                Apps.LoadStyle('/Scripts/Apps/Components/Plan/Stories/Stories.css');

                Apps.UI.Stories.Show();

                Me.GetStoryModel();

                callback();
            });
        },
        GetStoryModel: function () {
            Apps.Get2('/api/Story/GetStoryModel', function (error, result) {

                if (result.Success) {
                    Me.StoryModel = result.Data;
                }
                else {
                    Apps.Notify('warning', 'Get model error');
                }
            });
        },
        List: function (appId) {
            Apps.Get2('/api/SoftwareStories/GetSoftwareStories?appId=' + appId, function (result) {
                if (result.Success) {
                    Apps.Notify('info', result.Data.length + ' stories.');

                    let html = ''; //Create list
                    html += '<table>';

                    $.each(result.Data, function (index, story) {

                        html += '  <tr>';
                        html += '    <td>' + story.StoryName + '</td>';
                        html += '  </tr>';

                    });
                    Apps.Components.Helpers.Dialogs.Content('Plan_Apps_Stories_List_Dialog', html);
                    Apps.Components.Helpers.Dialogs.Open('Plan_Apps_Stories_List_Dialog');


                }
                else
                    Apps.Notify('warning', 'Problem getting stories.');
            });
        },
        New: function () {
            Apps.Post2('/api/Story/UpsertStory', JSON.stringify(Me.StoryModel), function (result) {
                if (result.Success) {
                    Apps.Notify('success', 'New story created!');
                    Apps.Components.Dialogs.Close('Apps_Stories_NewStory_Dialog');
                }
                else {
                    Apps.Notify('warning', 'Error upserting story.');
                }
            });
        }
    };
    return Me;
});