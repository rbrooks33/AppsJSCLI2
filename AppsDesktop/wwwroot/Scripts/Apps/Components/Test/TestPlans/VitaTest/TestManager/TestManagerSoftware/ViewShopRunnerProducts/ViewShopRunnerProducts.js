define([], function () {
    var Me = {
        Enabled: true,
        Color: 'blue',
        Name: 'ViewShopRunnerProducts',
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

                Apps.LoadTemplate('ViewShopRunnerProducts', Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components/ViewShopRunnerProducts/ViewShopRunnerProducts.html?version=' + Apps.Util.Ticks, function () {

                    Apps.LoadStyle(Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components/ViewShopRunnerProducts/ViewShopRunnerProducts.css?version=' + Apps.Util.Ticks);
                    Apps.UI.ViewShopRunnerProducts.Show();

                });
            }
            else
                Apps.UI.ViewShopRunnerProducts.Show();

            Me.Event('refresh_ViewShopRunnerProducts');
        },
        Hide: function()
        {
            Apps.Debug.Trace(this);
            Apps.UI.ViewShopRunnerProducts.Hide();
        },
        Event: function (sender, args, callback)
        {
            //TODO: change pages to components if a top-level
            Apps.Debug.Trace(this, 'ViewShopRunnerProducts Event: ' + sender);

            switch (sender)
            {
                case 'view':

                    Me.Show();
                    break;

                case 'hide':

                    Apps.Pages.ViewShopRunnerProducts.Hide();
                    break;

                case 'refresh_ViewShopRunnerProducts':

                    $('#divViewShopRunnerProductsTable').empty();

                    Apps.RegisterDataSingle({ name: 'ViewShopRunnerProductsItems', path: Apps.Settings.WebRoot + '/api/ShopRunnerTesting/GetShopRunnerEligibleSkus' }, function () {

                        Me.Items = Apps.Data.ViewShopRunnerProductsItems.data; //, '$.UniqueID === ' + Me.UniquID); // + ' && $.Archived === false');
                        

                        var table = Apps.Grids.GetTable({
                            title: ' ',
                            data: Me.Items,
                            tableactions: [
                                {
                                    text: 'Add ViewShopRunnerProducts Item', actionclick: function () {
                                        Apps.Pages.ViewShopRunnerProducts.Event('add_item');
                                    }
                                }
                            ],
                            //rowbuttons: [
                            //    {
                            //        text: 'Remove', buttonclick: function (td, rowdata) {
                            //            Apps.Pages.ViewShopRunnerProducts.Item = JSON.parse(rowdata);
                            //            Apps.Pages.ViewShopRunnerProducts.Event('remove_item');
                            //        }
                            //    }
                            //],
                            fields: [
                                {
                                    name: 'productID'
                                },

                                {
                                    name: 'skuNumber',

                                    editclick: function (td, rowdata, editControl) { },
                                    saveclick: function (td, item, editControl) {
                                        Apps.Pages.ViewShopRunnerProducts.Event('save_item', arguments);
                                    }
                                }

                            ],
                            columns: [
                                { fieldname: 'productID', text: 'ID', hidden: false },
                                { fieldname: 'skuNumber', text: 'SKU' }
                            ]
                        });

                        $('#divViewShopRunnerProductsTable').append(table);

                    });

                    break;

                case 'add_item':

                    var item = {
                        Field1: '[EDIT]',
                        Field2: Me.UniqueID
                    };

                    Apps.Util.PostWithData('api/ViewShopRunnerProductsItems', JSON.stringify(tp), function (error, result) {

                        Apps.Debug.HandleError2(error, 'Failed to create.', JSON.stringify(result), 'Saved!', function () {

                            Apps.Pages.ViewShopRunnerProducts.Event('refresh_ViewShopRunnerProducts');

                        });
                    });

                    break;

                case 'save_item':

                    var tp = args[1];
                    tp.Field1 = $(args[2]).val(); //edit control

                    Apps.Util.PutWithData('api/ViewShopRunnerProductsItems/' + tp.UniqueID, JSON.stringify(tp), function (error, result) {

                        Apps.Debug.HandleError2(error, 'Failed to save.', JSON.stringify(result), 'Saved!', function () {

                            Apps.Pages.ViewShopRunnerProducts.Event('refresh_ViewShopRunnerProducts');

                        });
                    });

                    break;

                case 'remove_item':
                    //TODO
                    Me.Item = JSON.parse(Me.Item);
                    Me.Item.Archived = true;

                    Apps.Util.PutWithData('api/ViewShopRunnerProductsItems/' + Me.UniqueID, JSON.stringify(Me.Item), function (error, result) {

                        Apps.Debug.HandleError2(error, 'Failed to remove software requirement.', JSON.stringify(result), 'Item removed.', function () {

                            Apps.Pages.ViewShopRunnerProducts.Event('refresh_ViewShopRunnerProducts');

                        });
                    });

                    break;

            }
        }

    };
    return Me;
})