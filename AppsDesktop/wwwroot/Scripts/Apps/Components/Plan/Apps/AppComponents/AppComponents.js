define(['./Stories/Stories.js'], function (stories) {
    var Me = {
        Stories: stories,
        Initialize: function (callback) {
            Apps.LoadTemplate('AppComponents', '/Scripts/Apps/Components/Plan/Apps/AppComponents/AppComponents.html', function () {
                Apps.LoadStyle('/Scripts/Apps/Components/Plan/Apps/AppComponents/AppComponents.css');

                Apps.UI.AppComponents.Drop(); //Use Drop to put hidden on dom

                if (callback)
                    callback();
            });
        },
        Show: function (app) {
            //Apps.UI.AppComponents.Show();

        }
    };
    return Me;
});

