define([], function () {
    var Me = {
        CurrentApp: null,
        CurrentTestPlans: null,
        CurrentTestPlan: null,
        Initialize() {

            Apps.LoadTemplate('TestPlan', '/Scripts/Apps/Components/Apps/Test/TestPlans/TestPlans.html', function () {
                Apps.LoadStyle('/Scripts/Apps/Components/Apps/Test/TestPlans/TestPlans.css');

                Apps.UI.TestPlan.Drop(); //Use Drop to put hidden on dom

                //Data sources
                Apps.Data.RegisterGET('TestPlans', '/api/Test/GetTestPlans?appId={0}');
                Apps.Data.RegisterGET('TestPlanModel', '/api/Test/GetTestPlanModel');
                Apps.Data.RegisterPOST('UpsertTestPlan', '/api/Test/UpsertTestPlan');

                Apps.Data.TestPlanModel.Refresh();
            });            
        },
        Show: function () {

            var app = Apps.Data.App.Data[0];

            Apps.Data.TestPlans.Refresh([app.AppID], function () {

                let table = Apps.Grids.GetTable({
                    id: "gridTestPlans",
                    data: Apps.Data.TestPlans.Data,
                    title: app.AppName + ' <span style="color:lightgrey;">Test Plans</span>',
                    tableactions: [
                        {
                            text: "Run",
                            actionclick: function () {
                                Apps.Components.Apps.Test.TestPlans.Run();
                            }

                        },
                        {
                            text: "Add Test Plan",
                            actionclick: function () {
                                Apps.Components.Apps.Test.TestPlans.UpsertTestPlan();
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
                        }
                    ],
                    rowbuttons: [
                        {
                            text: "Tests",
                            buttonclick: function (td, testPlan, tr) {
                                Apps.Components.Apps.Test.TestPlans.ShowTests(td, testPlan, tr);
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
                        { name: 'TestPlanDescription' }
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
                                    result = testPlan.TestPlanName;

                                return result;
                            }
                        },
                        {
                            fieldname: 'TestPlanDescription',
                            text: 'Description'
                        }
                    ]
                });

                $('#App_Test_TemplateContent').html(table.outerHTML);
            });
        },
        UpsertTestPlan: function () {

            let testPlan = Apps.Data.TestPlanModel;
            if (Apps.Data.TestPlans.Selected)
                testPlan = Apps.Data.TestPlans.Selected;

            testPlan.AppID = Apps.Data.App.Data[0].AppID;

            Apps.Data.Post('UpsertTestPlan', testPlan, function () {
                Apps.Notify('success', 'Upserted test plan.');
                Apps.Components.Apps.Test.TestPlans.Show();
            });
        },
        //TODO: refactor these two methods
        ShowTests: function (td, testPlan, tr) {

            Apps.Data.TestPlans.Selected = testPlan;

            let testPlanRow = $('#Test_Tests_TestPlanRow' + testPlan.TestPlanID);

            if (testPlanRow.length == 0) {

                Me.Tests.GetTests(testPlan, function (html) {

                    $(tr).after('<tr><td id="Test_Tests_TestPlanRow' + testPlan.TestPlanID + '" style="display:none;" colspan="5">' + html + '</td></tr>');

                    testPlanRow = $('#Test_Tests_TestPlanRow' + testPlan.TestPlanID);

                    testPlanRow.show(400);

                });
            }
            else
                testPlanRow.detach();
        },
        RefreshTests: function (testPlan) {

            Apps.Data.TestPlans.Selected = testPlan;

            let testPlanRow = $('#Test_Tests_TestPlanRow' + testPlan.TestPlanID);

            if (testPlanRow.length == 1) {

                Me.Tests.GetTests(testPlan, function (html) {

                    testPlanRow.html(html);

                });
            }
        },
        Run: function () {
            Apps.Get2('api/Test/Run?appId=' + Me.CurrentApp.AppID, function (result) {
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