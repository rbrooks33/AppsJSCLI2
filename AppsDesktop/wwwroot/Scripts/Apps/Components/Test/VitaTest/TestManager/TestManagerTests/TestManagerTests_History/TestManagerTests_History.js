define([], function () {
    var Me = {
        Enabled: true,
        Color: 'blue',
        Name: 'TestManagerTests_History',
        UniqueID: null, //Primary key
        Items: [], //Collection of items
        Test: null, //Represents a single item in collection
        Run: null,
        Initialize: function () {

            Apps.Debug.Trace(this);

        },
        Show: function(test, reload)
        {
            Me.Test = test;

            Apps.Debug.Trace(this);

            if (reload) {

                Apps.LoadTemplate('TestManagerTests_History', Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components/TestManagerTests_History/TestManagerTests_History.html?version=' + Apps.Util.Ticks, function () {

                    Apps.LoadStyle(Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components/TestManagerTests_History/TestManagerTests_History.css?version=' + Apps.Util.Ticks);
                    Apps.UI.TestManagerTests_History.Show();

                });
            }
            else
                Apps.UI.TestManagerTests_History.Show();

            Me.Event('refresh_TestManagerTests_History');
        },
        Hide: function()
        {
            Apps.Debug.Trace(this);
            Apps.UI.TestManagerTests_History.Hide();
        },
        Event: function (sender, args, callback)
        {
            //TODO: change pages to components if a top-level
            Apps.Debug.Trace(this, 'TestManagerTests_History Event: ' + sender);

            switch (sender)
            {
                case 'view':

                    Me.Show();
                    break;

                case 'hide':

                    Apps.Pages.TestManagerTests_History.Hide();
                    break;

                case 'refresh_TestManagerTests_History':

                   // $('#divTestManagerTests_HistoryTable').empty();

                    Apps.RegisterDataSingle({ name: 'TestManagerTests_RunInstances', path: Apps.Settings.WebRoot + '/api/VitaTest/GetRunInstances?testId=' + Me.Test.testID }, function () {

                        Me.Items = Apps.Data.TestManagerTests_RunInstances.data; //Apps.Util.Linq(Apps.Data.TestManagerTests_HistoryItems, '$.UniqueID === ' + Me.UniquID); // + ' && $.Archived === false');
                        Me.Event('create_table');
                        //});
                    });
                    break;

                case 'create_table':


                    $.each(Me.Items, function (runIndex, run) {
                        run['testID'] = Me.Test.testID;
                    });
                    var table = Apps.Grids.GetTable({
                        title: ' ',
                        data: Me.Items,
                        tableactions: [
                            {
                                text: 'Add TestManagerTests_History Item', actionclick: function () {
                                    Apps.Pages.TestManagerTests_History.Event('add_item');
                                }
                            }
                        ],
                        fields: [
                            { name: 'testRunInstanceID' },
                            { name: 'testID' },
                            { name: 'testStepID' },
                            { name: 'dateCreated' },
                            { name: 'description' },
                            {
                                name: 'passed',

                                editclick: function (td, rowdata, editControl) { },
                                saveclick: function (td, item, editControl) {
                                    Apps.Pages.TestManagerTests_History.Event('save_item', arguments);
                                }
                            },
                            { name: 'datePassed' },
                            { name: 'dateFailed' }

                        ],
                        columns: [
                            {
                                fieldname: 'testRunInstanceID', text: 'Run ID', format: function (run) {
                                    return run.testRunInstanceID;
                                }
                            },
                            { fieldname: 'testID', text: 'Test', hidden: false },
                            { fieldname: 'testStepID', text: 'Step', hidden: false },
                            { fieldname: 'dateCreated', text: 'Date/Time' },
                            {
                                fieldname: 'description', text: 'Description', format: function (run) {

                                    let color = 'black';

                                    if (run.passed)
                                        color = 'green';
                                    else {
                                        if (!run.isNote)
                                            color = 'red';
                                    }
                                    return '<span style="color:' + color + ';">' + run.description + '</span>'; //default

                                }
                            },
                            { fieldname: 'passed', text: 'Passed' },
                            { fieldname: 'datePassed', text: 'Date Passed' },
                            { fieldname: 'dateFailed', text: 'Date Failed' }
                        ]
                    });

                    $('#divTestManagerTests_HistoryTable').html(table);


                    break;

                case 'add_item':

                    var item = {
                        Field1: '[EDIT]',
                        Field2: Me.UniqueID
                    };

                    Apps.Util.PostWithData('api/TestManagerTests_HistoryItems', JSON.stringify(tp), function (error, result) {

                        Apps.Debug.HandleError2(error, 'Failed to create.', JSON.stringify(result), 'Saved!', function () {

                            Apps.Pages.TestManagerTests_History.Event('refresh_TestManagerTests_History');

                        });
                    });

                    break;

                case 'save_item':

                    var tp = args[1];
                    tp.Field1 = $(args[2]).val(); //edit control

                    Apps.Util.PutWithData('api/TestManagerTests_HistoryItems/' + tp.UniqueID, JSON.stringify(tp), function (error, result) {

                        Apps.Debug.HandleError2(error, 'Failed to save.', JSON.stringify(result), 'Saved!', function () {

                            Apps.Pages.TestManagerTests_History.Event('refresh_TestManagerTests_History');

                        });
                    });

                    break;

                case 'remove_item':
                    //TODO
                    Me.Item = JSON.parse(Me.Item);
                    Me.Item.Archived = true;

                    Apps.Util.PutWithData('api/TestManagerTests_HistoryItems/' + Me.UniqueID, JSON.stringify(Me.Item), function (error, result) {

                        Apps.Debug.HandleError2(error, 'Failed to remove software requirement.', JSON.stringify(result), 'Item removed.', function () {

                            Apps.Pages.TestManagerTests_History.Event('refresh_TestManagerTests_History');

                        });
                    });

                    break;

                case 'show_run':

                    Me.Test = args[0];
                    Me.Run = args[1];

                    Apps.RegisterDataSingle({ name: 'TestManagerTests_RunInstancesByRun', path: Apps.Settings.WebRoot + '/api/VitaTest/GetRunInstances?testId=' + Me.Test.testID }, function () {

                        Me.Items = Apps.Util.Linq(Apps.Data.TestManagerTests_RunInstancesByRun.data, '$.testRunInstanceID === ' + Me.Run.testRunInstanceID); // + ' && $.Archived === false');
                        Me.Event('create_table');
                        
                    });

                    break;

                case 'show_run_refresh':

                    Me.Event('show_run', [Me.Test, Me.Run]); //Should only be run after initial show_run

                    break;
            }
        }

    };
    return Me;
})