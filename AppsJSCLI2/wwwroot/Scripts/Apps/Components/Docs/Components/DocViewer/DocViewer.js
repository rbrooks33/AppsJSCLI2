define([], function () {
    var Me = {
        Enabled: true,
        Color: 'blue',
        Name: 'DocViewer',
        Initialize: function (callback) {

            Apps.Debug.Trace(this);
            Apps.LoadTemplate('DocViewer', Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/AutoComponents/Docs/Modules/DocViewer/DocViewer.html', function () {

                Apps.LoadStyle(Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/AutoComponents/Docs/Modules/DocViewer/DocViewer.css');

                //Apps.UI.DocViewer.Show();

                if (callback)
                    callback();
            });

        },
        Show: function (docId) {

            Apps.Debug.Trace(this);
            Me.Initialize(function () {
                Apps.UI.DocViewer.Show();
                Apps.Notify('success', 'Showing!');
                document.body.addEventListener('dragover', Me.DragOver, false);
                document.body.addEventListener('drop', Me.Drop, false);

                //for now show local doc
                Apps.Util.Get(Apps.Settings.WebRoot + '/api/Docs/GetDoc?docId=' + docId, function (error, result) {

                    $('#spanDocViewerTitle').text(result.Data[0].DocTitle);
                    $('#divDocViewerTable').html(result.Data[0].DocContent);
                });
            });



        },
        DragOver: function (ev) {
            ev.preventDefault(); //allow drop (not allowed to drop on other elements by default)
        },
        Drag: function (ev) {
            ev.dataTransfer.setData("text", ev.target.id);
        },
        Drop: function (ev) {

            ev.preventDefault();
            //var data = ev.dataTransfer.getData("text");
            let loc = Apps.Util.MouseLocation(ev);

            $('#divDocViewerContent').css('left', loc.x + 'px');
            $('#divDocViewerContent').css('top', loc.y + 'px');
        },
        Hide: function () {
            Apps.Debug.Trace(this);
            Apps.UI.DocViewer.Hide();
        },
        Event: function (sender, args, callback) {
            //TODO: change pages to components if a top-level
            Apps.Debug.Trace(this, 'DocViewer Event: ' + sender);

        }

    };
    return Me;
})