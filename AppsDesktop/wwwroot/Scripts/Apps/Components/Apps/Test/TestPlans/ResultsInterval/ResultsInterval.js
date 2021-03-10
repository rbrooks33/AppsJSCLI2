define([], function () {
    var Me = {
        TestPlan: null,
        TableRow: null,
        TheIntervalID: null,
        TheIntervalOn: false,
        TheInterval: function () {
            if (Me.TheIntervalOn) {

                //Apps.Notify('info', ' The interval happening');
                //Apps.Notify('info', 'interval happening');
                $('.ResultsIntervalIndicatorStyle').css('border-color', 'green');
                $('.ResultsIntervalIndicatorStyle').css('background-color', 'green');
                setTimeout(function () { $('.ResultsIntervalIndicatorStyle').css('background-color', 'inherit'); }, 400);

                //Run test plan tests
                //Me.IntervalOn = false;
                //$('#gridTestPlans_Row0_RowButton1').click(); //Click Test Plans Run
                Apps.Components.Apps.Test.TestPlans.RefreshResults(Me.TestPlan, Me.TableRow);
            }
        },
        TheIntervalStart: function (testPlan, tableRow) {
            Me.TestPlan = testPlan;
            Me.TableRow = tableRow;
            Me.TheIntervalID = setInterval(Me.TheInterval, 5000);
            Me.TheIntervalOn = true;
            $('.ResultsIntervalIndicatorStyle').css('border-color', 'green');

        },
        TheIntervalStop: function (testPlan, tableRow) {
            Me.TestPlan = testPlan;
            Me.TableRow = tableRow;
            Me.TheIntervalID = null;
            Me.TheIntervalOn = false;
            $('.ResultsIntervalIndicatorStyle').css('border-color', 'cornflowerblue');
            $('.ResultsIntervalIndicatorStyle').css('background-color', 'inherit');
        }
    };
    return Me;
});