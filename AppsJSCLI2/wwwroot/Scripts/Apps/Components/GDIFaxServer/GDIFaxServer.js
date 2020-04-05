define([], function () {
    var Me = {
        Enabled: true,
        Color: 'blue',
        Name: 'GDIFaxServer',
        Initialize: function (callback) {

            Apps.LoadTemplate('GDIFaxServer', Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components/GDIFaxServer/GDIFaxServer.html', function () {

                Apps.LoadStyle(Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components/GDIFaxServer/GDIFaxServer.css');

                //Apps.Components.GDIFaxServer.Event('view');

                //In case one needs to manually re-initialize and do something
                if (callback)
                    callback();
            });

        },
        Show: function()
        {
            Apps.UI.GDIFaxServer.Show();
        },
        Hide: function()
        {
            Apps.UI.GDIFaxServer.Hide();
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