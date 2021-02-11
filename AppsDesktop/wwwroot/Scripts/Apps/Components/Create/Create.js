define([], function () {
    var Me = {
        Initialize: function () {
            Apps.LoadTemplate('Create', '/Scripts/Apps/Components/Create/Create.html', function () {
                Apps.UI.Create.Drop();
            });
        },
        List: function (createType) {
            
            if (createType === 'software') {


                let html = Apps.Util.GetHTML('Create_Software_List_Template');

                let dialog = Apps.Components.Helpers.Dialogs;
                dialog.Content('Create_Software_List_Dialog', html);
                dialog.Open('Create_Software_List_Dialog');


            }
        },
        New: function (softwareType) {
            if (softwareType === 'net_core_web_service') {
                //
                Apps.Get2('/api/Create/CreateAppSoftware?softwareType=3', function (result) {

                    if (result.Success) {
                        Apps.Notify('info', 'created!');
                        Apps.Components.Helpers.Dialogs.Close('Create_Software_List_Dialog');
                    }
                    else
                        Apps.Notify('warning', 'not create');

                });
            }
        }
    };
    return Me;
});