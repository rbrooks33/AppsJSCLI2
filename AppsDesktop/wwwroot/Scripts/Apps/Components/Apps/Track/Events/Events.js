define([], function () {
    var Me = {
        Pause: false,
        Initialize: function (parent, callback) {
            Apps.LoadTemplate('Events', '/Scripts/Apps/Components/Apps/Track/Events/Events.html', function () {
                Apps.LoadStyle('/Scripts/Apps/Components/Apps/Track/Events/Events.css');

                Apps.UI.Events.Show();

                Apps.Tabstrips.Initialize('tabstripEvents');
                Apps.Tabstrips.Select('tabstripEvents', 1);
                Apps.Tabstrips.SelectCallback = Me.TabSelected;

                let monitorHtml = '<h4>Events</h4> <div id = "Apps_Events_List_Div"> <div></div>    </div>';
                $('#Track_Events_Monitor_TemplateContent').html(monitorHtml);

                if (callback)
                    callback();
            });
        },
        TabSelected: function (tabId, tabIndex) {

        },
        Show: function () {
            //Me.Initialize(function () {
                let eventsContainer = $('#Apps_Events_Container_Div');
                eventsContainer.show(400);
            //});
        },
        Refresh: function () {

            if (!Me.Pause) {

                Apps.Get2('/api/Apps/LatestEvents?secondsAgo=1800', function (result) {

                    if (result.Success) {
                        //Apps.Notify('success', result.Data.length + ' events.');
                        Me.ShowEvents(result.Data);
                    }
                    else
                        Apps.Notify('warning', 'Problem getting events.');

                });
            }
        },
        ShowEvents: function (events) {


            var groups = Enumerable.From(events).GroupBy("$.FlowProps.Name").ToArray(); //.OrderByDescending("$.FlowProps.StartTime").ToArray(); //function (e) { return fp.length > 0; }).ToArray();

            var html = '';


            html += '<table>';
            $.each(groups, function (index, group) {

                let groupCount = group.source.length;
                var groupsDesc = Enumerable.From(group.source).OrderByDescending("$.Created").ToArray();

                if (groupsDesc[0].FlowProps.Name) {

                    var flowName = groupsDesc[0].FlowProps.Name.replaceAll('+', '.');
                    var flowNameID = flowName.replaceAll('.', '_');

                    html += '  <tr>';
                    html += '    <td><div id="Apps_Events_EventClass_Icon" onclick="Apps.Components.Apps.Track.Events.ShowHideDetail(\'' + flowNameID + '\');" class="Apps_Events_EventClass_Icon_Style" style="background-color:' + group.source[0].FlowProps.Color + ';">' + groupCount + '</div></td>'
                    html += '    <td style="padding-left:4px;vertical-align: baseline; font-size: 2.1vw;">' + flowName + '</td>';
                    html += '  </tr>';
                    html += '  <tr>';
                    html += '    <td></td>';
                    html += '    <td style="padding-left:4px;">' + Apps.Util.TimeElapsed(new Date(groupsDesc[0].FlowProps.StartTime)) + '&nbsp;&nbsp;<i class="fas fa-trash" style="font-size:1vw;cursor:pointer;" onclick="Apps.Components.Apps.Track.Events.ArchiveEvent(\'' + groupsDesc[0].FlowProps.Name + '\');" /></td>';
                    html += '  </tr>';
                    html += '  <tr>'
                    html += '    <td colspan="2">';

                    html += '      <table id="Apps_Event_DetailTable_' + flowNameID + '" style="display:none;width:100%;">';
                    $.each(groupsDesc, function (itemIndex, item) {

                        html += '    <tr style="">';
                        html += '      <td><textarea style="width:410px;height:100px;">' + JSON.stringify(item.FlowProps) + '</textarea></td>';
                        //html += '      <td>' + item.FlowProps.StartTime + '</td>';
                        //html += '      <td>' + item.FlowProps.EndTime + '</td>';
                        //html += '      <td>' + item.FlowProps.Span + '</td>';
                        html += '    </tr>';
                    });
                    html += '      </table>';

                    html += '    </td>';
                    html += '  </tr>';
                }
            });
            html += '</table>';

            $('#Apps_Events_List_Div').html(html);
            //$('#Apps_Events_EventClass_Icon').addClass('Apps_Events_EventClass_Icon_Style')
        },
        ShowHide: function () {
            let eventsContainer = $('#Apps_Events_Container_Div');

            if (eventsContainer.is(':visible')) {
                eventsContainer.hide(400);
                Me.Pause = true;
            }
            else {
                eventsContainer.show(400);
                Me.Pause = false;
            }
        },
        HideEvents: function () {
            $('#Apps_Events_Container_Div').hide(400);
        },
        ShowHideDetail: function (tableName) {
            let eventDetail = $('#Apps_Event_DetailTable_' + tableName);

            if (eventDetail.is(':visible')) {
                eventDetail.hide(400);
                Me.Pause = false;
            }
            else {
                eventDetail.show(400);
                Me.Pause = true;
            }
        },
        ArchiveEvent: function (flowName) {

            if (confirm('Are you sure you want to permanently delete these event records?')) {
                Apps.Get2('/api/Apps/ArchiveEvents?eventName=' + flowName, function (result) {
                    if (result.Success) {
                        Apps.Notify('success', result.Data + ' events deleted!');
                    }
                });
            }
        }
    };
    return Me;
});