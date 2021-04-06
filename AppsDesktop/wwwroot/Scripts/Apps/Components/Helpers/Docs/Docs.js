define([], function () {
    var Me = {
        Initialize: function () {
            Apps.Data.RegisterGET('DocModel', '/api/Docs/GetDocModel');
            Apps.Data.RegisterGET('Docs', '/api/Docs/GetDocs');
            Apps.Data.RegisterPOST('UpsertDoc', '/api/Docs/UpsertDoc');

            Apps.Data.DocModel.Refresh();
        },
        Show: function () {

            Me.UI.Show(400);

            Apps.Data.Docs.Refresh(null, function () {

                var docs = Enumerable.From(Apps.Data.Docs.Data)
                    .Where(function (d) { return d.Archived === false; })
                    .ToArray();

                //GET DOCS WITH NO PARENT
                Me.CurrentLevel = 0; // Me.BaseLevel; //Reset level start

                var ulNoParent = Me.RefreshDocChildren(docs, -1, 0);
                $("#divDocsContainer").append(ulNoParent);

                Me.RefreshDocChildren(docs, -1, 0);

            });
        },
        Hide: function () {
            Me.UI.Hide(400);
        },
        Add: function () {
            Apps.Data.Post('UpsertDoc', Apps.Data.DocModel);
        },
        RefreshDocChildren: function (docs, parentId, depth) {

            //Apps.Debug.Trace(this);

            var childDocs = Enumerable.From(docs)
                .Where(function (s) {
                    return s.ParentDocID === parentId;
                })
                .OrderBy(function (s) { return s.ParentDocID; })
                .ThenBy(function (s) { return s.Order; })
                .ToArray();

            $.each(childDocs, function (index, d) {
                d.Order = d.Order ? d.Order : 0;
            });

            var li = '<ul style="margin-left:-44px;">';

            $.each(childDocs, function (index, doc) {
                li += '<li id="li_' + doc.DocID + '" style="list-style:none;" draggable="true" ondragstart="Apps.Components.Docs.drag(event)" ondrop="Apps.AutoComponents.Docs.drop(event)" ondragover="Apps.AutoComponents.Docs.allowDrop(event)">';
                li += '<table style="-webkit-border-vertical-spacing: 0.5em;border-collapse:separate;width:100%;">';
                li += '    <tr>';
                li += '        <td class="Docs_DocTitleCell" onclick="Apps.Components.Docs.Event(\'show_child_docs\',' + doc.ID + ');">';
                li += '            <span class="Docs_DocTitleTagsSpan">#' + doc.ID + ' (' + doc.ChildCount + ' Docs)</span>';
                li += '            <br /><span class="Docs_DocTitleCellTitle">' + doc.DocTitle + '</span>';
                //li += doc.DocTitle;
                let docTagHtml = '';
                let docTags = Enumerable.From(Me.DocTags)
                    .Where(function (dt) {
                        return dt.ID === doc.ID && dt.TagID > 0;
                    })
                    .ToArray();

                $.each(docTags, function (index, tag) {
                    docTagHtml += '<span class="badge badge-light" style="float:right;">' + tag.TagName + '</span>';
                });
                li += docTagHtml;
                li += '        </td>';
                li += '        <td class="doccontent" style="font-size:18px;text-align:left;border:none;padding:5px;margin:3px;">';
                li += unescape(doc.DocContent);
                li += '        </td>';
                //li += '        <td style="text-align:center;vertical-align:top;width:2%;border:solid 1px lightgrey;padding:5px;font-size:11px;">';
                //li += '        </td>';
                //li += '        <td style="text-align:center;vertical-align:bottom;width:2%;border:none;padding:5px;">';
                //li += '          <span onclick="Apps.AutoComponents.Docs.Event(\'show_content\',' + doc.DocID + ');" class="fa fa-square-o" style="float:right;cursor:pointer;" />';
                //li += '          <span onclick="Apps.AutoComponents.Docs.Event(\'hide_content\',' + doc.DocID + ');" class="fa fa-bars" style="float:right;cursor:pointer;display:none;" />';
                //li += '        </td>';
                //li += '        <td style="text-align:center;vertical-align:top;width:10%;border:solid 1px lightgrey;padding:5px;font-size:11px;">';
                //li += 'Created ' + Apps.Util.FormatDateTime2(doc.Created);
                //li += '        </td>';
                //li += '        <td style="text-align:center;vertical-align:top; width:10%;border:solid 1px lightgrey;padding:5px;font-size:11px;">';
                //li += 'Updated ' + Apps.Util.FormatDateTime2(doc.Updated);
                //li += '        </td>';
                let opacity = doc.Archived ? .5 : 1;
                li += '        <td class="Docs_ButtonCell" style="opacity:' + opacity + ';">';
                li += '          <div class="btn-group">';
                li += '          <span onclick="Apps.Components.Docs.Event(\'show_content\',' + doc.ID + ');" class="btn btn-primary fa fa-square-o" style="float:right;cursor:pointer;" />';
                li += '          <span onclick="Apps.Components.Docs.Event(\'hide_content\',' + doc.ID + ');" class="btn btn-primary fa fa-bars" style="float:right;cursor:pointer;display:none;" />';
                //li += '          <span class="btn btn-primary" onclick="Apps.AutoComponents.Docs.Event(\'show_child_docs\',' + doc.DocID + ');">';
                //li += doc.ChildCount;
                //li += '          </span>';
                li += '            <span onclick="Apps.Components.Docs.Event(\'edit\',\'' + escape(JSON.stringify(doc)) + '\');" class="btn btn-primary fa fa-pencil-square-o"></span>';
                li += '            <span onclick="Apps.Components.Docs.Event(\'new_child\',\'' + doc.ID + '\');" class="btn btn-primary fa fa-plus"></span>';
                li += '            <input type="button" onclick="Apps.Components.Docs.Event(\'doc_move\',\'' + escape(JSON.stringify(doc)) + '\');" class="btn btn-primary" value="..." />';

                let reviewCount = Enumerable.From(Me.DocReviews)
                    .Where(function (r) { return r.ID === doc.ID; })
                    .ToArray().length;

                let reviewOpacity = reviewCount > 0 ? 1 : .5;

                li += '          <input type="button" onclick="Apps.Components.Docs.Event(\'reviewed\',\'' + doc.ID + '\');" class="btn btn-success" style="opacity:' + reviewOpacity + ';border-bottom:" value="' + reviewCount + '" />';
                if (!doc.Archived)
                    li += '            <input type="button" onclick="Apps.Components.Docs.Event(\'archive\',\'' + escape(JSON.stringify(doc)) + '\');" class="btn btn-danger" title="Live. Click to archive." value="A" />';
                else
                    li += '            <input type="button" onclick="Apps.Components.Docs.Event(\'unarchive\',\'' + escape(JSON.stringify(doc)) + '\');" class="btn btn-success" title="Archived. Click to restore." value="A" />';
                li += '          </div>';
                li += '        </td>';
                li += '    </tr>';
                li += '</table>';
                li += '</li>';

                Me.DisplayLevels = parseInt(Me.DisplayLevels);
                Me.BaseLevel = parseInt(Me.BaseLevel);

                //console.log('doc is ' + doc.DocTitle + '. current level is ' + depth + '. base (' + Me.BaseLevel + ') + displaylevels (' + Me.DisplayLevels + ') is ' + (Me.BaseLevel + Me.DisplayLevels));

                if (Me.DisplayLevels === -1 || Me.CurrentLevel < Me.DisplayLevels) {
                    //     console.log('getting children');
                    Me.CurrentLevel++;
                    li += Me.RefreshDocChildren(docs, doc.ID, depth + 1);
                }
                // else
                //    console.log('not getting children');

            });

            li += '</ul>';

            return li;
        }

    };
    return Me;
});