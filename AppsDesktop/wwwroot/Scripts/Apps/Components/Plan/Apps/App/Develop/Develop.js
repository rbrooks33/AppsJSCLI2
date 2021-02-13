define([], function () {
    var Me = {
        Data: {},
        Initialize: function (app) {
            Me.Data['CurrentApp'] = app;
            Apps.LoadTemplate('Develop', '/Scripts/Apps/Components/Plan/Apps/App/Develop/Develop.html', function () {
                //Apps.UI.Develop.Drop();

                Apps.Get2('/api/Develop/GetFiles?appId=' + app.AppID, function (result) {

                    if (result.Success) {
                        Apps.Notify('success', 'Got files. ' + result.Data.length);
                    }
                    else
                        Apps.Notify('warning', 'Problem getting files.');

                });
            });
        }
    };
    return Me;
});