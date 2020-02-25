//TODO: change AutoComponents to Pages if a module/page
define([], function () {
    var Me = {
        Enabled: true,
        Color: 'blue',
        Name: 'Tags',
        Tags: [],
        Initialize: function (callback) {

            Apps.Debug.Trace(this);

            Apps.LoadTemplate('Tags', Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/AutoComponents/Docs/Modules/Tags/Tags.html', function () {

                Apps.LoadStyle(Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/AutoComponents/Docs/Modules/Tags/Tags.css');

                Apps.Pages.Tags.Event('view');

                if (callback)
                    callback();
            });

        },
        Show: function()
        {
            Apps.Debug.Trace(this);
            Apps.UI.Tags.Show();

            Me.Event('gettags');
        },
        Hide: function()
        {
            Apps.Debug.Trace(this);
            Apps.UI.Tags.Hide();
        },
        Event: function (sender, args, callback)
        {
            Apps.Debug.Trace(this, 'Tags Event: ' + sender);

            switch (sender) {
                case 'gettags':

                    Apps.Util.Get('/api/Docs/GetTags', function (error, result) {

                        Me.Tags = result.Data;

                        var table = Apps.Grids.GetTable({
                            title: 'Tags',
                            data: Me.Tags,
                            tableactions: [
                                {
                                    text: 'Add Tag', actionclick: function () {
                                        Apps.Pages.Tags.Event('add_tag');
                                    }
                                },
                                {
                                    text: 'View CSS Skill-Up Tags', actionclick: function () {
                                        Apps.Pages.Tags.Event('view_css_skillup_tags');
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
                                {
                                    name: 'TagID'
                                },

                                {
                                    name: 'Name',

                                    editclick: function (td, rowdata, editControl) { },
                                    saveclick: function () {

                                        let tagForName = arguments[1];
                                        tagForName.Name = $(arguments[2]).val();
                                        Apps.Pages.Tags.Event('save', tagForName);
                                    }
                                }

                            ],
                            columns: [
                                { fieldname: 'TagID', text: 'Tag ID', hidden: false },
                                { fieldname: 'Name', text: 'Tag Name' }
                            ]
                        });

                        $('#divTagsTable').html(table);

                    });

                    break;

                case 'add_tag':

                    let newTag = {
                        Name: 'no name'
                    };
                    Apps.Util.PostWithData('/api/Docs/UpsertTag', JSON.stringify(newTag), function (error, result) {
                        Me.Event('gettags');
                    });

                    break;

                case 'save':

                    Apps.Util.PostWithData('/api/Docs/UpsertTag', JSON.stringify(args), function (error, result) {
                        Me.Event('gettags');
                    });

                    break;

                case 'view_css_skillup_tags':



                    break;
            }
        }

    };
    return Me;
})