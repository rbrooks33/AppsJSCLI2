define([], function () {
    var Me = {
        Enabled: true,
        Color: 'blue',
        Name: 'LinkPicker',
        UniqueID: null, //Primary key
        Items: [], //Collection of items
        Item: null, //Represents a single item in collection
        Initialize: function () {

        },
        Show: function(doc, docType)
        {
            Apps.Debug.Trace(this);
            Apps.UI.LinkPicker.Show();

            Apps['CallerDoc'] = doc;
            Apps['CallerDocType'] = docType;

            Me.Event('refresh_LinkPicker', [doc, docType]);
        },
        Hide: function()
        {
            Apps.Debug.Trace(this);
            Apps.UI.LinkPicker.Hide();
        },
        Event: function (sender, args, callback)
        {
            //TODO: change pages to components if a top-level
            Apps.Debug.Trace(this, 'LinkPicker Event: ' + sender);

            switch (sender)
            {
                case 'view':

                    Me.Show();
                    break;

                case 'hide':

                    Apps.Pages.LinkPicker.Hide();
                    break;

                case 'refresh_LinkPicker':

                    $('#divLinkPickerTable').empty();

                    Apps.RegisterDataSingle({ name: 'Docs_DocLinks', path: Apps.Settings.WebRoot + '/api/Docs/GetDocTypes' }, function () {

                        Me.Items = Apps.Data.Docs_DocLinks.data; // Apps.Util.Linq(Apps.Data.LinkListItems, '$.UniqueID === ' + Me.UniquID); // + ' && $.Archived === false');

                        let li = '<table style="-webkit-border-vertical-spacing: 0.5em;border-collapse:separate;width:100%;">';

                        $.each(Me.Items, function (dtIndex, dt) {

                            li += '    <tr>';
                            li += '        <td style="text-align:center;vertical-align:top;width:30px;border:solid 1px lightgrey;padding:5px;font-size:25px;">';
                            li += '            <img src="' + dt.logo + '" style="width:20px; height:20px;" />';
                            li += '        </td>';
                            li += '        <td class="doccontent" style="text-align:left;border:solid 1px lightgrey;padding:5px;margin:3px;">';
                            li += dt.name;
                            li += '        </td>';
                            li += '        <td style="text-align:left;vertical-align:top;border:solid 1px lightgrey;padding:5px;font-size:11px;">';
                            li += dt.description;
                            li += '        </td>';
                            li += '        <td style="text-align:left;border:solid 1px lightgrey;padding:5px;margin:3px;">';
                            li += '             <div onclick="Apps.Pages.LinkPicker.Event(\'browse_docs\',[\'' + escape(JSON.stringify(dt)) + '\']);" class="btn btn-primary">Browse';
                            li += '        </td > ';
                            //li += '        <td style="text-align:center;vertical-align:top; width:10%;border:solid 1px lightgrey;padding:5px;font-size:11px;">';
                            //li += 'Updated ' + Apps.Util.FormatDateTime2(doc.updated);
                            //li += '        </td>';
                            //li += '        <td style="text-align:left;width:5%;border:solid 1px lightgrey;padding:5px;">';
                            //li += '            <input type="button" onclick="Apps.Components.Docs.Event(\'edit\',\'' + escape(JSON.stringify(doc)) + '\');" class="btn btn-primary" value="Edit" />'
                            //li += '        </td>';
                            li += '    </tr>';
                            
                        });

                        li += '</table>';

                        $('#divLinkPickerTable').append(li);

                    });

                    break;

                case 'browse_docs':

                    //These will be retrieved via "parent.Apps." in child window
                    Apps['CalledDocType'] = JSON.parse(unescape(args));

                    //let unescapedArgs = unescape(args);
                    //let browseDocType = JSON.parse(unescapedArgs);

                    window.open(Apps.Settings.WebRoot + '/' + Apps.CalledDocType.searchURL); //$('#iframeLinkPickerViewer').attr('src', Apps.Settings.WebRoot + '/' + browseDocType.searchURL); //local only

                    break;

                case 'browse_callback':


                    break;
            }
        }

    };
    return Me;
})