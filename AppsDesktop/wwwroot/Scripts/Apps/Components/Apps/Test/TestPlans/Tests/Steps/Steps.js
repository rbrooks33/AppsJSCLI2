define([], function () {
    var Me = {
        Initialize: function (callback) {

            Apps.Data.RegisterGET('StepModel', '/api/Test/GetStepModel');
            Apps.Data.RegisterGET('Steps', '/api/Test/GetSteps?testId={0}');
            Apps.Data.RegisterPOST('UpsertStep','/api/Test/UpsertStep');

            Apps.Data.StepModel.Refresh();

        },
        Show: function (td, test, tr) {

            Apps.Data.Tests.Selected = test;

            let testRow = $('#Test_Tests_TestRow' + test.TestID);

            if (testRow.length == 0) {
               
                Me.GetSteps(test, function (html) {

                    $(tr).after('<tr><td id="Test_Tests_TestRow' + test.TestID + '" style="display:none;" colspan="7">' + html + '</td></tr>');

                    testRow = $('#Test_Tests_TestRow' + test.TestID);

                    testRow.show(400);

                });
            }
            else
                testRow.detach();

        },
        GetSteps: function (test, callback) {

            Apps.Data.Steps.Refresh([test.TestID], function (result) {

                let table = Apps.Grids.GetTable({
                    id: "gridSteps",
                    data: Apps.Data.Steps.Data,
                    title: test.TestName + ' <span style="color:lightgrey;"> Steps</span>',
                    tableactions: [
                        {
                            text: "Add Step",
                            actionclick: function () {
                                Apps.Components.Apps.Test.TestPlans.Tests.Steps.UpsertStep();
                            }

                        }],
                    tablestyle: "",
                    rowactions: [
                        {
                            text: "Delete",
                            actionclick: function (td, step, tr) {
                                if (confirm('Are you sure?')) {
                                    step.Archived = true;
                                    Apps.Data.Steps.Selected = step;
                                    Apps.Components.Apps.Test.TestPlans.Tests.Steps.UpsertStep();
                                }
                            }
                        },
                        {
                            text: "Edit Test Script",
                            actionclick: function (td, step, tr) {
                                Apps.Components.Apps.Test.TestPlans.Tests.Steps.EditTest.Show(step);
                            }
                        }

                    ],
                    //rowbuttons: [
                    //    {
                    //        text: "Steps",
                    //        buttonclick: function (td, test, tr) {
                    //            Apps.Components.Plan.Apps.App.TestPlans.Tests.Steps.ShowSteps(td, test, tr);
                    //        }
                    //    }
                    //],
                    fields: [
                        Me.StepField('ID'),
                        Me.StepField('TestID'),
                        Me.StepField('Order'),
                        Me.StepField('PreConditions'),
                        Me.StepField('Instructions'),
                        Me.StepField('Expectations'),
                        Me.StepField('Variations'),
                        // Me.StepField('Script'),
                        Me.StepField('Passed')
                    ],
                    columns: [
                        Me.StepColumn('ID', 'ID'),
                        Me.StepColumn('Order', 'Order'),
                        Me.StepColumn('PreConditions', 'Pre-Conditions'),
                        Me.StepColumn('Instructions', 'Instructions'),
                        Me.StepColumn('Expectations', 'Expectations'),
                        Me.StepColumn('Variations', 'Variations'),
                        //Me.StepColumn('Script', 'Test Script'),
                        Me.StepColumn('Passed', 'Result')
                    ]
                });

                if (callback)
                    callback(table.outerHTML);
            });
        },
        UpsertStep: function () {

            let step = Apps.Data.StepModel.Data;
            if (Apps.Data.Steps.Selected)
                step = Apps.Data.Steps.Selected;

            step.TestID = Apps.Data.Tests.Selected.TestID;

            Apps.Data.Post('UpsertStep', step, function () {
                Apps.Components.Apps.Test.TestPlans.Tests.Steps.RefreshSteps();
            });
        },
        RefreshSteps: function (test) {

            let testRow = $('#Test_Tests_TestRow' + Apps.Data.Tests.Selected.TestID);
            if (testRow.length == 1) {

                Me.GetSteps(Apps.Data.Tests.Selected, function (html) {

                    testRow.html(html);

                });
            }
        },
        StepField: function(fieldName) {
            {
                var editType = 'text';
                if (fieldName === 'Script')
                    editType = 'codeeditor';

                let fieldObj =
                {
                    name: fieldName,
                    edittype: editType,
                    editclick: function (td, rowdata, editControl) {
                    },
                    saveclick: function (td, step, input) {
                        let fieldName = $(td).attr('data-fieldname');
                        step[fieldName] = $(input).val();
                        Apps.Data.Steps.Selected = step;
                        Apps.Components.Apps.Test.TestPlans.Tests.Steps.UpsertStep();
                    }
                }
                return fieldObj;
            }

        },
        StepColumn: function (fieldName, text) {
            let colObj = {

                fieldname: fieldName,
                text: text,
                format: function (step) {
                    let result = '&nbsp;&nbsp;&nbsp;&nbsp;';
                    if (step[fieldName])
                        result = step[fieldName];

                    if (fieldName === 'Passed') {
                        result = '<div style="width:15px;height:15px;border:1px solid lightgrey;"></div>';
                    }
                    else if (fieldName === 'Script') {
                        //result = '<textarea id="App_TestPlans_Tests_Steps_StepScript' + step.TestStepID + '" style="width:200px;height:50px;"></textarea>';
                    }

                    return result;
                }
            };
            return colObj;
        }
    };
    return Me;
});