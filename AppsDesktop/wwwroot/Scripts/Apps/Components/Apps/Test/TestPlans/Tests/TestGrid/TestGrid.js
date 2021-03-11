define([], function () {
    var Me = {
        Parent: null,
        Initialize: function (parent) {
            Me.Parent = parent;
        },
        Show: function () {
            Me.Refresh(function () {
                Me.Show();
            });
        },
        Hide: function () {
            
        },
        Refresh: function (callback) {

            let testPlanRow = Me.Parent.Parent.CurrentTableRow;
            let testPlanId = Apps.Data.TestPlans.Selected.ID;

            Apps.Data.Tests.Refresh([testPlanId], function () {

                let tests = Apps.Data.Tests.Data;

                $.each(tests, function (index, test) {
                    test['RoleIDs'] = [];
                });

                let table = Apps.Grids.GetTable({
                    id: "gridTests",
                    data: tests,
                    title: Apps.Data.TestPlans.Selected.TestPlanName + ' <span style="color:lightgrey;"> Tests</span>',
                    tableactions: [
                        {
                            text: "Add Test",
                            actionclick: function () {
                                Apps.Data.Tests.Selected = null;
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
                        { name: 'Results' }
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
                if (testsRow.length == 0) {
                    //Insert
                    $(testPlanRow).after('<tr id="' + testsRowId + '" style="display:none;"><td colspan="6">' + table.outerHTML + '</td></tr>');

                    testsRow = $('#' + testsRowId); //Have to select again

                    $(table).css('margin-left', '10px').css('background', 'blanchedalmond');

                    $.each(tests, function (index, test) {
                        let button1 = $('gridTests_Row' + index + '_RowButton0');
                        button1.val(test.Steps.length);
                    });

                    //testsRow.show(500);
                }
                else {
                    //Refresh
                    testsRow.find('td').html(table.outerHTML);
                }

                if (callback)
                    callback();

            });

        }
    };
    return Me;
});