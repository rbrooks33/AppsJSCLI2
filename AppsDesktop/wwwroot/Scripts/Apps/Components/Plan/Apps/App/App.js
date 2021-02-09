define([], function () {
    var Me = {
        CurrentApp: null,
        Hidden: true,
        IntervalID: 0,
        Initialize: function (callback) {

            Apps.LoadTemplate('App', '/Scripts/Apps/Components/Plan/Apps/App/App.html', function () {

                Apps.LoadStyle('/Scripts/Apps/Components/Plan/Apps/App/App.css');


                //Me.IntervalID = setInterval(Me.Interval, 15000);
                Me.Resize();
                $(window).resize(function () { Me.Resize(); });

                if (callback)
                    callback();
            });
        },
        Interval: function () {
            if (!Me.Hidden) {
                Apps.Notify('info', 'interval');



            }
        },
        Resize: function () {
            let windowHeight = $(window).height();
            $('.AppContentStyle').height(windowHeight - 59);
            $('.tabstripApp-tabstrip-custom').height(windowHeight - 59 - 75);
        },
        Show: function (appId) {

            //Apps.Notify('info', 'hiya there');

            Me.Initialize(function () {

                Apps.Get2('/api/Apps/GetApp?appId=' + appId, function (result) {

                    if (result.Success) {

                        Me.CurrentApp = result.Data[0]; // JSON.parse(unescape(appString));

                        Apps.UI.App.Show(400);
                        Me.Hidden = false;

                        if ($('.tabstripApp-tabstrip-custom').length == 0) {
                            Apps.Tabstrips.Initialize('tabstripApp');
                            Apps.Tabstrips.Select('tabstripApp', 1);
                        }

                        $('.tabstripApp-tabstrip-custom').css('position', 'relative').css('top', '41px');
                        $('#Test_List_TemplateContent').addClass('Test_List_TemplateContent_Style');

                        Me.RefreshTestPlans();
                        Me.Resize();

                    }
                    else
                        Apps.Notify('warning', 'Problem loading app.');
                });
            });

        },
        RefreshTestPlans: function () {
            Apps.Components.Test.GetTestPlans(Me.CurrentApp, function (html) {

                $('#Test_List_TemplateContent').html(html);

            });
        },
        Close: function () {
            Apps.UI.App.Hide(400);
            Me.Hidden = true;
            clearInterval(Me.IntervalID);
        },
        Tests: function () {
            //refresh 
        }
    };
    return Me;
});