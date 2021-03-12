define([], function () {
    var Me = {
        Initialize: function (parent, callback) {
            Apps.LoadTemplate('Code', '/Scripts/Apps/Components/Apps/Create/Code/Code.html', function () {

                Apps.LoadStyle('/Scripts/Apps/Components/Apps/Create/Code/Code.css');

                Apps.UI.Code.Drop();

                if (callback)
                    callback();
            });
        },
        Show: function (appId) {
            Me.Initialize(function () {
                Apps.UI.Code.Show(400);
                

                Apps.Get2('/api/Create/GetFiles?appId=' + appId, function (result) {
                    if (result.Success) {
                        Apps.Notify('success', 'Got files!');

                    }
                    else
                        Apps.Notify('success', 'Problem getting files for app ID ' + appId);
                });
            });
        },
        Hide: function () {
            Apps.UI.Code.Hide(400);
        }
    };
    return Me;
});