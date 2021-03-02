define([], function () {
    var Me = {
        Enabled: true,
        Color: 'blue',
        Name: 'TestManagerTests',
        CurrentTestRunInstance: null,
        Requirement: null, 
        Initialize: function () {

            Apps.Debug.Trace(this);

            var pagesRoot = Apps.Settings.AppsRoot + '/Components/VitaTest/Modules/TestManager/Modules/TestManagerTests/Modules';
            Apps.RegisterPages(
                [
                    { name: 'TestManagerTests_History', pageroot: pagesRoot }
                ]);

        },
        Show: function () {
            Apps.Debug.Trace(this);
            Apps.UI.TestManagerTests.Show();
        },
        Hide: function () {
            Apps.Debug.Trace(this);
            Apps.UI.TestManagerTests.Hide();
        },
        Table: function (req, callback) {

            Me.Requirement = req;

            Apps.LoadTemplate('TestManagerTests', Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components/VitaTest/Modules/TestManager/Modules/TestManagerTests/TestManagerTests.html', function () {

                Apps.LoadStyle(Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components/VitaTest/Modules/TestManager/Modules/TestManagerTests/TestManagerTests.css');

                Apps.RegisterDataSingle({ name: 'TestManagerTests', path: Apps.Settings.WebRoot + '/api/VitaTest/GetTestsByRequirement?db=' + Apps.Settings.DB + '&softwareRequirementId=' + Me.Requirement.softwareRequirementID }, function (result, data) {

                    let unarchivedTests = Enumerable.From(Apps.Data.TestManagerTests.data).Where(function (tms) { return tms.archived === false; }).ToArray();

                    var table = Apps.Grids.GetTable({
                        title: '<i>' + req.softwareRequirementName + '</i> Test Scope',
                        data: unarchivedTests,
                        tableactions: [
                            {
                                text: 'Add Test Scope', actionclick: function () {
                                    Apps.Pages.TestManagerTests.Event('add');
                                }
                            }
                        ],
                        rowactions: [
                            {
                                text: 'Select', actionclick: function (td, rowdata) {
                                    Apps.Pages.TestManagerTests.Event('select', arguments);
                                }
                            }
                            ,
                            {
                                text: 'Ready', actionclick: function (td, rowdata) {
                                    let test = JSON.parse(arguments[1]); //TODO: fix this discrepancy
                                    test.ready = true;
                                    Apps.Pages.TestManagerTests.Event('save', test);
                                }
                            }
                            ,
                            {
                                text: 'Not Ready', actionclick: function (td, rowdata) {
                                    let test = JSON.parse(arguments[1]); //TODO: fix this discrepancy
                                    test.ready = false;
                                    Apps.Pages.TestManagerTests.Event('save', test);
                                }
                            }
                            ,
                            {
                                text: 'Passed', actionclick: function (td, rowdata) {
                                    let test = JSON.parse(arguments[1]); //TODO: fix this discrepancy
                                    test.passed = true;
                                    Apps.Pages.TestManagerTests.Event('save', test);
                                }
                            }
                            ,
                            {
                                text: 'Run', actionclick: function (td, rowdata) {
                                    let test = JSON.parse(arguments[1]); //TODO: fix this discrepancy
                                    //TODO: get sut and browse with testid
                                    //Check parent (in case was opened from application)
                                    //and browse using it (with testid of course)
                                    Apps.Pages.TestManagerTests.Run(test);
                                }
                            }
                            ,
                           {
                                text: 'Failed', actionclick: function (td, rowdata) {
                                    let test = JSON.parse(arguments[1]);
                                    test.passed = false;
                                    Apps.Pages.TestManagerTests.Event('save', test);
                                }
                            }
                            ,
                            {
                                text: 'Archive', actionclick: function (td, rowdata) {

                                    if (confirm('Are you sure?')) {

                                        let test = JSON.parse(arguments[1]); //TODO: fix this discrepancy
                                        test.archived = true;
                                        Apps.Pages.TestManagerTests.Event('save', test);
                                    }
                                }
                            }
                            ,
                            {
                                text: 'Get Script', actionclick: function (td, rowdata) {
                                    let test = JSON.parse(arguments[1]); //TODO: fix this discrepancy
                                    Apps.Pages.TestManagerTests.Event('get_script', test);
                                }
                            }
                            ,
                            {
                                text: 'Export To Markdown', actionclick: function (td, rowdata) {
                                    let test = JSON.parse(arguments[1]);
                                    Apps.Pages.TestManagerTests.Event('export_to_markdown', test);
                                }
                            }
                            ,
                            {
                                text: 'View Dependencies/Tools', actionclick: function (td, rowdata) {
                                    let test = JSON.parse(arguments[1]);
                                    Apps.Pages.TestManagerTests.Event('view_dependencies', test);
                                }
                            }
                            ,
                            {
                                text: 'View History', actionclick: function (td, rowdata) {
                                    let test = JSON.parse(arguments[1]);
                                    Apps.Pages.TestManagerTests.Event('view_history', test);
                                }
                            }
                            ,
                            {
                                text: 'View Parameters', actionclick: function (td, rowdata) {
                                    let test = JSON.parse(arguments[1]);
                                    Apps.Pages.TestManagerTests.Event('view_parameters', test);
                                }
                            }
                      ],
                        rowbuttonwidthpercent: 16,
                        rowbuttonorientation: 'left',
                        rowbuttons: [
                            {
                                text: 'Steps', buttonclick: function (td, rowdata) {
                                    let test = JSON.parse(arguments[1]); 
                                    Apps.Pages.TestManagerTests.Event('show_steps', test);
                                }
                            },
                            {
                                text: 'Run', buttonclick: function (td, rowdata) {
                                    let test = JSON.parse(arguments[1]); //TODO: fix this discrepancy
                                    //TODO: get sut and browse with testid
                                    //Check parent (in case was opened from application)
                                    //and browse using it (with testid of course)
                                    Apps.Pages.TestManagerTests.Run(test);
                                }
                            }

                        ],
                        fields: [
                            { name: 'testID' },
                            { name: 'testPlanID' },
                            {
                                name: 'testDescription',
                                editclick: function (td, rowdata, editControl) { },
                                saveclick: function (td, item, editControl) {
                                    let test = arguments[1]; //TODO: fix this discrepancy
                                    test.testDescription = $(editControl).val();
                                    Apps.Pages.TestManagerTests.Event('save', test);
                                }
                            },
                            { name: 'ready' }
                            ,
                            { name: 'passed' }
                            ,
                            {
                                name: 'jsFunction',
                                editclick: function (td, rowdata, editControl) { },
                                saveclick: function (td, item, editControl) {

                                    let test = arguments[1]; //TODO: fix this discrepancy
                                    test.jsFunction = $(editControl).val();
                                    Apps.Pages.TestManagerTests.Event('save', test);
                                }
                            }
                            ,
                            {
                                name: 'jsScript',
                                editclick: function (td, rowdata, editControl) { },
                                saveclick: function (td, item, editControl) {

                                    let test = arguments[1]; //TODO: fix this discrepancy
                                    test.jsScript = $(editControl).val();
                                    Apps.Pages.TestManagerTests.Event('save', test);
                                }
                            }
                        ],
                        columns: [
                            { fieldname: 'testID', text: 'ID', hidden: false },
                            { fieldname: 'testPlanID', text: 'Test Plan ID', hidden: true },
                            { fieldname: 'testDescription', text: ' ' },
                            {
                                fieldname: 'ready', text: 'Ready', format(test) {
                                    return test.ready ? '<div class="TestPassedIcon"></div>' : '<div class="TestFailedIcon"></div>';
                                }
                            },
                            {
                                fieldname: 'passed', text: 'Passed', format(test) {
                                    return test.passed ? '<div class="TestPassedIcon"></div>' : '<div class="TestFailedIcon"></div>';
                                }
                            },
                            { fieldname: 'jsFunction', text: 'JS Function' },
                            { fieldname: 'jsScript', text: 'Test Script', hidden: true}
                        ]
                    });

                    if (callback)
                        callback(table);
                });
            });
        },
        Run: function (test) {

            Apps.Util.Get(Apps.Settings.WebRoot + '/api/VitaTest/GetSUTByTestID?db=' + Apps.ActiveDeployment.DB + '&testId=' + test.testID, function (error, result) {

                if (!error) {
                    if (result.success) {

                        let sut = result.data;

                        Apps.Util.Get(Apps.Settings.WebRoot + '/api/VitaTest/GetNewRunInstance?db=' + Apps.ActiveDeployment.DB + '&testId=' + test.testID, function (error, result) {

                            Me.CurrentTestRunInstance = result.data;
                            
                            window.open(sut.host + '?testid=' + sut.testID, '_none');

                            Apps.Pages.TestManagerTestSteps.Show(test);
                            Apps.Pages.TestManagerTests_History.Event('show_run', [test, Me.CurrentTestRunInstance]);
                            Apps.UI.TestManagerTests_History.Show();

                        });
                    }
                    else
                        Apps.Notify('danger', 'Unable to get SUT: ' + result.message);
                }
                else
                    Apps.Notify('danger', 'Problem getting SUT.');
            });

        },
        Event: function (sender, args, callback) {
            //TODO: change pages to components if a top-level
            Apps.Debug.Trace(this, 'TestManagerTests Event: ' + sender);

            switch (sender) {
                case 'view':

                    Me.Show();
                    break;

                case 'hide':

                    Apps.Components.TestManagerTests.Hide();
                    break;

                case 'select':

                    let selectedTest = JSON.parse(args[1]);

                    Apps.Pages.TestManager.SelectTest(selectedTest);
                    break;

                case 'add':

                    let newTest = {
                        requirementID: Apps.Pages.TestManagerTests.Requirement.softwareRequirementID,
                        testDescription: 'no description',
                        jsFunction: 'no function',
                        jsScript: 'no script'
                    };

                    Apps.Util.PostWithData(Apps.Settings.WebRoot + '/api/VitaTest/AddTest?db=' + Apps.Settings.DB, JSON.stringify(newTest), function (error, result) {

                        Apps.Pages.TestManager.RefreshTests(Apps.Pages.TestManagerTests.Requirement);

                    });
                    break;

                case 'save':

                    let test = args;

                    if (!test.jsFunction)
                        test.jsFunction = 'no function';

                    if (!test.jsScript)
                        test.jsScript = 'no script';

                    Apps.Util.PostWithData(Apps.Settings.WebRoot + '/api/VitaTest/AddTest?db=' + Apps.ActiveDeployment.DB, JSON.stringify(test), function (error, result) {

                        Apps.Pages.TestManager.RefreshTests(Apps.Pages.TestManagerTests.Requirement);

                    });

                    break;

                case 'show_steps':

                    Apps.Pages.TestManagerTestSteps.Show(args);

                    break;

                case 'export_to_markdown':

                    let turndownService = new TurndownService();
                    let mdTest = args;
                    let md = '*' + mdTest.testDescription + '*\n';

                    turndownService.addRule('numbered', {
                        filter: ['ol'],
                        replacement: function (content) {
                            return '#' + content;
                        }
                    });

                    $.each(Apps.Pages.TestManagerTestSteps.Steps, function (stepIndex, step) {

                        md += '* Step ' + step.order + '\n';

                        step.preConditions = turndownService.turndown(step.preConditions);

                        if (step.preConditions.split('&nbsp;').join('').trim().length > 0)
                            md += '** *Pre-Requisite*: ' + step.preConditions + '\n';

                        if (step.instructions.split('&nbsp;').join('').trim().length > 0)
                            md += '** *Instructions*: ' + step.instructions + '\n';

                        if (step.expectations.split('&nbsp;').join('').trim().length > 0)
                            md += '** *Expect*: ' + step.expectations + '\n';

                        if (step.variations.split('&nbsp;').join('').trim().length > 0)
                            md += '** *Variations*: ' + step.variations + '\n';
                    });

                    Me.Event('download', ['test', md]);

                    break;

                case 'download':

                    let filename = args[0];
                    let text = args[1];
                    //function download(filename, text) {
                        var element = document.createElement('a');
                        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
                        element.setAttribute('download', filename);

                        element.style.display = 'none';
                        document.body.appendChild(element);

                        element.click();

                        document.body.removeChild(element);
                   // }
                    break;

                case 'view_dependencies':

                    eval('Apps.Components.' + args.jsFunction + '.ViewDependencies(args)');

                    break;
                case 'view_history':

                    Apps.Pages.TestManagerTests_History.Show(args, false);

                    break;
                case 'view_parameters':

                    Apps.Pages.TestManagerTests_History.Show(args, false);

                    break;
          }
        }

    };
    return Me;
});