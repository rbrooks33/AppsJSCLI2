define([], function () {
    var Me = {
        IntervalID: 0,
        Initialize: function (callback) {

            //Me.Apps.Initialize();

            if(callback)
                callback();
        },
        Interval: function () {

        },
        Show: function () {
            Apps.UI.AppComponents.Show();
        },
        Test: function () {
            Apps.Notify('info', 'plan is testing!');

            //Refresh app.test: reload app.js and show
            require(['./Scripts/Apps/Components/Test/Test.js?ticks=' + new Date().getTime()], function (test) {

                Apps.Components.Test = test;
                Apps.Components.Test.Tests = test.Tests;

                require(['./Scripts/Apps/Components/Test/Tests/Steps/Steps.js?ticks=' + new Date().getTime()], function (steps) {

                    Apps.Components.Test.Tests.Steps = steps;

                    require(['./Scripts/Apps/Components/Plan/Apps/App/App.js?ticks=' + new Date().getTime()], function (app) {
                        Me.Apps.App = app;
                        Me.Apps.App.Initialize(function () {
                            Me.Apps.App.Show(2);
                        });
                    });
                });
            });
        }
    };
    return Me;
});