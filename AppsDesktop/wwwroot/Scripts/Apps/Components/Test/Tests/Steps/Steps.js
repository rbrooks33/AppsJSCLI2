define([], function () {
    var Me = {
        CurrentStep: null,
        CurrentTest: null,
        CurrentTestPlan: null,
        Initialize: function (callback) {

            Apps.Get2('/api/Test/GetStepModel', function (result) {

                if (result.Success) {

                    Me.CurrentStep = result.Data;

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
                            title: test.TestDescription + ' <span style="color:lightgrey;"> Steps</span>',
                            tableactions: [
                                {
                                    text: "Add Step",
                                    actionclick: function () {
                                        Apps.Components.Test.Tests.Steps.UpsertStep();
                                    }

                                }],
                            tablestyle: "",
                            rowactions: [
                                {
                                    text: "Delete",
                                    actionclick: function (td, step, tr) {
                                        if (confirm('Are you sure?')) {
                                            step.Archived = true;
                                            Apps.Components.Test.Tests.Steps.CurrentStep = step;
                                            Apps.Components.Test.Tests.Steps.UpsertStep();
                                        }
                                    }
                                }
                            ],
                            //rowbuttons: [
                            //    {
                            //        text: "Steps",
                            //        buttonclick: function (td, test, tr) {
                            //            Apps.Components.Test.Tests.Steps.ShowSteps(td, test, tr);
                            //        }
                            //    }
                            //],
                            fields: [
                                Me.StepField('TestStepID'),
                                Me.StepField('TestID'),
                                Me.StepField('PreConditions'),
                                Me.StepField('Instructions'),
                                Me.StepField('Expectations'),
                                Me.StepField('Variations')
                            ],
                            columns: [
                                Me.StepColumn('TestStepID', 'ID'),
                                Me.StepColumn('PreConditions', 'Pre-Conditions'),
                                Me.StepColumn('Instructions', 'Instructions'),
                                Me.StepColumn('Expectations', 'Expectations'),
                                Me.StepColumn('Variations', 'Variations')
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
                    Apps.Components.Test.Tests.Steps.RefreshSteps(Me.CurrentTest);
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
                Apps.Components.Test.Tests.Steps.GetSteps(test, function (html) {

                    $(tr).after('<tr><td id="Test_Tests_TestRow' + test.TestID + '" style="display:none;" colspan="5">' + html + '</td></tr>');

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

                Apps.Components.Test.Tests.Steps.GetSteps(test, function (html) {

                    testRow.html(html);

                });
            }
        },
        StepField: function(fieldName) {
            {
                let fieldObj =
                {
                    name: fieldName,
                    editclick: function (td, rowdata, editControl) {
                    },
                    saveclick: function (td, step, input) {
                        let fieldName = $(td).attr('data-fieldname');
                        step[fieldName] = $(input).val();
                        Apps.Components.Test.Tests.Steps.CurrentStep = step;
                        Apps.Components.Test.Tests.Steps.UpsertStep();
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

                    return result;
                }
            };
            return colObj;
        }
    };
    return Me;
});