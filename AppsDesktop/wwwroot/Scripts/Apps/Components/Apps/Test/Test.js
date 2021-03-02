define([], function () {
    var Me = {
        Initialize: function (callback) {
            Apps.LoadTemplate('Test', '/Scripts/Apps/Components/Apps/Test/Test.html', function () {
                Apps.LoadStyle('/Scripts/Apps/Components/Apps/Test/Test.css');

                Apps.UI.Test.Show(); //Use Drop to put hidden on dom

                if (callback)
                    callback();
            });
        },
        Show: function () {
            Apps.UI.Test.Show();
            Me.TestPlans.Show();
        },
        Hide: function () {
            Apps.UI.Test.Hide();
        }
    };
    return Me;
});