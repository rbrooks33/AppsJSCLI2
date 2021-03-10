//This component is being used as a data and 
//html source to populate a Test Plan "child" data source.
//That being the case, it is called like an instantiated object
//where Initialize is the ctor (auto-initialized is turned off)
define([], function () {
    var Me = {
        ParentTitle: '',
        ParentID: null,
        ParentRow: null,
        Initialize: function (parentTitle, parentId, parentRow, callback) {

            Me.ParentTitle = parentTitle;
            Me.ParentID = parentId;
            Me.ParentRow = parentRow;

            Apps.Data.RegisterGET('TestModel', '/api/Test/GetTestModel');
            Apps.Data.RegisterGET('Tests', '/api/Test/GetTests?testPlanId={0}');
            Apps.Data.RegisterGET('RunFunctional', '/api/TestRun/RunFunctional?appId={0}&type={1}&uniqueId={2}');

            Apps.Data.RegisterPOST('UpsertTest', '/api/Test/UpsertTest');

            Apps.Data.TestModel.Refresh(null, function () {
                callback();
            });
        },
        //Entry point.
        Show: function () {

            //Change text on "Show Tests" button
            let showTests = $(Me.ParentRow).find('[id*="gridTestPlans_Row"][value="Show Tests"]'); //.val('Hide Tests');
            let hideTests = $(Me.ParentRow).find('[id*="gridTestPlans_Row"][value="Hide Tests"]'); 

            //Child row
            let rowId = 'Test_Tests_TestPlanRow' + Me.ParentID;
            let row = $('#' + rowId);

            if (showTests.length == 1) {

                showTests.val('Hide Tests');

                Apps.Data.Tests.Refresh([Me.ParentID], function () {

                    let tests = Apps.Data.Tests.Data;

                    $.each(tests, function (index, test) {
                        test['RoleIDs'] = [];
                    });

                    let table = Apps.Grids.GetTable({
                        id: "gridTests",
                        data: tests,
                        title: Me.ParentTitle + ' <span style="color:lightgrey;"> Tests</span>',
                        tableactions: [
                            {
                                text: "Add Test",
                                actionclick: function () {
                                    Apps.Components.Apps.Test.TestPlans.Tests.Upsert();
                                }

                            }],
                        tablestyle: "background:aliceblue;",
                        rowactions: [
                            {
                                text: "Delete",
                                actionclick: function (td, test, tr) {
                                    if (confirm('Are you sure?')) {
                                        test.Archived = true;
                                        Apps.Data.Tests.Selected = test;
                                        Apps.Components.Apps.Test.TestPlans.Tests.Upsert();
                                    }
                                }
                            }
                        ],
                        rowbuttons: [
                            {
                                text: "Show Steps",
                                buttonclick: function (input, test, tr) {
                                    //$(input).val('Steps (' + test.Steps.length + ')'); // $('#stepid_' + test.TestID).find( + ' div > input:nth-child(1)').val());
                                    Apps.Components.Apps.Test.TestPlans.Tests.Steps.Show(input, test, tr);
                                }
                            },
                            //{
                            //    text: "Scripts",
                            //    buttonclick: function (input, test, tr) {
                            //        Apps.Components.Apps.Test.TestPlans.Tests.Steps.Show(input, test, tr);
                            //    }
                            //},
                            {
                                text: "Run",
                                buttonclick: function (input, test, tr) {
                                    Apps.Components.Apps.Test.TestPlans.Tests.RunFunctional(test);
                                }
                            }
                        ],
                        fields: [
                            { name: 'ID' },
                            { name: 'TestPlanID' },
                            {
                                name: 'TestName',
                                editclick: function (td, rowdata, editControl) { },
                                saveclick: function (td, test, input) {
                                    test.TestName = $(input).val();
                                    Apps.Data.Tests.Selected = test;
                                    Apps.Components.Apps.Test.TestPlans.Tests.Upsert();
                                }
                            },
                            { name: 'RoleIDs' },
                            {
                                name: 'TestDescription',
                                editclick: function (td, rowdata, editControl) { },
                                saveclick: function (td, test, input) {
                                    test.TestDescription = $(input).val();
                                    Apps.Data.Tests.Selected = test;
                                    Apps.Components.Apps.Test.TestPlans.Tests.Upsert();
                                }
                            },
                            { name: 'Results'}
                        ],
                        columns: [
                            {
                                fieldname: 'ID',
                                text: 'ID'
                            },
                            {
                                fieldname: 'TestPlanID',
                                text: 'TP ID', hidden: true
                            },
                            {
                                fieldname: 'TestName',
                                text: 'Name',
                                format: function (test) {
                                    let result = '&nbsp;&nbsp;&nbsp;&nbsp;';
                                    if (test.TestName)
                                        result = '<span style="font-size:17px;font-weight:bold;">' + test.TestName + '</span>';

                                    return result;
                                }
                            },
                            {
                                fieldname: 'RoleIDs',
                                text: 'Roles'
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
                            },
                            {
                                fieldname: 'Results',
                                text: 'Results',
                                format: function (test) {
                                    return Apps.Components.Apps.Test.TestPlans.Tests.FormatResults(test);
                                }
                            }

                        ]
                    });

                    //Look for row under Test Plan. If not there, create it. If there, detach it.
                    if (row.length == 0) {
                        //Insert
                        $(Me.ParentRow).after('<tr id="' + rowId + '" style="display:none;"><td colspan="6">' + table.outerHTML + '</td></tr>');

                        row = $('#' + rowId); //Have to select again

                        $(table).css('margin-left', '10px').css('background', 'blanchedalmond');

                        $.each(tests, function (index, test) {
                            let button1 = $('gridTests_Row' + index + '_RowButton0');
                            button1.val(test.Steps.length);
                        });

                        row.show(500);
                    }
                    else {
                        //Refresh
                        row.find('td').html(table.outerHTML);
                    }
                });
            }
            else if (hideTests.length == 1) {
                row.hide(500);
                row.detach();
                hideTests.val('Show Tests');
            }
        },
        Upsert: function () {

            let test = Apps.Data.TestModel.Data;
            if (Apps.Data.Tests.Selected)
                test = Apps.Data.Tests.Selected;

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