//This component is being used as a data and 
//html source to populate a Test Plan "child" data source.
//That being the case, it is called like an instantiated object
//where Initialize is the ctor (auto-initialized is turned off)
define([], function () {
    var Me = {
        Initialize: function () {


            Apps.Data.RegisterGET('TestModel', '/api/Test/GetTestModel');
            Apps.Data.RegisterGET('Tests', '/api/Test/GetTests?testPlanId={0}');
            Apps.Data.RegisterGET('RunFunctional', '/api/TestRun/RunFunctional?appId={0}&type={1}&uniqueId={2}');

            Apps.Data.RegisterPOST('UpsertTest', '/api/Test/UpsertTest');

            Apps.Data.TestModel.Refresh();
        },
        //Entry point.
        Show: function () {


            //Change text on "Show Tests" button
            let showTests = $(testPlanRow).find('[id*="gridTestPlans_Row"][value="Show Tests"]'); //.val('Hide Tests');
            let hideTests = $(testPlanRow).find('[id*="gridTestPlans_Row"][value="Hide Tests"]'); 

            //Child row
            let testsRowId = 'Test_Tests_TestPlanRow' + testPlanId;
            let testsRow = $('#' + testsRowId);

            //if (showTests.length == 1) {

            //    showTests.val('Hide Tests');

            Me.TestGrid.Show();
            //}
            //else if (hideTests.length == 1) {
            //    testsRow.hide(500);
            //    testsRow.detach();
            //    hideTests.val('Show Tests');
            //}
        },
        Refresh: function () {
            //Test_Tests_TestPlanRow35 //td under this holds the tests table

        },
        Upsert: function () {

            let test = Apps.Data.TestModel.Data;
            if (Apps.Data.Tests.Selected)
                test = Apps.Data.Tests.Selected;
            else
                test.TestPlanID = Apps.Data.TestPlans.Selected.ID;

            Apps.Data.Post('UpsertTest', test, function (result) {
                Apps.Notify('success', 'Updated test.');
                Me.Show();
            });
        },
        RunFunctional: function (test) {
            Apps.Data.RunFunctional.Refresh([Apps.Data.App.Data[0].AppID, 2, test.ID], function () {
            //gridTests_ViewFormat_Row0_ColResults
                
            });
        },
        FormatResults: function (test) {
            //Get the last run instance for this test plan
            var result = '';
            let results = JSON.parse(test.Results);
            if (results) {
                result += Apps.Util.TimeElapsed(new Date(results.Instance.DateCreated));
                result += '<div style="display:flex;">';

                let groupedRuns = Enumerable.From(results.Runs).GroupBy('$.TestID').ToArray();

                $.each(groupedRuns, function (index, runGroup) {

                    let stepGroups = Enumerable.From(runGroup.source).GroupBy('$.TestStepID').ToArray();

                    $.each(stepGroups, function (stepGroupIndex, stepGroup) {

                        //Look for only non-note, that is the result
                        let passResult = Enumerable.From(stepGroup.source).Where('$.IsNote == false').ToArray();

                        if (passResult.length == 1) {

                            let backgroundColor = 'red';
                            if (passResult[0].Passed)
                                backgroundColor = 'green';

                            result += '<div title="' + passResult[0].Description + '" style="background-color:' + backgroundColor + '; width:15px;height:15px;border-radius:2px;margin:2px;"></div>';
                        }
                        //else
                        //    Apps.Notify('warning', 'Pass result either zero or more than one for test plan ' + test.TestPlanID);

                    });
                });
            }
            result += '</div>';
            return result;
        },
        RefreshTestResults: function () {

        },
        Test: function () {

        }
    };
    return Me;
});