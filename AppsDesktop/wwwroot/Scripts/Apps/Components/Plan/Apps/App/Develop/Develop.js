define([], function () {
    var Me = {
        Data: null,
        Initialize: function (appId) {
            Apps.LoadTemplate('Develop', '/Scripts/Apps/Components/Plan/Apps/App/Develop/Develop.html', function () {
                //Apps.UI.Develop.Drop();

                Apps.Get2('/api/Develop/GetFiles?appId=' + appId, function (result) {

                });
            });
        }
    };
    return Me;
});