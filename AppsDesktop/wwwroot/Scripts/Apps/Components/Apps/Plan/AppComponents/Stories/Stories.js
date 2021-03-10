define([], function () {
    var Me = {
        Parent: null,
        StoryModel: null,
        Initialize: function (callback) {

            Apps.LoadTemplate('Stories', '/Scripts/Apps/Components/Apps/Plan/AppComponents/Stories/Stories.html', function () {
                Apps.LoadStyle('/Scripts/Apps/Components/Apps/Plan/AppComponents/Stories/Stories.css');

                Apps.UI.Stories.Show();

                Apps.Data.RegisterPOST('UpsertStory', '/api/Story/UpsertStory');
                Apps.Data.RegisterGET('Stories', '/api/Story/GetStories?appComponentId={0}');
                Apps.Data.RegisterGET('StoryModel', '/api/Story/GetStoryModel');
                Apps.Data.StoryModel.Refresh();

                if(callback)
                    callback();
            });
        },
        GetStories: function (appComponent, callback) {

            Apps.Data.Stories.Refresh([appComponent.ID], function () {

                let stories = Apps.Data.Stories.Data;

                $.each(stories, function (index, story) {
                    story['RoleIDs'] = [];
                });

                let table = Apps.Grids.GetTable({
                    id: "gridStories",
                    data: stories,
                    title: appComponent.AppComponentName + ' <span style="color:lightgrey;">Stories</span>',
                    tableactions: [
                        {
                            text: "Add Story",
                            actionclick: function () {
                                Apps.Components.Apps.Plan.AppComponents.Stories.Upsert();
                            }

                        }
                    ],
                    tablestyle: "",
                    rowactions: [
                        {
                            text: "Delete",
                            actionclick: function (td, story, tr) {
                                if (confirm('Are you sure?')) {
                                    story.Archived = true;
                                    Apps.Data.Stories.Selected = story;
                                    Apps.Components.Apps.Plan.AppComponents.Stories.Upsert();
                                }
                            }
                        }
                    ],
                    rowbuttons: [
                        {
                            text: "Tests",
                            buttonclick: function (td, story, tr) {
                                Apps.Components.Apps.Plan.AppComponents.Stories.ShowTests(td, story, tr);
                            }
                        },
                        {
                            text: "Functional Specs",
                            buttonclick: function (td, story, tr) {
                                Apps.Components.Apps.Plan.AppComponents.Stories.ShowTests(td, story, tr);
                            }
                        },
                        {
                            text: "Methods",
                            buttonclick: function (td, story, tr) {
                                Apps.Components.Apps.Plan.AppComponents.Stories.ShowTests(td, story, tr);
                            }
                        },
                        {
                            text: "Requirements",
                            buttonclick: function (td, story, tr) {
                                Apps.Components.Apps.Plan.AppComponents.Stories.ShowTests(td, story, tr);
                            }
                        }

                    ],
                    fields: [
                        { name: 'ID' },
                        {
                            name: 'StoryName',
                            editclick: function (td, rowdata, editControl) {
                            },
                            saveclick: function (td, story, input) {
                                story.AppComponentID = Apps.Data.AppComponents.Selected.ID;
                                story.StoryName = $(input).val();
                                Apps.Data.Stories.Selected = story;
                                Apps.Components.Apps.Plan.AppComponents.Stories.Upsert();
                            }
                        },
                        { name: 'RoleIDs'},
                        {
                            name: 'StoryDescription',
                            editclick: function (td, rowdata, editControl) {
                            },
                            saveclick: function (td, story, input) {
                                story.AppComponentID = Apps.Data.AppComponents.Selected.ID;
                                story.StoryDescription = $(input).val();
                                Apps.Data.Stories.Selected = story;
                                Apps.Components.Apps.Plan.AppComponents.Stories.Upsert();
                            } }
                    ],
                    columns: [
                        {
                            fieldname: 'ID',
                            text: 'ID'
                        },
                        {
                            fieldname: 'StoryName',
                            text: 'Name',
                            format: function (story) {
                                let result = '&nbsp;&nbsp;&nbsp;&nbsp;';
                                if (story.StoryName)
                                    result = '<span style="font-size:15px;font-weight:bold;">' + story.StoryName + '</span>';

                                return result;
                            }
                        },
                        {
                            fieldname: 'RoleIDs',
                            text: 'Roles'
                        },
                        {
                            fieldname: 'StoryDescription',
                            text: 'Description',
                            format: function (story) {
                                let result = '&nbsp;&nbsp;&nbsp;&nbsp;';
                                if (story.StoryDescription)
                                    result = story.StoryDescription;

                                return result;
                            }
                        }
                    ]
                });

                if (callback)
                    callback(table.outerHTML);
            });
        },
        Upsert: function () {
            let story = Apps.Data.StoryModel.Data;
            if (Apps.Data.Stories.Selected)
                story = Apps.Data.Stories.Selected;

            story.AppComponentID = Apps.Data.AppComponents.Selected.ID; //Should have this by now

            Apps.Data.Post('UpsertStory', story, function () {
                Apps.Notify('success', 'Upserted story.');
                Apps.Components.Apps.Plan.AppComponents.RefreshStories(Apps.Data.AppComponents.Selected)
            });
        },
        New: function () {
            Apps.Post2('/api/Story/UpsertStory', JSON.stringify(Me.StoryModel), function (result) {
                if (result.Success) {
                    Apps.Notify('success', 'New story created!');
                    Apps.Components.Dialogs.Close('Apps_Stories_NewStory_Dialog');
                }
                else {
                    Apps.Notify('warning', 'Error upserting story.');
                }
            });
        }
    };
    return Me;
});