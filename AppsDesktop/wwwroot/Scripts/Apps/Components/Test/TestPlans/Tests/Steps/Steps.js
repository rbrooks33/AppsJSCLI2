define(['./EditTest/EditTest.js'], function (edittest) {
    var Me = {
        EditTest: edittest,
        CurrentStep: null,
        CurrentTest: null,
        CurrentTestPlan: null,
        Initialize: function (callback) {

            Apps.Get2('/api/Test/GetStepModel', function (result) {

                if (result.Success) {

                    Me.CurrentStep = result.Data;

                    Me.EditTest.Initialize(Me); //Pass reference to parent

                    if (callback)
                        callback();
                }
            });

        },
        GetSteps: function (test, callback) {

            Me.CurrentTest = test;

            Me.Initialize(function () {

                Apps.Get2('/api/Test/GetSteps?testId=' + test.TestID, function (result) {

                    if (result.Success) {

                        let table = Apps.Grids.GetTable({
                            id: "gridSteps",
                            data: result.Data,
                            title: test.TestName + ' <span style="color:lightgrey;"> Steps</span>',
                            tableactions: [
                                {
                                    text: "Add Step",
                                    actionclick: function () {
                                        Apps.Components.Plan.Apps.App.TestPlans.Tests.Steps.UpsertStep();
                                    }

                                }],
                            tablestyle: "",
                            rowactions: [
                                {
                                    text: "Delete",
                                    actionclick: function (td, step, tr) {
                                        if (confirm('Are you sure?')) {
                                            step.Archived = true;
                                            Apps.Components.Plan.Apps.App.TestPlans.Tests.Steps.CurrentStep = step;
                                            Apps.Components.Plan.Apps.App.TestPlans.Tests.Steps.UpsertStep();
                                        }
                                    }
                                },
                                {
                                    text: "Edit Test Script",
                                    actionclick: function (td, step, tr) {
                                        Apps.Components.Plan.Apps.App.TestPlans.Tests.Steps.EditTest.Show(step);
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

                    }
                    else
                        Apps.Notify('warning', 'Problem getting steps.');
                });
            });
        },
        UpsertStep: function () {

            Me.CurrentStep.TestID = Me.CurrentTest.TestID;

            Apps.Post2('/api/Test/UpsertStep', JSON.stringify(Me.CurrentStep), function (result) {

                if (result.Success) {
                    Apps.Notify('success', 'Updated step.');
                    Apps.Components.Plan.Apps.App.TestPlans.Tests.Steps.RefreshSteps(Me.CurrentTest);
                }
                else
                    Apps.Notify('warning', 'Problem upserting step.');
            });
        },
        ShowSteps: function (td, test, tr) {

            let testRow = $('#Test_Tests_TestRow' + test.TestID);

            if (testRow.length == 0) {
                //testPlan.Archived = true;
                //Apps.Components.Test.CurrentTestPlan = testPlan;
                //Apps.Components.Test.UpsertTestPlan();
                Apps.Components.Plan.Apps.App.TestPlans.Tests.Steps.GetSteps(test, function (html) {

                    $(tr).after('<tr><td id="Test_Tests_TestRow' + test.TestID + '" style="display:none;" colspan="7">' + html + '</td></tr>');

                    testRow = $('#Test_Tests_TestRow' + test.TestID);

                    testRow.show(400);

                });
            }
            else
                testRow.detach();
        },
        RefreshSteps: function (test) {

            let testRow = $('#Test_Tests_TestRow' + test.TestID);
            if (testRow.length == 1) {

                Apps.Components.Plan.Apps.App.TestPlans.Tests.Steps.GetSteps(test, function (html) {

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
                        Apps.Components.Plan.Apps.App.TestPlans.Tests.Steps.CurrentStep = step;
                        Apps.Components.Plan.Apps.App.TestPlans.Tests.Steps.UpsertStep();
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