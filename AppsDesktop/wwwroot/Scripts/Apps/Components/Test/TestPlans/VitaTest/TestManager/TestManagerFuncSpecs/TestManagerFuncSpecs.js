define([], function () {
    var Me = {
        Enabled: true,
        Color: 'blue',
        Name: 'TestManagerFuncSpecs',
        UniqueID: null, //Primary key
        Items: [], //Collection of items
        Item: null, //Represents a single item in collection
        Initialize: function () {

            Apps.Debug.Trace(this);

            //TODO: Move loading of template to register method like modules (sub-components)
            //For now plz delete this for modules (except if sub-sub-modules are needed)
            Apps.LoadTemplate('TestManagerFuncSpecs', Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components/VitaTest/Components/TestManager/Components/TestManagerFuncSpecs/TestManagerFuncSpecs.html', function () {

                Apps.LoadStyle(Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components/VitaTest/Components/TestManager/Components/TestManagerFuncSpecs/TestManagerFuncSpecs.css');

                //var pagesRoot = Apps.Settings.AppsRoot + '/Components/TestManagerFuncSpecs/Modules';
                //Apps.RegisterPages(
                //    [
                //        { name: 'NewModule', pageroot: pagesRoot }
                //    ]);

                Apps.Components.TestManagerFuncSpecs.Event('view');
            });

        },
        Show: function(reload)
        {
            Apps.Debug.Trace(this);

            if (reload) {

                Apps.LoadTemplate('TestManagerFuncSpecs', Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components/TestManagerFuncSpecs/TestManagerFuncSpecs.html?version=' + Apps.Util.Ticks, function () {

                    Apps.LoadStyle(Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components/TestManagerFuncSpecs/TestManagerFuncSpecs.css?version=' + Apps.Util.Ticks);
                    Apps.UI.TestManagerFuncSpecs.Show();

                });
            }
            else
                Apps.UI.TestManagerFuncSpecs.Show();
        },
        Hide: function()
        {
            Apps.Debug.Trace(this);
            Apps.UI.TestManagerFuncSpecs.Hide();
        },
        Event: function (sender, args, callback)
        {
            //TODO: change pages to components if a top-level
            Apps.Debug.Trace(this, 'TestManagerFuncSpecs Event: ' + sender);

            switch (sender)
            {
                case 'view':

                    Me.Show();
                    break;

                case 'hide':

                    Apps.Components.TestManagerFuncSpecs.Hide();
                    break;

                case 'refresh_TestManagerFuncSpecs':

                    $('#divTestManagerFuncSpecsTable').empty();

                    Apps.RegisterDataSingle({ name: 'TestManagerFuncSpecsItems', path: 'api/TestManagerFuncSpecsItems' }, function () {

                        Me.Items = Apps.Util.Linq(Apps.Data.TestManagerFuncSpecsItems, '$.UniqueID === ' + Me.UniquID); // + ' && $.Archived === false');
                        //Me.SoftwareRequirements = Enumerable.From(Me.SoftwareRequirements).OrderBy(function (sr) { return sr.Order }).ToArray();

                        var table = Apps.Grids.GetTable({
                            title: ' ',
                            data: Me.Items,
                            tableactions: [
                                {
                                    text: 'Add TestManagerFuncSpecs Item', actionclick: function () {
                                        Apps.Pages.TestManagerFuncSpecs.Event('add_item');
                                    }
                                }
                            ],
                            //rowbuttons: [
                            //    {
                            //        text: 'Remove', buttonclick: function (td, rowdata) {
                            //            Apps.Pages.TestManagerFuncSpecs.Item = JSON.parse(rowdata);
                            //            Apps.Pages.TestManagerFuncSpecs.Event('remove_item');
                            //        }
                            //    }
                            //],
                            fields: [
                                {
                                    name: 'Field1'
                                },

                                {
                                    name: 'Field2',

                                    editclick: function (td, rowdata, editControl) { },
                                    saveclick: function (td, item, editControl) {
                                        Apps.Pages.TestManagerFuncSpecs.Event('save_item', arguments);
                                    }
                                }

                            ],
                            columns: [
                                { fieldname: 'Field1', text: 'ID', hidden: true },
                                { fieldname: 'Field2', text: 'Name' }
                            ]
                        });

                        $('#divTestManagerFuncSpecsTable').append(table);

                    });

                    break;

                case 'add_item':

                    var item = {
                        Field1: '[EDIT]',
                        Field2: Me.UniqueID
                    };

                    Apps.Util.PostWithData('api/TestManagerFuncSpecsItems', JSON.stringify(tp), function (error, result) {

                        Apps.Debug.HandleError2(error, 'Failed to create.', JSON.stringify(result), 'Saved!', function () {

                            Apps.Pages.TestManagerFuncSpecs.Event('refresh_TestManagerFuncSpecs');

                        });
                    });

                    break;

                case 'save_item':

                    var tp = args[1];
                    tp.Field1 = $(args[2]).val(); //edit control

                    Apps.Util.PutWithData('api/TestManagerFuncSpecsItems/' + tp.UniqueID, JSON.stringify(tp), function (error, result) {

                        Apps.Debug.HandleError2(error, 'Failed to save.', JSON.stringify(result), 'Saved!', function () {

                            Apps.Pages.TestManagerFuncSpecs.Event('refresh_TestManagerFuncSpecs');

                        });
                    });

                    break;

                case 'remove_item':
                    //TODO
                    Me.Item = JSON.parse(Me.Item);
                    Me.Item.Archived = true;

                    Apps.Util.PutWithData('api/TestManagerFuncSpecsItems/' + Me.UniqueID, JSON.stringify(Me.Item), function (error, result) {

                        Apps.Debug.HandleError2(error, 'Failed to remove software requirement.', JSON.stringify(result), 'Item removed.', function () {

                            Apps.Pages.TestManagerFuncSpecs.Event('refresh_TestManagerFuncSpecs');

                        });
                    });

                    break;

            }
        }

    };
    return Me;
})