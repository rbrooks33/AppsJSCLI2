define([], function () {
    var Me = {
        Enabled: true,
        Color: 'blue',
        Name: 'TestManager',
        UniqueID: null, //Primary key
        Items: [], //Collection of items
        Item: null, //Represents a single item in collection
        Initialize: function (callback) {

            Apps.Debug.Trace(this);

            Apps.LoadTemplate('TestManager', Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components/VitaTest/Components/TestManager/TestManager.html', function () {

                Apps.LoadStyle(Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components/VitaTest/Components/TestManager/TestManager.css');

                //Apps.UI.TestManager.Drop();

                //Load software
                require([Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components/VitaTest/Components/TestManager/Components/TestManagerSoftware/TestManagerSoftware.js'], function (software) {

                    Me[software.Name] = software;

                    software.Initialize(function () {

                        if (callback)
                            callback();

                    });

                });
            });
            //var pagesRoot = Apps.Settings.AppsRoot + '/Components/VitaTest/Modules/TestManager/Modules';
            //Apps.RegisterPages(
            //    [
            //        { name: 'TestManagerSoftware', pageroot: pagesRoot },
            //        { name: 'TestManagerRequirements', pageroot: pagesRoot },
            //        { name: 'TestManagerTestPlans', pageroot: pagesRoot },
            //        { name: 'TestManagerTests', pageroot: pagesRoot },
            //        { name: 'TestManagerTestSteps', pageroot: pagesRoot },
            //        { name: 'TestManagerFuncSpecs', pageroot: pagesRoot }
            //    ]);

            $(window).on('resize', function () {
                $('#divTestManagerTable').height(window.innerHeight - 220);
            });
        },
        Show: function()
        {
            //Apps.Debug.Trace(this);
            //Apps.UI.TestManager.Show();
            Me.Initialize(function () {

                Apps.UI.TestManager.Show();

                $('#TestManager_Container').html(Apps.UI.TestManager.Selector);

                Me.Event('refresh_TestManager');

                $('#imgTestManagerLogo').attr('src', Apps.Settings.WebRoot + '/Images/VitacostLogo_2016_b.png');

                $('#divTestManagerTable').height(window.innerHeight - 220);

            });
        },
        Hide: function()
        {
            Apps.Debug.Trace(this);
            Apps.UI.TestManager.Hide();
        },
        Resize: function () {
            $('#divTestManagerTable').height = window.innerHeight;
        },
        OpenTestManagerWindow: function () {
            let params = 'scrollbars=no,resizable=yes,status=no,location=no,toolbar=no,menubar=no,outerWidth=1000,outerHeight=700,left=-1000,top=-1000';
            window.open(Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/TestManager.html', 'Test Manager', params);
        },
        RefreshSoftware: function () {

            Me.TestManagerSoftware.Table(function (softwareTable) {

                $('#divTestManager_Software').empty();
                $('#divTestManager_Software').append(softwareTable);

                //if (Apps.JQTE)
                //    $.fn.jqte = Apps.JQTE;

                //$('.editor').jqte();
            });

        },
        SelectSoftware: function (software) {

            $('#spanSelectedSoftware').text(software.softwareName);

            Me.RefreshRequirements(software);

            $('#divTestManager_Requirements').show();

        },
        RefreshRequirements: function (software) {

            Apps.Pages.TestManagerRequirements.Table(software, function (reqTable) {

                $('#divTestManager_Requirements').empty();
                $('#divTestManager_Requirements').append(reqTable);

                $('.editor').jqte();
            });

        },
        SelectRequirement: function (req) {

            if (req.softwareRequirementName.length > 25)
                req.softwareRequirementName = req.softwareRequirementName.substr(0, 25) + '...';

            $('#spanSelectedRequirement').text(req.softwareRequirementName);

            Me.RefreshTests(req);

            $('#divTestManager_Tests').show();

        },
        RefreshTests: function (req) {

            Apps.Pages.TestManagerTests.Table(req, function (testsTable) {

                $('#divTestManager_Tests').empty();
                $('#divTestManager_Tests').append(testsTable);

                $('.editor').jqte();
               // $('#divTestManager_Tests > table > tbody > tr:nth-child(3) > td:nth-child(2)').css('width', '10%');
            });
        },
        SelectTest: function (test) {

            if (test.testDescription.length > 25)
                test.testDescription = test.testDescription.substr(0, 25) + '...';

            $('#spanSelectedTest').text(test.testDescription);
            $('#spanSelectedTest').attr('testid', test.testID);

        },
        Event: function (sender, args, callback)
        {
            //TODO: change pages to components if a top-level
            Apps.Debug.Trace(this, 'TestManager Event: ' + sender);

            switch (sender)
            {
                case 'view':

                    Me.Show();
                    break;

                case 'hide':

                    Apps.Pages.TestManager.Hide();
                    break;

                case 'refresh_TestManager':

                    Me.RefreshSoftware();

                    break;

                case 'add_item':

                    var item = {
                        Field1: '[EDIT]',
                        Field2: Me.UniqueID
                    };

                    Apps.Util.PostWithData('api/TestManagerItems', JSON.stringify(tp), function (error, result) {

                        Apps.Debug.HandleError2(error, 'Failed to create.', JSON.stringify(result), 'Saved!', function () {

                            Apps.Pages.TestManager.Event('refresh_TestManager');

                        });
                    });

                    break;

                case 'save_item':

                    var tp = args[1];
                    tp.Field1 = $(args[2]).val(); //edit control

                    Apps.Util.PutWithData('api/TestManagerItems/' + tp.UniqueID, JSON.stringify(tp), function (error, result) {

                        Apps.Debug.HandleError2(error, 'Failed to save.', JSON.stringify(result), 'Saved!', function () {

                            Apps.Pages.TestManager.Event('refresh_TestManager');

                        });
                    });

                    break;

                case 'remove_item':
                    //TODO
                    Me.Item = JSON.parse(Me.Item);
                    Me.Item.Archived = true;

                    Apps.Util.PutWithData('api/TestManagerItems/' + Me.UniqueID, JSON.stringify(Me.Item), function (error, result) {

                        Apps.Debug.HandleError2(error, 'Failed to remove software requirement.', JSON.stringify(result), 'Item removed.', function () {

                            Apps.Pages.TestManager.Event('refresh_TestManager');

                        });
                    });

                    break;

            }
        }

    };
    return Me;
})