define([], function () {
    var Me = {
        Enabled: true,
        Color: 'blue',
        Name: 'VitaTest',
        UniqueID: null, //Primary key
        Items: [], //Collection of items
        Item: null, //Represents a single item in collection
        ModulesReady: null,
        Initialize: function (callback) {

            //Apps.Debug.Trace(this);

            //TODO: Move loading of template to register method like modules (sub-components)
            //For now plz delete this for modules (except if sub-sub-modules are needed)
            Apps.LoadTemplate('VitaTest', Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components/Test/VitaTest/VitaTest.html', function () {

                Apps.LoadStyle(Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components/Test/VitaTest/VitaTest.css');

                if (callback)
                    callback();
                //Load Test Manager also

                //Apps.ComponentsConfig.Components[6].Components
                ////NOTE: For now at least one module must exist to fire "modules ready for test"
                //var pagesRoot = Apps.Settings.AppsRoot + '/Components/VitaTest/Modules';
                //Apps.RegisterPages(
                //    [
                //        { name: 'Test538', pageroot: pagesRoot },
                //        { name: 'TestSUT', pageroot: pagesRoot },
                //        { name: 'TestManager', pageroot: pagesRoot }
                //    ]);

                //Apps.Components.VitaTest.Event('view');
            });

        },
        Show: function()
        {
            //Apps.Debug.Trace(this);
            Apps.UI.VitaTest.Show();
            //$('#col2').append(Apps.UI.VitaTest.Selector);

            //Load existing software
            //Apps.Components.VitaTest.Event('load_software');
            //Apps.Components.VitaTest.Event('load_requirements');
        },
        Test: function (sut) {

            //Apps.Debug.Trace(this);


            ////TODO auto map to test function (e.g. database entry of test with method name?)
            //switch (sut.host) {

            //    case 'localhost.vitacost.com':

            //        switch (sut.testID) {
            //            case 3: Apps.Pages.Test538.SA_Is_Not_Using_MD5(); break;
            //        }

            //        break;
            //}
        },
        Hide: function()
        {
            //Apps.Debug.Trace(this);
            Apps.UI.VitaTest.Hide();
        },
        AddRequirement: function () {

            let newRequirement = {
                SoftwareID: $('#selectRequirementSoftware').val(),
                SoftwareRequirementName: $('#inputAddRequirementName').val(),
                Order: 0,
                Archived: false
            };

            Apps.Util.PostWithData(Apps.Settings.WebRoot + '/api/VitaTest/AddRequirement?db=' + Apps.Settings.DB, JSON.stringify(newRequirement), function (error, result) {

            });

        },
        Event: function (sender, args, callback)
        {
            //TODO: change pages to components if a top-level
            //Apps.Debug.Trace(this, 'VitaTest Event: ' + sender);

            switch (sender)
            {
                case 'view':

                    Me.Show();
                    break;

                case 'hide':

                    Apps.Components.VitaTest.Hide();
                    break;

                case 'show_hide_softwaremanagement':

                    if ($('#divSoftwareManagement').css('opacity') === '0') {
                        $('#divSoftwareManagement').animate({ opacity: 1 }, 400);
                        $('#divSoftwareManagement').css('display', 'block');
                    }
                    else {
                        $('#divSoftwareManagement').animate({ opacity: 0 }, 400);
                        $('#divSoftwareManagement').css('display', 'none');
                    }
                    break;

                case 'load_software':

                    Apps.Util.Get(Apps.Settings.WebRoot + '/api/VitaTest/GetSoftwares?db=' + Apps.Settings.DB,  function (error, result) {
                        if (result.success) {
                            $.each(result.data, function (softwareIndex, software) {

                                $('#divSoftwareList').append('<div>' + software.softwareName + '</div>');
                            });

                            //Fill dropdown
                            Apps.Util.RefreshCombobox(result.data, 'selectRequirementSoftware', 0, 'Select Software', 'softwareID', 'softwareName', function () {
                                //click/select

                            });
                        }
                    });

                    break;

                case 'load_requirements': 

                    Apps.Util.Get(Apps.Settings.WebRoot + '/api/VitaTest/GetRequirements?db=' + Apps.Settings.DB, function (error, result) {
                        if (result.success) {
                            //$.each(result.data, function (reqIndex, req) {

                            //    $('#divRequirementsList').append('<div>' + req.softwareRequirementName + '</div>');
                            //});
                            var table = Apps.Grids.GetTable({
                                title: 'Requirements',
                                data: result.data,
                                tableactions: [
                                    {
                                        text: 'Add Requirement', actionclick: function () {
                                            //Apps.Pages.MyTemplate.Event('add_item');
                                        }
                                    }
                                ],
                                //rowbuttons: [
                                //    {
                                //        text: 'Remove', buttonclick: function (td, rowdata) {
                                //            Apps.Pages.MyTemplate.Item = JSON.parse(rowdata);
                                //            Apps.Pages.MyTemplate.Event('remove_item');
                                //        }
                                //    }
                                //],
                                fields: [
                                    { name: 'softwareRequirementID' },
                                    { name: 'softwareID' },
                                    {
                                        name: 'softwareRequirementName',

                                        editclick: function (td, rowdata, editControl) { },
                                        saveclick: function (td, item, editControl) {
                                            //Apps.Pages.MyTemplate.Event('save_item', arguments);
                                        }
                                    }

                                ],
                                columns: [
                                    { fieldname: 'softwareRequirementID', text: 'ID', hidden: false },
                                    { fieldname: 'softwareID', text: 'Software ID' },
                                    { fieldname: 'softwareRequirementName', text: 'Requirement'}
                                ]
                            });

                            $('#divRequirementsList').append(table);
                        }
                    });

                    break;

                case 'fullscreen':

                    $('#divMain').append(Apps.UI.VitaTest.Selector);
                    $('#divVitaTestContent').addClass('Full');
                    $('#divVitaTestContent').css('height', screen.height);
                    $('#divVitaTestContent').css('margin-left', '0px');
                    $('#divMain').css('margin', '0px');

                    break;

                case 'normalscreen':

                    $('#divVitaTestContent').removeClass('Full');
                    $('#divVitaTestContent').css('height', '');
                    $('#divVitaTestContent').css('margin-left', '50px');
                    $('#col2').append(Apps.UI.VitaTest.Selector);
                    $('#divMain').css('margin', '50px');

                    break;

            }
        }

    };
    return Me;
})