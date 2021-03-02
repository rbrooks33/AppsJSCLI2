define([], function () {
    var Me = {
        Initialize: function (callback) {
            Apps.LoadTemplate('AppComponents', '/Scripts/Apps/Components/Apps/Plan/AppComponents/AppComponents.html', function () {
                Apps.LoadStyle('/Scripts/Apps/Components/Apps/Plan/AppComponents/AppComponents.css');

                Apps.UI.AppComponents.Drop(); //Use Drop to put hidden on dom

                Apps.Data.RegisterGET('AppComponentModel', '/api/AppComponent/GetAppComponentModel');
                Apps.Data.AppComponentModel.Refresh();

                if (callback)
                    callback();
            });
        },
        Show: function (app) {
            //Apps.UI.AppComponents.Show();
            let html = Apps.
        }
    };
    return Me;
});

