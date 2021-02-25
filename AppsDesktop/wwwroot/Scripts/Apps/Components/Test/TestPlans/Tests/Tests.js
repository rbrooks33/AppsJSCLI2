define(['./Steps/Steps.js'], function (steps) {
    var Me = {
        Steps: steps,
        CurrentTest: null,
        CurrentTestPlan: null,
        Initialize: function (callback) {

            Apps.Get2('/api/Test/GetTestModel', function (result) {

                if (result.Success) {

                    Me.CurrentTest = result.Data;

                    if (callback)
                        callback();
                }
            });

        },
        GetTests: function (testPlan, callback) {

            Me.CurrentTestPlan = testPlan;

            Me.Initialize(function () {

                Apps.Get2('/api/Test/GetTests?testPlanId=' + testPlan.TestPlanID, function (result) {

                    if (result.Success) {

                        let table = Apps.Grids.GetTable({
                            id: "gridTests",
                            data: result.Data,
                            title: testPlan.TestPlanName + ' <span style="color:lightgrey;"> Tests</span>',
                            tableactions: [
                                {
                                    text: "Add Test",
                                    actionclick: function () {
                                        Apps.Components.Plan.Apps.App.TestPlans.Tests.UpsertTest();
                                    }

                                }],
                            tablestyle: "",
                            rowactions: [
                                {
                                    text: "Delete",
                                    actionclick: function (td, test, tr) {
                                        if (confirm('Are you sure?')) {
                                            test.Archived = true;
                                            Apps.Components.Plan.Apps.App.TestPlans.Tests.CurrentTest = test;
                                            Apps.Components.Plan.Apps.App.TestPlans.Tests.UpsertTest();
                                        }
                                    }
                                }
                            ],
                            rowbuttons: [
                                {
                                    text: "Steps",
                                    buttonclick: function (td, test, tr) {
                                        Apps.Components.Plan.Apps.App.TestPlans.Tests.Steps.ShowSteps(td, test, tr);
                                    }
                                }
                            ],
                            fields: [
                                { name: 'TestID' },
                                { name: 'TestPlanID' },
                                { name: 'TestName' ,
                                editclick: function (td, rowdata, editControl) { },
                                    saveclick: function (td, test, input) {
                                        test.TestName = $(input).val();
                                        Apps.Components.Plan.Apps.App.TestPlans.Tests.CurrentTest = test;
                                        Apps.Components.Plan.Apps.App.TestPlans.Tests.UpsertTest();
                                    }
                                },
                                {
                                    name: 'TestDescription',
                                    editclick: function (td, rowdata, editControl) {  },
                                    saveclick: function (td, test, input) {
                                        test.TestDescription = $(input).val();
                                        Apps.Components.Plan.Apps.App.TestPlans.Tests.CurrentTest = test;
                                        Apps.Components.Plan.Apps.App.TestPlans.Tests.UpsertTest();
                                    }
                                }
                            ],
                            columns: [
                                {
                                    fieldname: 'TestID',
                                    text: 'ID'
                                },
                                {
                                    fieldname: 'TestPlanID',
                                    text: 'TP ID'
                                },
                                {
                                    fieldname: 'TestName',
                                    text: 'Name',
                                    format: function (test) {
                                        let result = '&nbsp;&nbsp;&nbsp;&nbsp;';
                                        if (test.TestName)
                                            result = test.TestName;

                                        return result;
                                    }
                                },
                                {
                                    fieldname: 'TestDescription',
                                    text: 'Test',
                                    format: function (test) {
                                        let result = '&nbsp;&nbsp;&nbsp;&nbsp;';
                                        if (test.TestDescription)
                                            result = test.TestDescription;

                                        return result;
                                    }
                                }
                            ]
                        });

                        if (callback)
                            callback(table.outerHTML);

                    }
                    else
                        Apps.Notify('warning', 'Problem getting test plan tests.');
                });
            });
        },
        UpsertTest: function () {

            Me.CurrentTest.TestPlanID = Me.CurrentTestPlan.TestPlanID;

            Apps.Post2('/api/Test/UpsertTest', JSON.stringify(Me.CurrentTest), function (result) {

                if (result.Success) {
                    Apps.Notify('success', 'Updated test.');
                    Apps.Components.Plan.Apps.App.TestPlans.RefreshTests(Me.CurrentTestPlan);
                }
                else
                    Apps.Notify('warning', 'Problem creating test plan.');
            });
        },
        Test: function () {

        }
    };
    return Me;
});