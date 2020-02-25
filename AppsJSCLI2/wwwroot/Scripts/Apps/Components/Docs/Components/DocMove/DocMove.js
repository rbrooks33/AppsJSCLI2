//TODO: change AutoComponents to Pages if a module/page
define([], function () {
    var Me = {
        Enabled: true,
        Color: 'blue',
        Name: 'DocMove',
        Doc: null,
        Initialize: function (callback) {

            Apps.Debug.Trace(this);

            Apps.LoadTemplate('DocMove', Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/AutoComponents/Docs/Modules/DocMove/DocMove.html', function () {

                Apps.LoadStyle(Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/AutoComponents/Docs/Modules/DocMove/DocMove.css');

                if (callback)
                    callback();
            });

        },
        Show: function(doc)
        {
            Me.Doc = doc;
            Apps.Debug.Trace(this);
            Apps.UI.DocMove.Show();
        },
        Hide: function()
        {
            Apps.Debug.Trace(this);
            Apps.UI.DocMove.Hide();
        },
        Event: function (sender, args, callback)
        {
            Apps.Debug.Trace(this, 'DocMove Event: ' + sender);

            switch (sender)
            {
                case 'move_to_parent':

                    Me.Doc.ParentDocID = $('#inputDocMove_MoveToParent').val();

                    Apps.Util.PostWithData(Apps.Settings.WebRoot + '/api/Docs/UpsertDoc', JSON.stringify(Me.Doc), function (error, result) {

                        if (!error && result.Success) {
                            Apps.Notify('success', 'Doc parent move done! Moved doc ' + Me.Doc.DocID + ' to parent id ' + Me.Doc.ParentDocID);
                        }
                    });
                    break;

                case 'move_to_position':

                    Me.Doc.Order = $('#inputDocMove_MoveToPosition').val();

                    Apps.Util.PostWithData(Apps.Settings.WebRoot + '/api/Docs/UpsertDoc', JSON.stringify(Me.Doc), function (error, result) {

                        if (!error && result.Success) {
                            Apps.Notify('success', 'Doc order moved to ' + Me.Doc.Order);
                        }
                    });
                    break;
            }
        }

    };
    return Me;
})