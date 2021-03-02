define([], function () {
    var Me = {
        Parent: null,
        StoryModel: null,
        Initialize: function (callback) {

            Apps.LoadTemplate('Stories', '/Scripts/Apps/Components/Apps/Plan/AppComponents/Stories/Stories.html', function () {
                Apps.LoadStyle('/Scripts/Apps/Components/Apps/Plan/AppComponents/Stories/Stories.css');

                Apps.UI.Stories.Show();

                //Me.GetStoryModel();

                if(callback)
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
        List: function () {
            Apps.Get2('/api/Story/GetStories?appId=' + Me.Parent.CurrentApp.AppID, function (result) {
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