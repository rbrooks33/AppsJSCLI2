define([], function () {
    var Me = {
        Enabled: true,
        Color: 'blue',
        Name: 'TestManagerTestSteps',
        TestID: null, //Primary key
        Step: null,
        Steps: [], //Collection of items
        Test: null, //Represents a single item in collection
        Initialize: function () {

            Apps.Debug.Trace(this);

        },
        Show: function(test)
        {
            Apps.Debug.Trace(this);
            //Apps.UI.TestManagerTestSteps.Show();

            Me.Event('refresh_TestManagerTestSteps', test);
        },
        Hide: function()
        {
            Apps.Debug.Trace(this);
            Apps.UI.TestManagerTestSteps.Hide();
        },
        Event: function (sender, args, callback)
        {
            //TODO: change pages to components if a top-level
            Apps.Debug.Trace(this, 'TestManagerTestSteps Event: ' + sender);

            switch (sender)
            {
                case 'view':

                    Me.Show();
                    break;

                case 'hide':

                    Apps.Components.TestManagerTestSteps.Hide();
                    break;

                case 'refresh_TestManagerTestSteps':

                    Me.Test = args;


                    Apps.RegisterDataSingle({ name: 'TestSteps', path: Apps.Settings.WebRoot + '/api/VitaTest/GetTestStepsByTest?db=' + Apps.ActiveDeployment.DB + '&testId=' + Me.Test.testID }, function () {

                        Me.Steps = Enumerable.From(Apps.Data.TestSteps.data)
                            .Where(function (ts) { return ts.archived === false; })
                            .OrderBy(function (ts) { return ts.order; })
                            .ToArray(); 

                        //$.fn.jqte = Apps.JQTE;

                        var table = Apps.Grids.GetTable({
                            title: 'Test Steps',
                            data: Me.Steps,
                            tableactions: [
                                {
                                    text: 'Add Step', actionclick: function () {
                                        Apps.Pages.TestManagerTestSteps.Event('add');
                                        return false;
                                    }
                                }
                            ],
                            rowbuttons: [
                                {
                                    text: 'Remove', buttonclick: function (td, rowdata) {
                                        let step = JSON.parse(rowdata);
                                        step.archived = true;
                                        Apps.Pages.TestManagerTestSteps.Event('save', step);
                                    }
                                }
                            ],
                            fields: [
                                { name: 'testStepID'},
                                {
                                    name: 'order', editclick: function () { }, saveclick: function ()
                                    {
                                        let step = arguments[1];
                                        step.order = $(arguments[2]).val();
                                        Apps.Pages.TestManagerTestSteps.Event('save', step);
                                    }
                                },
                                {
                                    name: 'preConditions', edittype: 'editor', editclick: function () { },
                                    saveclick: function ()
                                    {
                                        let step = arguments[1];
                                        step.preConditions = $(arguments[2]).val();
                                        Apps.Pages.TestManagerTestSteps.Event('save', step);
                                    }
                                }, 
                                {
                                    name: 'instructions', edittype: 'editor', editclick: function () { },
                                    saveclick: function () {
                                        let step = arguments[1];
                                        step.instructions = $(arguments[2]).val();
                                        Apps.Pages.TestManagerTestSteps.Event('save', step);
                                    }
                                }, 
                                {
                                    name: 'expectations', edittype: 'editor', editclick: function () { },
                                    saveclick: function () {
                                        let step = arguments[1];
                                        step.expectations = $(arguments[2]).val();
                                        Apps.Pages.TestManagerTestSteps.Event('save', step);
                                    }
                                },
                                {
                                    name: 'variations', edittype: 'editor', editclick: function () { },
                                    saveclick: function () {
                                        let step = arguments[1];
                                        step.variations = $(arguments[2]).val();
                                        Apps.Pages.TestManagerTestSteps.Event('save', step);
                                    }
                                },
                                {
                                    name: 'passed'
                                }
                            ],
                            columns: [
                                { fieldname: 'testStepID', text: 'ID', hidden: false },
                                {
                                    fieldname: 'order', text: 'Order', format: function (step) {
                                        return '&nbsp;' + step.order + '&nbsp;';
                                    }
                                },
                                {
                                    fieldname: 'preConditions', text: 'Pre-Conditions', format: function (step) {
                                        return '&nbsp;' + step.preConditions + '&nbsp;';
                                    }
                                },
                                {
                                    fieldname: 'instructions', text: 'Instructions', format: function (step) {
                                        return '&nbsp;' + step.instructions + '&nbsp;';
                                    } },
                                {
                                    fieldname: 'expectations', text: 'Expected', format: function (step) {
                                        return '&nbsp;' + step.expectations + '&nbsp;';
                                    }
                                },
                                {
                                    fieldname: 'variations', text: 'Variations', format: function (step) {
                                        return '&nbsp;' + step.variations + '&nbsp;';
                                    }
                                }
                                ,
                                {
                                    fieldname: 'passed', text: 'Passed', format(step) {
                                        if (step.passed === -1)
                                            return '<div data-stepid="' + step.testStepID + '" class="StepNotRunIcon"></div>';
                                        else if (step.passed === 1)
                                            return '<div data-stepid="' + step.testStepID + '" class="StepFailedIcon"></div>';
                                        else if (step.passed === 0)
                                            return '<div data-stepid="' + step.testStepID + '" class="StepPassedIcon"></div>';
                                    }
                                }

                            ]
                        });

                        $('#divTestManager_TestSteps').html(table);

                        //$.fn.jqte = Apps.JQTE;
                        $('.editor').jqte();

                        $('#divTestManager_TestSteps').show();
                    });

                    break;

                case 'add':

                    let newStep = {
                        testID: Me.Test.testID,
                        preConditions: 'no preconditions',
                        instructions: 'no instructions',
                        expectations: 'no expectations',
                        variations: 'no variations',
                        order: 0
                    };

                    Apps.Util.PostWithData(Apps.Settings.WebRoot + '/api/VitaTest/UpsertStep?db=' + Apps.ActiveDeployment.DB, JSON.stringify(newStep), function (error, result) {

                        Me.Show(Me.Test); //Apps.Pages.TestManager.RefreshTests(Apps.Pages.TestManagerTests.Requirement);

                    });

                    break;

                case 'save':


                    let step = args;

                    step.description = step.description ? step.description : 'no description';
                    step.description = step.description.trim().length === 0 ? '&nbsp;&nbsp;' : step.description;

                    step.preConditions = step.preConditions ? step.preConditions : 'no preconditions';
                    step.preConditions = step.preConditions.trim().length === 0 ? '&nbsp;&nbsp;' : step.preConditions;

                    step.expectations = step.expectations ? step.expectations : 'no expectations';
                    step.expectations = step.expectations.trim().length === 0 ? '&nbsp;&nbsp;' : step.expectations;

                    step.variations = step.variations ? step.variations : 'no variations';
                    step.variations = step.variations.trim().length === 0 ? '&nbsp;&nbsp;' : step.variations;


                    step.order = step.order ? step.order : '0';

                    Apps.Util.PostWithData(Apps.Settings.WebRoot + '/api/VitaTest/UpsertStep?db=' + Apps.ActiveDeployment.DB, JSON.stringify(step), function (error, result) {

                        Me.Show(Me.Test); //Apps.Pages.TestManager.RefreshTests(Apps.Pages.TestManagerTests.Requirement);

                    });

                    break;

                case 'remove_item':
                    //TODO
                    //Me.Item = JSON.parse(Me.Item);
                    Me.Step.Archived = true;

                    //Apps.Util.PutWithData('api/TestManagerTestStepsItems/' + Me.UniqueID, JSON.stringify(Me.Item), function (error, result) {

                    //    Apps.Debug.HandleError2(error, 'Failed to remove software requirement.', JSON.stringify(result), 'Item removed.', function () {

                    //        Apps.Pages.TestManagerTestSteps.Event('refresh_TestManagerTestSteps');

                    //    });
                    //});

                    break;

            }
        }

    };
    return Me;
})