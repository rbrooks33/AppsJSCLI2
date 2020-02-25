/*
    Dialog library
    requires jquery, linqjs
    Used to create a quick dialog with associated behavior
    History:
    12/5/2016 Changed util reference to common under editor, added templateid param to register and using template list in memory from util
    9/9/2017 Incorporated into apps
 */
define([], function () {

    var Me = {
        BaseFolder: '',
        Initialize: function () {

            Apps.Util.AddStyleReference(Me.BaseFolder + '/css/sampleDialogStyle.css');

            $(window).on('drop', function (event) {

                var elementId = event.originalEvent.dataTransfer.getData("text");

                $.each(Me.Dialogs, function (index, dialog) {

                    //dialogs is a coll of custom objects

                    if (dialog.ElementID === elementId) {
                        dialog.Selector.css("left", (event.originalEvent.pageX - 135) + "px");
                        dialog.Selector.css("top", (event.originalEvent.pageY - 30) + "px");
                    }
                });
                //$("#divSwatchWindow").css("left", (event.originalEvent.pageX - 100) + "px");
                // //$("#divSwatchWindow").css("top", event.originalEvent.pageY + "px");
                // $("#divConditionReplaceDialog").css("left", (event.originalEvent.pageX) + "px");
                // $("#divConditionReplaceDialog").css("top", (event.originalEvent.pageY) + "px");
            });

            //Close all dialogs
            //$(document).click(function (event) {
            //    Me.CloseAll();
            //});

            Apps.Util.AddScriptReference(Me.BaseFolder + '/modules/dialog_helpers.js');
        },
        Dialogs: [],
        OpenCallback: null,
        CloseCallback: null,
        SaveCallback: function (obj, id)
        {
            if (obj)
                obj(id);
        },
        CancelCallback: function (obj, id) {
            if (obj)
                obj(id);
        },
        MouseOverCallback: null,
        MouseOutCallback: null,
        ClickCallback: null,
        Register: function (elementId, className, templateId) {

            var exists = Me.Exists(elementId);
            if (!exists.Success) {

                //create dialog object
                var newDialog = new Me.DialogModel(elementId);

                //create element
                if (!className)
                    className = "defaultDialogStyle";

                var attributes = " id='" + elementId + "'";
                attributes += " class='" + className + "'";
                attributes += " draggable = 'true'";
                attributes += " ondragstart = 'dialog_dragstart_handler(event);'";
                attributes += " style='display:none;'";

                $(document.forms[0]).append("<div" + attributes +"></div>");
                newDialog.Selector = $("#" + elementId);

                //Me.Close(elementId); //default

                //add to collection
                Me.Dialogs.push(newDialog);

                //Apply template if included
                if(templateId)
                {
                    //Look for in memory list of templates
                    var template = Enumerable.From(Apps.Util.Templates).Where(function (t) { return t.ID === templateId; }).ToArray();
                    if (template.length === 1)
                    {
                        //Note that the placeholder is the element we just created
                        Apps.Util.LoadTemplate(template[0].Path, template[0].ID, elementId, Apps.Util.ApplyTemplate);
                    }
                }
            }
        },
        //EXAMPLE:
        //Me.Dialogs.Register2(dialogId, {
        //    width: 500,
        //    title: { color: "steelblue", text: "Connectivity Command Builder" },
        //    content: commandBuilderContent.html(),
        //    saveclick: function (id) {
        //        CommandBuilder.Save(id); //Requires global
        //    }
        //});
        Register2: function(id, settings)
        {
            var exists = Me.Exists(id);
            if (!exists.Success) {

                var height = "100%"; //Left blank grows with content
                var width = 400;
                var titlecolor = "blue";
                var titletext = "My Dialog Box";
                var saveclick = function (id) { };
                var cancelclick = function (id) {  };
                var customcontent = "my content";
                var style = "";

                if (settings)
                {
                    if (settings.height)
                        height = settings.height + "px";
                    width = settings.width;
                    titlecolor = settings.title.color;
                    titletext = settings.title.text;

                    if (settings.saveclick)
                        saveclick = settings.saveclick;

                    if (settings.cancelclick)
                        cancelclick = settings.cancelclick;

                    if (settings.style)
                        style = settings.style;

                    customcontent = settings.content;
                }

                var newDialog = new Me.DialogModel(id);
                //Me.Opened = false;

                var attributes = " id='" + id + "'";
                attributes += " style='display:none;"  + style + "'";

                if(settings.container)
                    settings.container.append("<div" + attributes + "></div>");
                else
                    $(document.body).append("<div" + attributes + "></div>");

                newDialog.Selector = $("#" + id);

                Me.Dialogs.push(newDialog);

                var content = '';
                content += '<div id="div_' + id + '_Dialog" draggable="true" ondragstart = "Apps.Dialogs.DragStart(\'' + id + '\', event);" style="overflow:auto;position:relative;z-index:999999;background:white;border:1px solid black; height: ' + height + '; width: ' + width + 'px;">';
                content += '';
                content += '<div id="' + id + '_Title"';
                content += 'style="font-size: larger;display: inline-block; height: 45px; width: ' + (width - 2) + 'px; background-color: ' + titlecolor + '; color: white; padding: 11px;">' + titletext + '</div>';
                content += '';
                content += '<div style="display: inline; position: relative; top: -38px; left: -6px; float: right; z-index: 200;">';
                content += '<input type="button" class="btn btn-default btn-sm" value="X" onclick="Apps.Dialogs.CancelCallback(' + cancelclick.toString() + ',\'' + id + '\');" />';
                content += '</div>';
                content += '<div id="' + id + '_Content" style="padding:21px;">';
                content += '';
                content += customcontent;
                content += '';
                content += '</div>';
                content += '<div style="display: inline; position: relative; top: -8px; left: 21px; z-index: 200;">';
                content += '<input type="button" id="' + id + '_DialogsButton" value="OK" class="btn btn-default btn-sm" onclick="Apps.Dialogs.SaveCallback(' + saveclick.toString() + ',\'' + id +'\');" />';
                content += '</div>';
                content += '';
                content += '</div>';

                newDialog.Selector.html(content);
            }

        },
        DragStart: function (event)
        {
            //event.preventDefault();
        },
        DragDrop: function (dialogId, event) {

            $('#' + dialogId).css("left", (event.clientX - 120) + 'px').css('top', (event.clientY - 300) + 'px');

            event.preventDefault();
        },
        DragOver: function (event) {
            event.preventDefault();
        },
        DragEnd: function (event)
        {

        },
        Content: function (id, content) {
            $("#" + id).find("#" + id + "_Content").html(content);
        },
        Open: function (elementId, x, y) {

            var dialogs = Enumerable.From(Me.Dialogs)
                .Where(function (d) { return d.ElementID === elementId; }).ToArray();

            if (dialogs.length === 1) {

                var dialog = dialogs[0];
                dialog.X = x;
                dialog.Y = y; //set for later refrence/use

                if (Me.Opened) {

                    if (Me.CloseCallback)
                        Me.CloseCallback(elementId);

                    $("#" + elementId).fadeOut("slow");
                    Me.Opened = false;
                }
                else {

                    if (Me.OpenCallback)
                        Me.OpenCallback(elementId);

                    $("#" + elementId).fadeIn("slow"); //.animate({ width: '70%', marginLeft: "0.6in" }, 1500); //("slow").css({ top: y + "px", left: x + "px" });

                    Me.Opened = true;
                }

                //if (x == null || y == null)
                //    Me.Refresh(dialog);
            }

        },
        Close: function (elementId) {
            $("#" + elementId).fadeOut("slow");
            Me.Opened = false;
            if (Me.CloseCallback)
                Me.CloseCallback();
        },
        CloseAll: function()
        {
            $.each(Me.Dialogs, function (index, dialog) {
                Me.Close(dialog.ElementID);
            });

        },
        Refresh: function (dialog) {
            var windowWidth = $(window).width();
            var windowHeight = $(window).height();

            //var dialog = $("#" + elementId);

            var newLeft = (windowWidth - dialog.Selector.width()) / 2;
            var newTop = (windowHeight - dialog.Selector.height()) / 2;

            dialog.X = newLeft;
            dialog.Y = newTop;

            dialog.Selector.css("position","absolute").css("left", newLeft + "px").css("top", newTop + "px");
        },
        Save: function (elementId) {
            if (Me.SaveCallback)
                Me.SaveCallback(elementId);
        },
        Opened: false,
        MouseOver: function(elementId)
        {
            if (Me.MouseOverCallback)
                Me.MouseOverCallback(elementId);
        },
        MouseOut: function(elementId)
        {
            if (Me.MouseOutCallback)
                Me.MouseOutCallback(elementId);
        },
        Click: function(dialogName, command, index)
        {
            if (Me.ClickCallback)
                Me.ClickCallback(dialogName, command, index);
        },
        Select: function(dialogName)
        {
            var result = new Me.Result();
            var dialogs = Enumerable.From(Me.Dialogs).Where(function (d) { return d.ElementID === dialogName; }).ToArray();
            if(dialogs.length === 1)
            {
                result.Dialog = dialogs[0];
                result.Success = true;
            }
            return result;
        },
        Exists: function (elementId) {

            var result = new Me.Result();

            if ($("#" + elementId) !== null) {
                var existsInCollection = Me.ExistsInCollection(elementId);
                if (existsInCollection.Success)
                    result.Success = true;
                else
                    result.Message = existsInCollection.Message;
            }

            return result;
        },
        ExistsInCollection: function (elementId) {

            var result = new Me.Result();

            var existingDialog = Enumerable.From(Me.Dialogs).Where(function (d) { return d.ElementID === elementId }).ToArray();
            if (existingDialog.length === 1) {
                result.Success = true;
            }
            else if (existingDialog.length === 0)
                result.Message = 'Element "' + elementId + '" is not in Dialogs collection.';
            else if (existingDialog.length > 1)
                result.Message = 'Element "' + elementId + '" has more than one entry (' + existingDialog.length + ') in Dialogs collection.';

            return result;
        },
        Result: function () {
            return {
                Success: false,
                Message: '',
                Dialog: null
            };
        },
        DialogModel: function (newid) {

            var result = {
                ElementID: newid,
                Selector: null,
                Width: '400px',
                Height: '200px',
                X: null,
                Y: null
            };

            return result;
        }

    }
   // Me.Initialize(); //Force host to call if needed since calls mostly depend on basefolder anyway
    return Me;

});