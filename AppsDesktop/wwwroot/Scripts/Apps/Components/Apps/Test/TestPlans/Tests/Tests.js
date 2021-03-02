define([], function () {
    var Me = {
        Initialize: function (callback) {
            Apps.Data.RegisterGET('TestModel', '/api/Test/GetTestModel');
            Apps.Data.RegisterGET('Tests', '/api/Test/GetTests?testPlanId={0}');
            Apps.Data.RegisterPOST('UpsertTest', '/api/Test/UpsertTest');

            Apps.Data.TestModel.Refresh();
        },
        //Entry point
        GetTests: function (testPlan, callback) {

            Apps.Data.TestModel.Data.TestPlanID = testPlan.ID; //Model is used for create new test

            Apps.Data.Tests.Refresh([testPlan.ID], function () {

                let table = Apps.Grids.GetTable({
                    id: "gridTests",
                    data: Apps.Data.Tests.Data,
                    title: testPlan.TestPlanName + ' <span style="color:lightgrey;"> Tests</span>',
                    tableactions: [
                        {
                            text: "Add Test",
                            actionclick: function () {
                                Apps.Components.Apps.Test.TestPlans.Tests.UpsertTest();
                            }

                        }],
                    tablestyle: "",
                    rowactions: [
                        {
                            text: "Delete",
                            actionclick: function (td, test, tr) {
                                if (confirm('Are you sure?')) {
                                    test.Archived = true;
                                    Apps.Data.Test.Selected = test;
                                    Apps.Components.Apps.Test.TestPlans.Tests.UpsertTest();
                                }
                            }
                        }
                    ],
                    rowbuttons: [
                        {
                            text: "Steps",
                            buttonclick: function (td, test, tr) {
                                Apps.Components.Apps.Test.TestPlans.Tests.Steps.Show(td, test, tr);
                            }
                        }
                    ],
                    fields: [
                        { name: 'TestID' },
                        { name: 'TestPlanID' },
                        {
                            name: 'TestName',
                            editclick: function (td, rowdata, editControl) { },
                            saveclick: function (td, test, input) {
                                test.TestName = $(input).val();
                                Apps.Data.Tests.Selected = test;
                                Apps.Components.Apps.Test.TestPlans.Tests.UpsertTest();
                            }
                        },
                        {
                            name: 'TestDescription',
                            editclick: function (td, rowdata, editControl) { },
                            saveclick: function (td, test, input) {
                                test.TestDescription = $(input).val();
                                Apps.Data.Tests.Selected = test;
                                Apps.Components.Apps.Test.TestPlans.Tests.UpsertTest();
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

            });
        },
        UpsertTest: function () {

            let test = Apps.Data.TestModel;
            if (Apps.Data.Tests.Selected)
                test = Apps.Data.Tests.Selected;

            Apps.Data.Post('UpsertTest', test.Data, function (result) {

                Apps.Notify('success', 'Updated test.');
                Apps.Components.Apps.Test.TestPlans.RefreshTests(Apps.Data.TestPlans.Selected);
            });
        },
        Test: function () {

        }
    };
    return Me;
});