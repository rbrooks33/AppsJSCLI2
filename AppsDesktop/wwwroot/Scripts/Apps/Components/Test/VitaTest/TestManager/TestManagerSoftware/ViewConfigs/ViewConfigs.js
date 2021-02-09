define([], function () {
    var Me = {
        Enabled: true,
        Color: 'blue',
        Name: 'ViewConfigs',
        UniqueID: null, //Primary key
        Items: [], //Collection of items
        Item: null, //Represents a single item in collection
        Initialize: function () {

            Apps.Debug.Trace(this);

        },
        Show: function(reload)
        {
            Apps.Debug.Trace(this);

            if (reload) {

                Apps.LoadTemplate('ViewConfigs', Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components/ViewConfigs/ViewConfigs.html?version=' + Apps.Util.Ticks, function () {

                    Apps.LoadStyle(Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components/ViewConfigs/ViewConfigs.css?version=' + Apps.Util.Ticks);
                    Apps.UI.ViewConfigs.Show();

                });
            }
            else
                Apps.UI.ViewConfigs.Show();

            Me.Event('refresh_ViewConfigs');
        },
        Hide: function()
        {
            Apps.Debug.Trace(this);
            Apps.UI.ViewConfigs.Hide();
        },
        Event: function (sender, args, callback)
        {
            //TODO: change pages to components if a top-level
            Apps.Debug.Trace(this, 'ViewConfigs Event: ' + sender);

            switch (sender)
            {
                case 'view':

                    Me.Show();
                    break;

                case 'hide':

                    Apps.Pages.ViewConfigs.Hide();
                    break;

                case 'refresh_ViewConfigs':

                    $('#divViewConfigsTable').empty();

                    Apps.RegisterDataSingle({ name: 'ViewConfigsItems', path: Apps.Settings.WebRoot + '/api/ShopRunnerTesting/GetConfigs' }, function () {

                        Me.Items = Apps.Data.ViewConfigsItems.data; //, '$.UniqueID === ' + Me.UniquID); // + ' && $.Archived === false');
                        

                        var table = Apps.Grids.GetTable({
                            title: ' ',
                            data: Me.Items,
                            tableactions: [
                                {
                                    text: 'Add ViewConfigs Item', actionclick: function () {
                                        Apps.Pages.ViewConfigs.Event('add_item');
                                    }
                                }
                            ],
                            //rowbuttons: [
                            //    {
                            //        text: 'Remove', buttonclick: function (td, rowdata) {
                            //            Apps.Pages.ViewConfigs.Item = JSON.parse(rowdata);
                            //            Apps.Pages.ViewConfigs.Event('remove_item');
                            //        }
                            //    }
                            //],
                            fields: [
                                {
                                    name: 'fieldName'
                                },

                                {
                                    name: 'fieldValue',

                                    editclick: function (td, rowdata, editControl) { },
                                    saveclick: function (td, item, editControl) {
                                        Apps.Pages.ViewConfigs.Event('save_item', arguments);
                                    }
                                }

                            ],
                            columns: [
                                { fieldname: 'fieldName', text: 'Name', hidden: false },
                                { fieldname: 'fieldValue', text: 'Value' }
                            ]
                        });

                        $('#divViewConfigsTable').append(table);

                    });

                    break;

                case 'add_item':

                    var item = {
                        Field1: '[EDIT]',
                        Field2: Me.UniqueID
                    };

                    Apps.Util.PostWithData('api/ViewConfigsItems', JSON.stringify(tp), function (error, result) {

                        Apps.Debug.HandleError2(error, 'Failed to create.', JSON.stringify(result), 'Saved!', function () {

                            Apps.Pages.ViewConfigs.Event('refresh_ViewConfigs');

                        });
                    });

                    break;

                case 'save_item':

                    var tp = args[1];
                    tp.Field1 = $(args[2]).val(); //edit control

                    Apps.Util.PutWithData('api/ViewConfigsItems/' + tp.UniqueID, JSON.stringify(tp), function (error, result) {

                        Apps.Debug.HandleError2(error, 'Failed to save.', JSON.stringify(result), 'Saved!', function () {

                            Apps.Pages.ViewConfigs.Event('refresh_ViewConfigs');

                        });
                    });

                    break;

                case 'remove_item':
                    //TODO
                    Me.Item = JSON.parse(Me.Item);
                    Me.Item.Archived = true;

                    Apps.Util.PutWithData('api/ViewConfigsItems/' + Me.UniqueID, JSON.stringify(Me.Item), function (error, result) {

                        Apps.Debug.HandleError2(error, 'Failed to remove software requirement.', JSON.stringify(result), 'Item removed.', function () {

                            Apps.Pages.ViewConfigs.Event('refresh_ViewConfigs');

                        });
                    });

                    break;

            }
        }

    };
    return Me;
})