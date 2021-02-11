define(['./Tests/Tests.js'], function (tests) {
    var Me = {
        Tests: tests,
        CurrentApp: null,
        CurrentTestPlans: null,
        CurrentTestPlan: null,
        Initialize() {

            Me.Tests.Initialize();
            
        },
        GetTestPlans: function (app, callback) {

            Me.CurrentApp = app;
            
            Apps.Get2('/api/Test/GetTestPlanModel', function (result) {

                if (result.Success) {

                    Me.CurrentTestPlan = result.Data;

                    Apps.Get2('/api/Test/GetTestPlans?appId=' + app.AppID, function (result) {
                        if (result.Success) {
                            
                            //Apps.Notify('info', 'tests');
                            Me.CurrentTestPlans = result.Data;

                            let table = Apps.Grids.GetTable({
                                id: "gridTestPlans",
                                data: result.Data,
                                title: app.AppName + ' <span style="color:lightgrey;">Test Plans</span>',
                                tableactions: [
                                    {
                                        text: "Run",
                                        actionclick: function () {
                                            Apps.Components.Test.Run();
                                        }

                                    },
                                    {
                                        text: "Add Test Plan",
                                        actionclick: function () {
                                            Apps.Components.Test.CurrentTestPlan.AppID = Apps.Components.Plan.Apps.App.CurrentApp.AppID;
                                            Apps.Components.Test.UpsertTestPlan();
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
                                                Apps.Components.Test.CurrentTestPlan = testPlan;
                                                Apps.Components.Test.UpsertTestPlan();
                                            }
                                        }
                                    }
                                ],
                                rowbuttons: [
                                    {
                                        text: "Tests",
                                        buttonclick: function (td, testPlan, tr) {
                                            Apps.Components.Test.ShowTests(td, testPlan, tr);
                                        }
                                    }
                                ],
                                fields: [
                                    { name: 'TestPlanID' },
                                    {
                                        name: 'TestPlanName',
                                        editclick: function (td, rowdata, editControl) {
                                        },
                                        saveclick: function (td, testPlan, input) {
                                            testPlan.AppID = Apps.Components.Plan.Apps.App.CurrentApp.AppID;
                                            testPlan.TestPlanName = $(input).val();
                                            Apps.Components.Test.CurrentTestPlan = testPlan;
                                            Apps.Components.Test.UpsertTestPlan();
                                        }
                                    },
                                    { name: 'TestPlanDescription'}
                                ],
                                columns: [
                                    {
                                        fieldname: 'TestPlanID',
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

                            if (callback)
                                callback(table.outerHTML);
                        }
                        else
                            Apps.Notify('warning', 'Problem getting test plans.');
                    });
                }
                else
                    Apps.Notify('warning', 'Problem getting the test plan model.');
            });
        },
        UpsertTestPlan: function () {

            Apps.Post2('/api/Test/UpsertTestPlan', JSON.stringify(Me.CurrentTestPlan), function (result) {

                if (result.Success) {
                    Apps.Notify('success', 'Updated test plan.');
                    Apps.Components.Plan.Apps.App.RefreshTestPlans();
                }
                else
                    Apps.Notify('warning', 'Problem creating test plan.');
            });
        },
        ShowTests: function (td, testPlan, tr) {

            let testPlanRow = $('#Test_Tests_TestPlanRow' + testPlan.TestPlanID);

            if (testPlanRow.length == 0) {
                //testPlan.Archived = true;
                //Apps.Components.Test.CurrentTestPlan = testPlan;
                //Apps.Components.Test.UpsertTestPlan();
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

                }
                else
                    Apps.Notify('warning', 'Tests run not successful.');
            });
        }
    };
    return Me;
});