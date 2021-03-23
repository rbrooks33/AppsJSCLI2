//Tabstrip tag example:
//<div id="tabstripEditor" data-type="tabstrip">
//    <div data-tabstrip-tabtitle="Properties" data-tabstrip-templateid="templateTabProperties"></div>
//    <div data-tabstrip-tabtitle="Layout" data-tabstrip-templateid="templateTabLayout"></div>
//    <div data-tabstrip-tabtitle="Tags" data-tabstrip-templateid="templateTabTags"></div>
//</div>


define(['./util.js'], function (Util) {

    var Me = {
        Tabs: [],
        Initialize: function (tabstripId) {

            //if (baseFolder)
            //    Me.BaseFolder = baseFolder;

            //Util.LoadTemplateFiles(Me.BaseFolder);
            //Util.AddStyleReference(Me.BaseFolder + '/css/tabstrip.css');
            Util.GetQueryString();

            Me.CreateTabstrips(tabstripId);

        },

        CreateTabstrips: function (tabstripId) {

            var tabstripElements = $("[data-type='tabstrip']");

            $.each(tabstripElements, function (index, ts) {

                //var tabstripId = ts.id;
                if (ts.id === tabstripId) {

                    //Custom css file e.g. 'tabstripEditor-tabstrip-custom'
                    var newTabstripHTML = $('<div class="css3-tabstrip ' + tabstripId + '-tabstrip-custom"><ul></ul> </div>');

                    //if (newTabstripHTML.length === 0)
                    {
                        //INSERT TABS & CONTENT
                        //Content element id is by convention: template id + 'Content' (e.g. 'templateTabLayoutContent')
                        $.each($(ts).children(), function (tabIndex, tab) {

                            var tabTemplateId = $(tab).attr("data-tabstrip-templateid");
                            var tabTitle = $(tab).attr("data-tabstrip-tabtitle");
                            var tabHTML = '';
                            if (Util.GetContent(tabTemplateId))
                                tabHTML = Util.GetContent(tabTemplateId);

                            //$("#templateTabColor-css3-tabstrip-0-2").next().append("<span style='position:relative;color:red;top:3px;left3px;'>*</span>")

                            var newTabstripTabsHTML = '';
                            newTabstripTabsHTML += '<li class="tabstrip-li">';
                            newTabstripTabsHTML += '<input type="radio" typex="radio" class="tabstrip-radio" name="' + tabTemplateId + '-css3-tabstrip-0" checked="checked" id="' + tabTemplateId + '-css3-tabstrip-0-' + tabIndex + '" />';
                            newTabstripTabsHTML += '<label class="tabstrip-label" onclick="Tabstrips.Select(\'' + tabstripId.trim() + '\', ' + tabIndex + ');" for="css3-tabstrip-0-' + tabIndex + '">' + tabTitle;
                            newTabstripTabsHTML += '<span class="validationflagstyle">*</span>';
                            newTabstripTabsHTML += '</label>';
                            newTabstripTabsHTML += '<div id="' + tabTemplateId + 'Content">' + tabHTML + '</div>';
                            newTabstripTabsHTML += '</li>';
                            $(newTabstripHTML.children()[0]).append($(newTabstripTabsHTML));

                            let tabModel = new Me.TabModel(tabstripId, tabIndex, tabTemplateId);

                            Me.Tabs.push(tabModel);
                        });

                        // newTabstripHTML += ' ';

                        //var newTabstrip = newTabstripHTML; //.appendTo(hiddenElement);

                        //$(ts).html(newTabstripHTML);

                        //CLICK EVENT
                        //el.on("click", function (event) {
                        //    Me.Open(event.currentTarget);
                        //});

                        $(ts).after(newTabstripHTML);
                    }
                }
            });

        },
        TabModel: function (tabstripId, tabIndex, templateid) {

            var result = {
                TabstripID: tabstripId,
                Index: tabIndex,
                TemplateID: templateid,
                Content: ''
            };
            return result;
        },
        Content: function (tabstripId, tabIndex, content) {
            let result = '';
            let tab = Enumerable.From(this.Tabs).Where('$.TabstripID == "' + tabstripId + '" && $.Index == ' + tabIndex).ToArray();
            if (tab.length == 1) {
                tab.Content = content;
                result = tab.Content; //Return existing in case not setting
            }
        },
        Select: function (tabstripId, tabIndex) {

            //In server mode tab selection must happen AFTER page load
            //So the act of selection redirects page (with querystring)
            //(must pass in server mode both here and in initialize)
            //and the setting of tab is driven on page load and
            //calling "ServerSelect" and NOT using select callback


                var tabstripTabs = $("." + tabstripId + "-tabstrip-custom").find("input[typex='radio']");

                $.each(tabstripTabs, function (index, tab) {

                    $(tab).prop("checked", index === tabIndex);
                });


                if (Me.SelectCallback)
                    Me.SelectCallback(tabstripId, tabIndex);
        },
        ServerSelect: function (tabstripId, tabIndex) {
            var tabstripTabs = $("." + tabstripId + "-tabstrip-custom").find("input[typex='radio']");

            $.each(tabstripTabs, function (index, tab) {

                $(tab).prop("checked", index === tabIndex);
            });
        },
        SetValidationFlag: function (tabstripId, tabIndex, on, message) {
            var tabstripTabs = $("." + tabstripId + "-tabstrip-custom").find("input[typex='radio']");
            if (tabIndex < tabstripTabs.length) {
                //Makes the span element inside visible
                var display = on ? "inline" : "none";
                var validationSpan = $($(tabstripTabs[0]).next().children()[tabIndex]); //The element after the "radio" is the label. The span is inside the label
                validationSpan.css("display", display).attr("title", message);
            }
            else {
                console.warn("Cant find tab to set validation flag for Tabstrip '" + tabstripId + "'");
            }
        },

        SelectCallback: null

    };

    window.Tabstrips = Me;
    return Me;

});