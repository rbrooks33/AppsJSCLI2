define([], function () {
    var Me = {
        Enabled: true,
        Color: 'blue',
        Name: 'MyTemplate',
        Initialize: function (callback) {

            Apps.LoadTemplate('MyTemplate', Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components/MyTemplate/MyTemplate.html', function () {

                Apps.LoadStyle(Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components/MyTemplate/MyTemplate.css');

                Apps.Components.MyTemplate.Event('view');

                //In case one needs to manually re-initialize and do something
                if (callback)
                    callback();
            });

        },
        Show: function()
        {
            Apps.UI.MyTemplate.Show();
        },
        Hide: function()
        {
            Apps.UI.MyTemplate.Hide();
        },
        Event: function (sender, args, callback)
        {
            switch (sender)
            {
                case 'view':

                    Me.Show();
                    break;
            }
        }

    };
    return Me;
})