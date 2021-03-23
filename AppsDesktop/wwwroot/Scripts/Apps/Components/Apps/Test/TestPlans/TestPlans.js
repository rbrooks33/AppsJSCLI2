define(['./ResultsInterval/ResultsInterval.js'], function (resultsinterval) {
    var Me = {
        ResultsInterval: resultsinterval,
        CurrentTestPlanRow: null,
        Initialize() {

            Me.UI.Show(400);

            //Data sources
            Apps.Data.RegisterGET('TestPlan', '/api/Test/GetTestPlan?testPlanId={0}')
            Apps.Data.RegisterGET('TestPlans', '/api/Test/GetTestPlans?appId={0}');
            Apps.Data.RegisterGET('TestPlanModel', '/api/Test/GetTestPlanModel');
            Apps.Data.RegisterGET('RunFunctional', '/api/TestRun/RunFunctional?appId={0}&type={1}&uniqueId={2}');
            Apps.Data.RegisterGET('LatestResults', '/api/TestRun/GetLatestResults?type={0}&uniqueId={1}');
            Apps.Data.RegisterPOST('UpsertTestPlan', '/api/Test/UpsertTestPlan');
            Apps.Data.TestPlanModel.Refresh();

        },
        IntervalID: null,
        IntervalOn: false,
        RefreshResultSIntervalOn: false,
        Interval: function () {
            if (Me.IntervalOn) {
                //Apps.Notify('info', 'interval happening');
                $('.IntervalIndicatorStyle').css('border-color', 'green');
                $('.IntervalIndicatorStyle').css('background-color', 'green');
                setTimeout(function () { $('.IntervalIndicatorStyle').css('background-color', 'inherit'); }, 400);

                //Run test plan tests
                Me.IntervalOn = false;
                $('#gridTestPlans_Row0_RowButton1').click(); //Click Test Plans Run
            }
        },
        IntervalStart: function() {
            Me.IntervalID = setInterval(Me.Interval, 3000);
            Me.IntervalOn = true;
            $('.IntervalIndicatorStyle').css('border-color', 'green');
        },
        IntervalStop: function () {
            Me.IntervalID = null;
            Me.IntervalOn = false;
            $('.IntervalIndicatorStyle').css('border-color', 'cornflowerblue');
            $('.IntervalIndicatorStyle').css('background-color', 'inherit');
        },
        Show: function () {

            var app = Apps.Data.App.Data[0];

            Apps.Data.TestPlans.Refresh([app.AppID], function () {

                let testPlans = Apps.Data.TestPlans.Data;

                //$.each(testPlans, function (index, tp) {
                //    tp['Results'] = '';
                //});

                let table = Apps.Grids.GetTable({
                    id: "gridTestPlans",
                    data: testPlans,
                    title: app.AppName + ' <span style="color:lightgrey;">Test Plans</span>',
                    tableactions: [
                        {
                            text: "Run",
                            actionclick: function () {
                                Apps.Components.Apps.Test.TestPlans.RunFunctional();
                            }

                        },
                        {
                            text: "Add Test Plan",
                            actionclick: function () {
                                Apps.Components.Apps.Test.TestPlans.UpsertTestPlan();
                            }

                        },
                        {
                            text: "Timer On",
                            actionclick: function () {
                                Apps.Components.Apps.Test.TestPlans.IntervalStart();
                            }

                        },
                        {
                            text: "Timer Off",
                            actionclick: function () {
                                Apps.Components.Apps.Test.TestPlans.IntervalStop();
                            }

                        }

                    ],
                    tablestyle: "",
                    rowactions: [
                        {
                            text: "Delete",
                            actionclick: function (td, testPlan, tr) {
                                if (confirm('Are you sure?')) {
                                    testPlan.Archived = true;
                                    Apps.Data.TestPlans.Selected = testPlan;
                                    Apps.Components.Apps.Test.TestPlans.UpsertTestPlan();
                                }
                            }
                        },
                        {
                            text: "Refresh Results On",
                            actionclick: function (td, testPlan, tr) {
                                Apps.Components.Apps.Test.TestPlans.ResultsInterval.TheIntervalStart(testPlan, tr);
                            }
                        },
                        {
                            text: 'Refresh Results Off',
                            actionclick: function (td, testPlan, tr) {
                                Apps.Components.Apps.Test.TestPlans.ResultsInterval.TheIntervalStop(testPlan, tr);
                            }
                        }

                    ],
                    rowbuttons: [
                        {
                            text: "Tests",
                            buttonclick: function (td, testPlan, tr) {
                                Apps.Components.Apps.Test.TestPlans.ShowTests(testPlan, tr);
                            }
                        },
                        {
                            text: 'Run',
                            buttonclick: function (td, testPlan, tr) {
                                Apps.Components.Apps.Test.TestPlans.RunFunctional(testPlan, tr);
                            }
                        }
                    ],
                    fields: [
                        { name: 'ID' },
                        {
                            name: 'TestPlanName',
                            editclick: function (td, rowdata, editControl) {
                            },
                            saveclick: function (td, testPlan, input) {
                                testPlan.AppID = Apps.Data.App.Data[0].AppID;
                                testPlan.TestPlanName = $(input).val();
                                Apps.Data.TestPlans.Selected = testPlan;
                                Apps.Components.Apps.Test.TestPlans.UpsertTestPlan();
                            }
                        },
                        { name: 'TestPlanDescription' },
                        { name: 'Results'}
                    ],
                    columns: [
                        {
                            fieldname: 'ID',
                            text: 'ID'
                        },
                        {
                            fieldname: 'TestPlanName',
                            text: 'Name',
                            format: function (testPlan) {
                                let result = '&nbsp;&nbsp;&nbsp;&nbsp;';
                                if (testPlan.TestPlanName)
                                    result = '<span style="font-size:22px;">' + testPlan.TestPlanName + '</span>';

                                return result;
                            }
                        },
                        {
                            fieldname: 'TestPlanDescription',
                            text: 'Description'
                        },
                        {
                            fieldname: 'Results',
                            text: 'Results',
                            format: function (testPlan) {
                                return Apps.Components.Apps.Test.TestPlans.FormatResults(testPlan);
                            }
                        }
                    ]
                });

                $('#App_Test_TemplateContent').html(table.outerHTML);

                $.each(Apps.Data.TestPlans.Data, function (index, tp) {
                    $('#gridTestPlans_Row' + index + '_RowButton0').val('Show Tests');
                });

                let tpHTML = Apps.Util.GetHTML('Apps_Tests_TestPlan_Template');
                $('#gridTestPlans').before(tpHTML);

            });
        },
        UpsertTestPlan: function () {

            let testPlan = Apps.Data.TestPlanModel.Data;
            if (Apps.Data.TestPlans.Selected)
                testPlan = Apps.Data.TestPlans.Selected;

            testPlan.AppID = Apps.Data.App.Data[0].AppID;

            Apps.Data.Post('UpsertTestPlan', testPlan, function () {
                Apps.Notify('success', 'Upserted test plan.');
                Apps.Components.Apps.Test.TestPlans.Show();
            });
        },
        ShowTests: function (testPlan, tr) {
            Apps.Data.TestPlans.Selected = testPlan;
            //Me.Tests.Initialize(testPlan.TestPlanName, testPlan.ID, tr, function () {
            Me.CurrentTableRow = tr;
            Me.Tests.Show();
            //});
        },
        FormatResults: function (testPlan) {
            //Get the last run instance for this test plan
            var result = '';
            let results = JSON.parse(testPlan.Results);
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
                            if(passResult[0].Passed)
                                backgroundColor = 'green';

                            result += '<div title="' + passResult[0].Description + '" style="background-color:' + backgroundColor + '; width:15px;height:15px;border-radius:2px;margin:2px;"></div>';
                        }
                        //else
                        //    Apps.Notify('warning', 'Pass result either zero or more than one for test plan ' + testPlan.ID);

                    });
                });
            }
            result += '</div>';
            return result;  
        },
        RunFunctional: function (tp, tableRow) {
            Apps.Data.RunFunctional.Refresh([Apps.Data.App.Data[0].AppID, 1, tp.ID], function () {
                Apps.Data.TestPlan.Refresh([tp.ID], function () {
                    Me.RefreshResults(Apps.Data.TestPlan.Data, tableRow, function () {
                        if(Me.IntervalID > 0) //Interval is active
                            Me.IntervalOn = true; //Turn interval back on after test run
                    });
                });
            });
        },
        RefreshResults: function (testPlan, tableRow, callback) {

            let rowIndex = $(tableRow).attr('rowindex');
            let resultsCell = $('#gridTestPlans_ViewFormat_Row' + rowIndex + '_ColResults');
            let tpResults = Me.FormatResults(testPlan);

            resultsCell.html(tpResults);

            if (Apps.Data.Tests) {

                //Refresh tests if open
                Apps.Data.Tests.Refresh([testPlan.ID], function () {

                    $.each(Apps.Data.Tests.Data, function (testIndex, test) {

                        let testHTML = Me.Tests.FormatResults(test);

                        let testGridRows = $('#gridTests').find('tr');
                        $.each(testGridRows, function (rowIndex, testGridRow) {

                            let rowDataIndex = $(testGridRow).attr('rowindex');
                            let rowData = $(testGridRow).attr('rowdata');

                            if (rowData) {
                                let testData = JSON.parse(unescape(rowData));
                                if (testData.ID == test.ID) {
                                    //Found row for this test
                                    $('#gridTests_ViewFormat_Row' + rowDataIndex + '_ColResults').html(testHTML);
                                }
                            }

                        });

                        if (Apps.Data.Steps) {
                            //Refresh Steps if open/visible
                            Apps.Data.Steps.Refresh([test.ID], function () {

                                $.each(Apps.Data.Steps.Data, function (stepIndex, step) {


                                    let stepHTML = Me.Tests.Steps.FormatResults(step);
                                    let stepGridRows = $('#gridSteps').find('tr'); //_ViewFormat_Row0_ColResults')

                                    $.each(stepGridRows, function (stepRowIndex, stepGridRow) {

                                        let stepRowDataIndex = $(stepGridRow).attr('rowindex');
                                        let stepRowData = $(stepGridRow).attr('rowdata');

                                        if (stepRowData) {
                                            let stepData = JSON.parse(unescape(stepRowData));
                                            if (stepData.ID == step.ID) {
                                                //Found row for this step
                                                $('#gridSteps_ViewFormat_Row' + stepRowDataIndex + '_ColResults').html(stepHTML);
                                            }
                                        }

                                    });

                                });
                            });
                        }
                    });

                    if (callback)
                        callback();

                });
            }
            else {
                if (callback)
                    callback();
            }
        },
        RunUnits: function () {
            Apps.Get2('api/Test/RunUnits?appId=' + Me.CurrentApp.AppID, function (result) {
                if (result.Success) {
                    Apps.Notify('success', 'Tests run successfully!');
                    let testResult = result.Data;
                    if (testResult.TestsPassed) {
                        Apps.Notify('success', 'All tests (' + testResult.Passed + ') passed!');
                    }
                    else {
                        Apps.Notify('warning', 'Some tests (' + testResult.Failed + ') failed :(');
                    }
                }
                else
                    Apps.Notify('warning', 'Tests run not successful.');
            });
        }
    };
    return Me;
});