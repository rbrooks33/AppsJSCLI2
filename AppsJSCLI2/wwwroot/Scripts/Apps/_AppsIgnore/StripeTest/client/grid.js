/*
USAGE:

//random variable
var archived = Me.IsArchived ? 1 : 0;

//mess with collection 
Me.Projects = Enumerable.From(Me.Projects).Where(function (c) { return c.Archived === archived; }).ToArray();

$.each(Me.Projects, function (index, p) {
    p["ProgressBar"] = "";
    p["Assigned"] = "";
});
settings.data = Me.Projects;

//run
Master.Grids.RegisterHTML(settings);

SETTINGS:
        ProjectsGridSettings: function () {

            var settings =
            {
                id: "gridProjects",
                data: Me.Projects,
                title: "",
                tablestyle: "padding-left:50px;padding-right:50px;",
                tableactions: [
                    {
                        text: "Add Project",
                        actionclick: function () {
                            Projects.UpsertProject('-1', 'ProjectName', '[new project]');
                        }

                    }
                    ,
                    {
                        text: "View Removed",
                        actionclick: function () {
                            Projects.ViewArchived(true);
                        }

                    },
                    {
                        text: "View Live Projects",
                        actionclick: function () {
                            Projects.ViewArchived(false);
                        }

                    }

                ],
                filters: [
                    {
                        text: "Filter By Customer",
                        data: Projects.AllCustomers,
                        id: "FilterByCustomer",
                        textfield: "CustomerName",
                        valuefield: "CustomerID",
                        selectclick: function (value, valueField) {
                            Projects.Filter(value, valueField);
                        }
                    },
                    {
                        text: "Filter By Project Type",
                        id: "FilterByProjectType",
                        data: Projects.AllProjectTypes,
                        textfield: "ProjectTypeName",
                        valuefield: "ProjectTypeID",
                        selectclick: function (value, valueField) {
                            Projects.Filter(value, valueField);
                        }
                    },
                    {
                        text: "Filter By Status",
                        id: "FilterByProjectStatus",
                        data: Projects.AllProjectStatuses,
                        textfield: "ProjectStatus",
                        valuefield: "ProjectStatusID",
                        selectclick: function (value, valueField) {
                            Projects.Filter(value, valueField);
                        }
                    }

                ],
                rowactions: [
                {
                    text: "Remove",
                    actionclick: function (td, rowdata, editcontrol) {
                        Projects.UpsertProject(JSON.parse(rowdata).ProjectID, 'Archived', 1);
                    }
                },
                {
                    text: "Make Live",
                    actionclick: function (td, rowdata, editcontrol) {
                        Projects.UpsertProject(JSON.parse(rowdata).ProjectID, 'Archived', 0);
                    }
                },
                {
                    text: "Make Complete",
                    actionclick: function (td, rowdata, editcontrol) {
                        var p = JSON.parse(rowdata);
                        Projects.UpsertProject(p.ProjectID, 'ProjectStatusID', 4);
                    }
                },
                {
                    text: "Go To Project",
                    actionclick: function (td, rowdata, editcontrol) {
                        var p = JSON.parse(rowdata);
                        Projects.GoToProject(p);
                    }
                },
                {
                    text: "Go To Customer",
                    actionclick: function (td, rowdata, editcontrol) {
                        var p = JSON.parse(rowdata);
                        Projects.GoToCustomer(p);
                    }
                }

                ],
                //rowbuttons: [
                //    {
                //        text: "Do Work",
                //        buttonclick: function (td, rowdata) {
                //            Projects.DoWork(td, rowdata);
                //        }
                //    }
                //],
                fields: [
                    {
                        name: "ProjectID"
                    },
                    {
                        name: "CustomerName",
                        edittype: "select", //text, select
                        editdata: { //used for select etc.
                            data: Me.AllCustomers,
                            textfield: "CustomerName",
                            valuefield: "CustomerID"
                        },
                        editclick: function (td, rowdata, editControl) {
                        },
                        saveclick: function (td, rowdata, editControl) {

                            var customerId = $(editControl).val();

                            Projects.UpsertProject(rowdata.ProjectID, 'CustomerID', customerId);
                        },
                        cancelclick: function (td) {
                            //for demo only (closes automatically)
                        }
                    },
                    //{
                    //    name: "DepartmentName",
                    //    edittype: "select", //text, select
                    //    editdata: { //used for select etc.
                    //        data: Me.AllDepartments,
                    //        textfield: "DepartmentName",
                    //        valuefield: "DepartmentID"
                    //    },
                    //    saveclick: function (td, rowdata, editcontrol) {
                    //        Projects.UpsertProject(rowdata.ProjectID, 'DepartmentID', $(editcontrol).val());
                    //    }
                    //},
                    {
                        name: "ProjectTypeName",
                        edittype: "select", //text, select
                        editdata: { //used for select etc.
                            data: Me.AllProjectTypes,
                            textfield: "ProjectTypeName",
                            valuefield: "ProjectTypeID"
                        },
                        editclick: function (td, rowdata, editControl) { },
                        saveclick: function (td, rowdata, editcontrol) {
                            Projects.UpsertProject(rowdata.ProjectID, 'ProjectTypeID', $(editcontrol).val());
                        },
                        cancelclick: function (td) { }
                    },
                    {
                        name: "ProjectName",
                        saveclick: function (td, rowdata, editcontrol) {
                            Projects.UpsertProject(rowdata.ProjectID, 'ProjectName', $(editcontrol).val());
                        },
                        editclick: function () { }
                    },
                    {
                        name: "Comments",
                        edittype: "textarea",
                        saveclick: function (td, rowdata, editcontrol) {
                            Projects.UpsertProject(rowdata.ProjectID, 'Comments', $(editcontrol).val());
                        },
                        editclick: function () { }
                    },
                    {
                        name: "Order",
                        saveclick: function (td, rowdata, editcontrol) {
                            Projects.UpsertProject(rowdata.ProjectID, 'Order', $(editcontrol).val());
                        },
                        editclick: function () { }
                    },
                     {
                         name: "DocumentNumber",
                         saveclick: function (td, rowdata, editcontrol) {
                             Projects.UpsertProject(rowdata.ProjectID, 'DocumentNumber', $(editcontrol).val());
                         },
                         editclick: function () { }
                     },
                   {
                       name: "DueDate",
                       saveclick: function (td, rowdata, editcontrol) {
                           Projects.UpsertProject(rowdata.ProjectID, 'DueDate', $(editcontrol).val());
                       },
                       editclick: function (td, rowdata, editcontrol) {

                           Projects.EditDueDate(td, rowdata, editcontrol);

                       }
                   },
                    {
                        name: "Priority",
                        saveclick: function (td, rowdata, editcontrol) {
                            Projects.UpsertProject(rowdata.ProjectID, 'Priority', $(editcontrol).val());
                        },
                        editclick: function () { }

                    },
                    {
                        name: "ProjectStatus",

                        edittype: "select", //text, select
                        editdata: { //used for select etc.
                            data: Me.AllProjectStatuses,
                            textfield: "ProjectStatus",
                            valuefield: "ProjectStatusID"
                        },
                        saveclick: function (td, rowdata, editcontrol) {
                            Projects.UpsertProject(rowdata.ProjectID, 'ProjectStatusID', $(editcontrol).val());
                        },
                        editclick:function(){}
                    },
                    {
                        name: "EstimatedHours",
                        saveclick: function (td, rowdata, editcontrol) {
                            Projects.UpsertProject(rowdata.ProjectID, 'EstimatedHours', $(editcontrol).val());
                        },
                        editclick:function(){}
                    },

                    { name: "totalelapsed" },
                    { name: "ProgressBar" },
                    {
                        name: "Assigned",
                        edittype: "select", //text, select
                        editdata: { //used for select etc.
                            data: Me.AllUsers,
                            textfield: "ADUserID",
                            valuefield: "ADUserID"
                        },
                        saveclick: function (td, rowdata, editcontrol) {
                            Projects.SaveAssigned(td, rowdata, editcontrol);
                        }
                    }
                ],
                columns: [
                { fieldname: "ProjectID", text: "ID" },
                {
                    fieldname: "CustomerName",
                    text: "Customer",
                    template: "[[CustomerName]]",
                    templatedata: Me.Projects,
                    click: function () {
                        //sort
                        Projects.Sort2('CustomerName');
                    }


                },
                {
                    fieldname: "ProjectTypeName", text: "Type",
                    click: function () {
                        //sort
                        Projects.Sort2('ProjectTypeName');
                    }
                },
                {
                    fieldname: "ProjectName", text: "Name",
                    click: function () {
                        //sort
                        Projects.Sort2('ProjectName');
                    },
                    format: function (p) {
                        if (p.ProjectName.length > 10)
                            return '' + p.ProjectName.substring(0, 12) + '...';
                        else
                            return p.ProjectName;
                    },
                    tooltip: function (p) {
                        return p.ProjectName;
                    }

                },
                {
                    fieldname: "Comments", text: "Comments",
                    format: function(p)
                    {
                        if (p.Comments.length > 10)
                            return '' + p.Comments.substring(0, 12) + '...';
                        else
                            return p.Comments;
                    },
                    tooltip: function(p)
                    {
                        return p.Comments;
                    }
                },
                {
                    fieldname: "DocumentNumber", text: "Charge #",
                    click: function () {
                        //sort
                        Projects.Sort2('DocumentNumber');
                    }
                },
                {
                    fieldname: "DueDate",
                    text: "Due",
                    format: function (p) {

                        var dateOnly = "";
                        if (p.DueDate) {
                            var dueDate = new Date(p.DueDate);
                            dateOnly = (dueDate.getMonth() + 1) + "/" + (dueDate.getDate() + 1) + "/" + dueDate.getUTCFullYear();
                        }
                        return dateOnly;
                    },
                    click: function () {
                        //sort
                        Projects.Sort2('DueDate');
                    },

                },
                {
                    fieldname: "Priority",
                    text: "Priority",
                    click: function () {
                        Projects.Sort2('Priority');
                    }
                },
                {
                    fieldname: "ProjectStatus",
                    text: "Status",
                    widthpercent: 10,
                    click: function () {
                        //sort
                        Projects.Sort2('ProjectStatus');
                    }

                },
                {
                    fieldname: "EstimatedHours",
                    text: "Est. Hours",
                    click: function () {
                        //sort
                        Projects.Sort2('EstimatedHours');
                    }

                },
                {
                    fieldname: "totalelapsed",
                    text: "Elapsed",
                    format: function (p) {

                        return Projects.FormatElapsed(p);
                    },
                    click: function () {
                        //sort
                        Projects.Sort2('totalelapsed');
                    }

                },
                {
                    fieldname: "ProgressBar",
                    text: "",
                    format: function (p) {
                        return Projects.FormatGuage(p);
                    }
                },
                {
                    fieldname: "Assigned",
                    text: "Assigned",
                    format: function (p) {
                        return Projects.FormatAssigned(p)
                    }
                }

                ]
            }
            return settings;
        },

*/
define(['./util.js'], function (Util) {
    var Me = {

        Initialize: function () {

            $(document).click(function (event) {

                var targetclass = $(event.target).attr("class");

                if (targetclass !== "grid_view_span"
                    && targetclass !== "grid_edit_span"
                    && !$(event.target).hasClass("editcontrol")
                    && !$(event.target).hasClass("isdate")
                    && !$(event.target).hasClass("jqte_tool_icon")
                    && !$(event.target.offsetParent).hasClass("editCellStyle")
                    && !$(event.target.parentElement).hasClass("grid_view_span")
                    && !$(event.target).hasClass("jqte_editor")) {

                    $(".grid_view_span").show();
                    $(".grid_edit_span").hide();
                }
            });
            Apps.Grids = Me;
        },
        Grids: [],
        ClickCellCallback: null,
        DeleteCallback: null,
        RefreshCallback: null,
        EditSaveCallback: function (settings, rowdata, callback) {
            //get new values
            var objRowData = JSON.parse(unescape(rowdata));
            settings = JSON.parse(unescape(settings));
            var uniqueIdField = settings.uniqueidfield;

            $.each(settings.fields, function (index, field) {

                var uniqueId = eval('objRowData.' + uniqueIdField);

                if (field.type === 'text') {

                    var textElement = $('#' + settings.prefix + '_' + field.name + '_GridsEdit' + uniqueId);
                    if (textElement.length === 1)
                        eval('objRowData.' + field.name + ' = "' + $(textElement[0]).val() + '"');
                }
                else if (field.type === 'textarea') {
                    var textAreaElement = $('#' + settings.prefix + '_' + field.name + '_GridsEdit' + uniqueId);
                    if (textAreaElement.length === 1)
                        eval('objRowData.' + field.name + ' = "' + $(textAreaElement[0]).text() + '"');
                }
                else if (field.type === 'editor') //REQUIRES ESCAPING VALUE
                {
                    var editorElement = $('#' + settings.prefix + '_' + field.name + '_GridsEdit' + uniqueId);
                    if (editorElement.length === 1) {
                        eval('objRowData.' + field.name + ' = "' + escape($(editorElement[0]).parent().prev().html()) + '"');
                    }

                }

            });

            if (callback)
                callback(objRowData);
        },
        AddSaveCallback: function (settings, callback) {

            settings = JSON.parse(unescape(settings));

            if (callback)
                callback(settings);
        },
        EditCancelCallback: function (prefix) {
            Apps.Grids.EditClose(prefix);
        },
        EditClose: function (prefix) {
            $('#' + prefix + '_GridsEditDialog').hide();
        },
        Edit: function (settings) {
            //Pop up a dialog with name/value edit controls
            var prefix = settings.prefix;
            var uniqueIdField = settings.uniqueidfield;
            var objRowData = JSON.parse(settings.rowdata);
            //append (for travel) to settings
            //objRowData.settings = settings;

            //var buttonGroup = $(button).parent();

            var div = $('#' + prefix + '_GridsEditDialog');

            if (div.length === 0)
                div = $('<div id="' + prefix + '_GridsEditDialog"></div>').appendTo(document.body);

            var screenHeight = $(window).height();
            var screenWidth = $(window).width();
            var left = (screenWidth - settings.width) / 2;
            var top = (screenHeight - settings.height) / 2;

            $(div)
                .css("border", "1px black solid")
                .css("border-radius", "3px")
                .css("position", "absolute")
                .css("top", top + "px")
                .css("left", left + "px")
                .width(settings.width)
                .height(settings.height)
                .css("background", "white")
                .css("z-index", "99")
                .css("overflow-x:scroll");

            var table = '<table>';

            $.each(settings.fields, function (index, field) {

                var uniqueId = eval('objRowData.' + uniqueIdField);


                table += '<tr>';

                if (!settings.float) {

                    table += '<td style="padding:3px;">' + field.text + '</td>';

                    if (field.type === 'text') {
                        table += '<td style="padding:3px;"><input id="' + prefix + '_' + field.name + '_GridsEdit' + uniqueId + '" type="text" value="' + eval('objRowData.' + field.name) + '" /></td>';
                    }
                    else if (field.type === 'textarea') {
                        table += '<td style="padding:3px;"><textarea id="' + prefix + '_' + field.name + '_GridsEdit' + uniqueId + '">' + eval('objRowData.' + field.name) + '</textarea></td>';
                    }
                    else if (field.type === 'editor') {
                        table += '<td style="padding:3px;"><input class="' + prefix + '_' + field.name + '_Editor" id="' + prefix + '_' + field.name + '_GridsEdit' + uniqueId + '" type="text" value="" /></td>';
                    }
                }
                else {
                    table += '<td>';
                    table += '<span style="padding:3px;">' + field.text + '</span>';

                    if (field.type === 'text') {
                        table += '<span style="padding:3px;"><input id="' + prefix + '_' + field.name + '_GridsEdit' + uniqueId + '" type="text" value="' + eval('objRowData.' + field.name) + '" /></span>';
                    }
                    else if (field.type === 'textarea') {
                        table += '<span style="padding:3px;"><textarea id="' + prefix + '_' + field.name + '_GridsEdit' + uniqueId + '">' + eval('objRowData.' + field.name) + '</textarea></span>';
                    }
                    else if (field.type === 'editor') {
                        table += '<span style="padding:3px;"><input class="' + prefix + '_' + field.name + '_Editor" id="' + prefix + '_' + field.name + '_GridsEdit' + uniqueId + '" type="text" value="" /></span>';
                    }
                    table += '</td>';
                }

                table += '</tr>';
            });

            table += '</table>';

            //Build dialog
            var content = '';
            content += '<div id="divDialog" style="z-index: 999999;">';
            content += '';
            content += '<div id="' + prefix + '_Title"';
            content += 'style="font-size: larger;display: inline-block; height: 39px; width: ' + settings.width + 'px; background-color: ' + settings.title.color + '; color: white; border-top-left-radius: 3px; border-top-right-radius: 3px; padding: 11px;">' + settings.title.text + '</div>';
            content += '';
            content += '<div style="display: inline; position: relative; top: -36px; left: -4px; float: right; z-index: 200;">';
            content += '<input type="button" class="btn btn-default btn-sm" value="X" onclick="Apps.Grids.EditCancelCallback(\'' + prefix + '\')" />';
            content += '</div>';
            content += '<div style="display: inline; position: relative; top: 300px; left: 4px; z-index: 200;">';
            content += '    <input type="button" id="' + prefix + '_GridsEditDialogOkButton" value="OK" class="btn btn-default btn-sm" onclick="Apps.Grids.EditSaveCallback(\'' + escape(JSON.stringify(settings)) + '\',\'' + escape(JSON.stringify(objRowData)) + '\', ' + settings.saveclick.toString() + ');" />';
            content += '</div>';
            content += '<div id="' + prefix + '_GridsEditContentAll" style="overflow-x:hidden;overflow-y:auto;height:400px;width:100%;">';
            content += '<div id="' + prefix + '_GridsEditContentAbove"></div>';
            content += '<div id="Content" style="padding:21px;">';
            content += '';
            content += table;
            content += '';
            content += '</div>';
            content += '<div id="' + prefix + '_GridsEditContentBelow"></div>';
            content += '</div>';
            content += '';
            content += '</div>';

            $(div).html(content);

            //Convert to jqte and apply values
            $.each(settings.fields, function (index, field) {

                if (field.type === 'editor') {
                    var fieldValue = unescape(eval('objRowData.' + field.name));
                    var editorClassName = prefix + '_' + field.name + '_Editor';
                    $(div).find("." + editorClassName).jqte();
                    $(div).find("." + editorClassName).jqteVal(fieldValue);
                }
            });
            $(div[0]).show();

        },
        Add: function (settings) {
            //Pop up a dialog with name/value edit controls
            var prefix = settings.prefix;

            var div = $('#' + prefix + '_GridsEditDialog');

            if (div.length === 0)
                div = $('<div id="' + prefix + '_GridsEditDialog"></div>').appendTo(document.body);

            var screenHeight = $(window).height();
            var screenWidth = $(window).width();
            var left = (screenWidth - settings.width) / 2;
            var top = (screenHeight - settings.height) / 2;

            $(div)
                .css("border", "1px black solid")
                .css("border-radius", "3px")
                .css("position", "absolute")
                .css("top", top + "px")
                .css("left", left + "px")
                .width(settings.width)
                .height(settings.height)
                .css("background", "white")
                .css("z-index", "9999");

            var table = '<table>';

            $.each(settings.fields, function (index, field) {

                var uniqueId = ''; //eval('objRowData.' + uniqueIdField);

                table += '<tr>';

                table += '<td style="padding:3px;">' + field.text + '</td>';

                if (field.type === 'text') {
                    table += '<td style="padding:3px;"><input id="' + prefix + '_' + field.name + '_GridsEdit' + uniqueId + '" type="text" value="" /></td>';
                }
                else if (field.type === 'textarea') {
                    table += '<td style="padding:3px;"><textarea id="' + prefix + '_' + field.name + '_GridsEdit' + uniqueId + '"></textarea></td>';
                }
                else if (field.type === 'editor') {
                    table += '<td style="padding:3px;"><input class="' + prefix + '_' + field.name + '_Editor" id="' + prefix + '_' + field.name + '_GridsEdit' + uniqueId + '" type="text" value="" /></td>';
                }

                table += '</tr>';
            });

            table += '</table>';

            //Build dialog
            var content = '';
            content += '<div id="divDialog" style="z-index: 999999;">';
            content += '';
            content += '<div id="' + prefix + '_Title"';
            content += 'style="font-size: larger;display: inline-block; height: 39px; width: ' + settings.width + 'px; background-color: ' + settings.title.color + '; color: white; border-top-left-radius: 3px; border-top-right-radius: 3px; padding: 11px;">' + settings.title.text + '</div>';
            content += '';
            content += '<div style="display: inline; position: relative; top: -36px; left: -4px; float: right; z-index: 200;">';
            content += '<input type="button" class="btn btn-default btn-sm" value="X" onclick="Apps.Grids.EditCancelCallback(\'' + prefix + '\')" />';
            content += '</div>';
            content += '<div id="Content" style="padding:21px;">';
            content += '';
            content += table;
            content += '';
            content += '</div>';
            content += '<div style="display: inline; position: relative; top: 10px; left: 4px; z-index: 200;">';
            content += '<input type="button" id="' + prefix + '_GridsEditDialogOkButton" value="OK" class="btn btn-default btn-sm" onclick="Apps.Grids.AddSaveCallback(\'' + escape(JSON.stringify(settings)) + '\', ' + settings.saveclick.toString() + ');" />';
            content += '</div>';
            content += '';
            content += '</div>';

            $(div).html(content);

            //Convert to jqte and apply values
            $.each(settings.fields, function (index, field) {
                if (field.type === 'editor') {
                    var editorClassName = prefix + '_' + field.name + '_Editor';
                    $(div).find("." + editorClassName).jqte();
                    // $(div).find("." + editorClassName).jqteVal(eval('objRowData.' + field.name));
                }
            });
            $(div[0]).show();

        },
        Register: function (elementId, height, editable) {

            var exists = Me.Exists(elementId);
            if (!exists.Success) {

                var newGrid = new Me.GridModel(elementId);

                var attributes = " id='" + elementId + "'";
                $(document.forms[0]).append("<div" + attributes + "></div>");
                newGrid.Selector = $("#" + elementId);
                newGrid.Editable = editable;

                if (!height)
                    height = "";

                newGrid.Height = height;
                Apps.Grids.push(newGrid);
            }

        },
        AddCallback: function (callback) {
            if (callback)
                callback();
        },
        EditCallback: function (callback, td) {

            if (td) {
                Me.ShowHideCell(td[0], false);

                var editcontrol = $(td).find(".editcontrol"); //Should only be one
                $(editcontrol).select();
                var rowdata = unescape(td.parent().attr("rowdata"));
                var rowdataobj = JSON.parse(rowdata);
            }

            if (callback) {

                if (td)
                    callback(td[0], rowdataobj, editcontrol[0]);
                else
                    callback();
            }
        },
        SaveCallback: function (callback, td) {

            Me.ShowHideCell(td[0], false);

            var editcontrol = $(td).find(".editcontrol"); //Should only be one
            var rowdata = unescape(td.parent().attr("rowdata"));
            var rowdataobj = JSON.parse(rowdata);

            if (callback)
                callback(td[0], rowdataobj, editcontrol[0]);
        },
        CancelCallback: function (callback, td) {

            Me.ShowHideCell(td[0], true);

            if (callback)
                callback(td[0]);

            return false;
        },
        ColumnCallback: function (callback, td) {
            if (callback)
                callback();
        },
        TooltipCallback: function (callback) {
            if (callback)
                callback();
        },
        TableActionCallback: function (callback) {

            if (callback)
                callback();
        },
        RowActionCallback: function (callback, td) {

            var rowdata = unescape($($(td).parent().parent().parent().parent()[0]).attr("rowdata"));

            if (callback)
                callback(td, rowdata);
        },
        RowButtonCallback: function (callback, td) {

            var rowdata = unescape($($(td).parent().parent().parent()[0]).attr("rowdata")); //button is not inside divs/li/ul etc.

            if (callback)
                callback(td, rowdata);
        },
        RowMouseOverCallback: function (callback, td, rowdata) {

            if (callback)
                callback(td, rowdata);
        },

        RowMouseOutCallback: function (callback, td, rowdata) {

            if (callback)
                callback(td, rowdata);
        },

        RowClickCallback: function (callback, td, rowdata) {

            if (callback)
                callback(td, rowdata);
        },
        FilterCallback: function (callback, value, valueField) {
            if (callback)
                callback(value, valueField);
        },
        ShowHideCell: function (td, cancel) {
            if (!cancel) {
                $(td.children[0]).hide();
                $(td.children[1]).show();
            }
            else {
                $(td.children[0]).show();
                $(td.children[1]).hide();

            }

        },
        RegisterHTML: function (settings) {
            var elementId = settings.id;
            // var addcallback = settings.add.addclick;
            // var addbuttontext = settings.add.text;

            var exists = Me.Exists(elementId);

            if (!exists.Success) {

                //create grid object
                var newGrid = new Me.GridModel(elementId);
                Apps.Grids.push(newGrid);

                // var grid = $("#" + elementId);


                var newdiv = $('<div id="' + elementId + '" style="' + settings.tablestyle + '"></div>');

                var newtable = $('<table></table>');

                newdiv.append(newtable);
                $(document.body).append(newdiv);

                newGrid.Selector = newdiv; //table;
                //newGrid.Editable = editable;
                Me.RefreshHTML(settings);
            }
            else {
                Me.RefreshHTML(settings);
            }
        },
        RowData: null,
        GetTR: function (objRowData) //"rowdata" attr is escaped/serialized bound object (Me.RowData)
        {
            var strRowData = JSON.stringify(objRowData);
            var escapedRowData = escape(strRowData);
            var tr = $('tr[rowdata="' + escapedRowData + '"]');
            return tr;
        },
        GetTable: function (settings) {
            settings.returntableonly = true;
            Me.RefreshHTML(settings);
            settings.table.attr("id", settings.id); //Give it the name that would normally go to the grid parent div
            return settings.table[0];
        },
        RefreshHTML: function (settings) {

            var title = settings.title;
            var data = settings.data;
            var columns = settings.columns;
            var fields = settings.fields;

            var returnonly = false;

            if (settings.returntableonly !== undefined)
                if (settings.returntableonly === true)
                    returnonly = true;

            var tablestyle = '';
            if (settings.tablestyle)
                tablestyle = settings.tablestyle;

            if (!returnonly) {

                var div = Me.Grid(settings.id);
                var table = $(div.Selector.find("table")[0]);
                table.attr("style", tablestyle);

                table.empty();
            }
            //HEADER
            if (settings.columns) {

                var rows = '';

                if (settings.title) {

                    rows += '<tr>';
                    rows += '<td valign="top" colspan="' + columns.length + '" style="border-top:0px;"><h2>' + title;
                    if (settings.add)
                        rows += '&nbsp;<input id="add' + settings.id + '" onclick="Apps.Grids.AddCallback(' + settings.add.addclick.toString() + ')" value="' + settings.add.text + '" type="button" class="btn btn-sm btn-primary" />';

                    if (settings.tableactions) {

                        rows += '        <div class="btn-group"> ';
                        rows += '           <button type="button" class="btn btn-sm btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> ';
                        rows += '               Actions <span class="caret"></span> ';
                        rows += '           </button> ';
                        rows += '           <ul class="dropdown-menu"> ';
                        //rows += '               <li><a href="#" onclick="Apps.Grids.TableActionCallback()">All</a></li> ';
                        //rows += '               <li role="separator" class="divider"></li> ';

                        $.each(settings.tableactions, function (index, action) {

                            rows += '           <li><a href="#" onclick="Apps.Grids.TableActionCallback(' + action.actionclick.toString() + ')">' + action.text + '</a></li> ';

                        });

                        rows += '           </ul> ';
                        rows += '       </div> ';
                    }

                    if (settings.filters) {

                        $.each(settings.filters, function (index, filter) {

                            // rows += '<td>';
                            rows += '        <div class="btn-group"> ';
                            rows += '           <button type="button" class="btn btn-sm btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> ';
                            rows += '               ' + filter.text + '<span class="caret"></span> ';
                            rows += '           </button> ';
                            rows += '           <ul class="dropdown-menu"> ';
                            rows += '               <li><a href="#" onclick="Apps.Grids.FilterCallback(' + filter.selectclick.toString() + ',\'0\',\'' + filter.textfield + '\')">All</a></li> ';
                            rows += '               <li role="separator" class="divider"></li> ';
                            $.each(filter.data, function (index, fd) {

                                rows += '           <li><a href="#" onclick="Apps.Grids.FilterCallback(' + filter.selectclick.toString() + ',\'' + eval('fd.' + filter.valuefield) + '\',\'' + filter.valuefield + '\')">' + eval('fd.' + filter.textfield) + '</a></li> ';

                            });
                            rows += '           </ul> ';
                            rows += '       </div> ';
                            //                        rows += '</td>';
                        });
                    }

                    rows += '</h2>';
                    rows += '</td>';
                    rows += '</tr>';
                }

                //HEADER BEGIN
                rows += '<tr>';

                if (settings.rowactions)
                    rows += '<td valign="top" style="width:1%;border-top:0px;"></td>'; //holds actions

                //ROW BUTTON ORIENTATION
                var rowbuttonorientation = "left";
                if (settings.rowbuttonorientation)
                    rowbuttonorientation = settings.rowbuttonorientation;

                //ROW BUTTON HEADER
                var rowbuttonheader = '';
                var rowbuttonwidthpercent = 1;
                if (settings.rowbuttonwidthpercent)
                    rowbuttonwidthpercent = settings.rowbuttonwidthpercent;

                rowbuttonheader = '<td valign="top" style="width:' + rowbuttonwidthpercent + '%;border-top:0px;"></td>'; //holds buttons

                //ROW BUTTON
                var rowbuttons = '';
                if (settings.rowbuttons) {

                    rowbuttons += '<td valign="top">';
                    rowbuttons += '<div class="btn-group"> ';

                    $.each(settings.rowbuttons, function (index, button) {

                        rowbuttons += '<input type="button" class="btn btn-xs btn-warning" value="' + button.text + '" onclick="Apps.Grids.RowButtonCallback(' + button.buttonclick.toString() + ',this);" /> ';
                    });

                    rowbuttons += '</div> ';
                    rowbuttons += '</td>';
                }

                //COLUMN HEADER CELLS
                if (settings.rowbuttons && rowbuttonorientation === "left") {
                    rows += rowbuttonheader;
                }

                $.each(columns, function (index, col) {

                    if (col.hidden === undefined || col.hidden === false) { //Check if hidden
                        var columnclick = '';
                        if (col.click)
                            columnclick = 'onclick="Apps.Grids.ColumnCallback(' + col.click.toString() + ')"';

                        rows += '<td valign="top" style="width:' + col.widthpercent + '%;border-top:0px;" ' + columnclick + '><b>' + col.text + '</b></td>';
                    }
                });

                if (settings.rowbuttons && rowbuttonorientation === "right") {
                    rows += rowbuttonheader;
                }

                rows += '</tr>';

                //ROWS
                $.each(data, function (index, d) {

                    Me.RowData = d; //To keep in scope

                    var rowmouseover = '';
                    if (settings.rowmouseover)
                        rowmouseover = 'onmouseover="Apps.Grids.RowMouseOverCallback(' + settings.rowmouseover.toString() + ', this, \'' + escape(JSON.stringify(Me.RowData)) + '\');"';

                    var rowmouseout = '';
                    if (settings.rowmouseout)
                        rowmouseout = 'onmouseout="Apps.Grids.RowMouseOutCallback(' + settings.rowmouseout.toString() + ', this, \'' + escape(JSON.stringify(Me.RowData)) + '\');"';

                    var rowclick = '';
                    if (settings.rowclick)
                        rowclick = 'onclick="Apps.Grids.RowClickCallback(' + settings.rowclick.toString() + ', this, \'' + escape(JSON.stringify(Me.RowData)) + '\');"';

                    rows += '<tr rowdata="' + escape(JSON.stringify(d)) + '" ' + rowmouseover + ' ' + rowmouseout + ' ' + rowclick + '>';

                    //ACTIONS
                    if (settings.rowactions) {

                        rows += '<td valign="top">';

                        rows += '<div class="dropdown">';
                        rows += '    <button type="button" class="btn btn-warning btn-sm dropdown-toggle" data-toggle="dropdown">';
                        rows += '        Actions';
                        rows += '    </button>';
                        rows += '    <div class="dropdown-menu">';
                        //rows += '        <a class="dropdown-item" href="#">Link 1</a>';
                        //rows += '        <a class="dropdown-item" href="#">Link 2</a>';
                        //rows += '        <a class="dropdown-item" href="#">Link 3</a>';
                        //rows += '    </div>';
                        //rows += '</div>';

                        //rows += '<div class="btn-group"> ';
                        //rows += '   <button type="button" class="btn btn-xs btn-warning dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> ';
                        //rows += '       Actions <span class="caret"></span> ';
                        //rows += '   </button> ';
                        //rows += '  <ul class="dropdown-menu"> ';

                        $.each(settings.rowactions, function (index, action) {

                            //rows += '    <li><a href="#" onclick="Apps.Grids.RowActionCallback(' + action.actionclick.toString() + ',this);">' + action.text + '</a></li> ';
                            rows += '    <a class="dropdown-item" href="#" onclick="Apps.Grids.RowActionCallback(' + action.actionclick.toString() + ',this);">' + action.text + '</a>';

                        });

                        //rows += '  </ul> ';
                        //rows += '</div> ';
                        rows += '    </div>';
                        rows += '</div>';

                        rows += '</td>';
                    }

                    //BUTTONS
                    if (rowbuttons && rowbuttonorientation === "left")
                        rows += rowbuttons;

                    //CELLS
                    $.each(fields, function (index, field) {

                        //Get column for this field
                        var cols = Enumerable.From(columns).Where(function (c) { return c.fieldname === field.name; }).ToArray();

                        if (cols.length === 1) {

                            var col = cols[0];

                            if (col.hidden === undefined || col.hidden === false) {

                                var fieldValue = eval('Me.RowData.' + field.name);

                                if (!fieldValue)
                                    fieldValue = "";
                                //{

                                if (fieldValue.length === 0)
                                    fieldValue = "";


                                //VIEW (CLICK)
                                if (field.editclick)
                                    editclick = 'onclick="Apps.Grids.EditCallback(' + field.editclick.toString() + ', $(this).parent())"';
                                else
                                    editclick = ''; //onclick="Grids.EditCallback(function(){}, $(this).parent())"';

                                if (col.tooltip)
                                    tooltip = col.tooltip;
                                else
                                    tooltip = function () { return ''; }

                                var viewSpan = '<span class="grid_view_span" title="' + tooltip(Me.RowData) + '" ' + editclick + '>' + fieldValue + '</span>';

                                //VIEW (TEMPLATE)
                                if (col.template) {
                                    var templatecontent = col.template;

                                    $.each(fields, function (index, templatefield) {
                                        var templatevalue = eval('Me.RowData.' + templatefield.name);
                                        templatecontent = templatecontent.replace('[[' + templatefield.name + ']]', templatevalue);
                                    });
                                    viewSpan = '<span class="grid_view_span" title="' + tooltip(Me.RowData) + '" ' + editclick + '>' + templatecontent + '</span>';
                                }

                                //VIEW (FORMAT)
                                if (col.format) {

                                    viewSpan = '<span class="grid_view_span" title="' + tooltip(Me.RowData) + '" ' + editclick + '>' + col.format(Me.RowData) + '</span>';
                                }

                                //EDIT
                                var editSpan = '<span class="grid_edit_span" style="display:none;">';

                                var edittype = "text"; //default to text

                                if (field.edittype)
                                    edittype = field.edittype;

                                switch (edittype) {
                                    case "text":

                                        editSpan += '<input class="editcontrol" value="' + fieldValue + '" />&nbsp;';

                                        break;

                                    case "textarea":

                                        editSpan += '<textarea class="editcontrol">' + fieldValue + '</textarea>&nbsp;';

                                        break;
                                    case "editor":


                                        editSpan += '<textarea class="editcontrol editor">' + fieldValue + '</textarea>&nbsp;';

                                        break;
                                    case "select":

                                        editSpan += '<select class="editcontrol form-control">';

                                        if (field.editdata) {
                                            $.each(field.editdata.data, function (index, item) {
                                                editSpan += '<option value="' + eval('item.' + field.editdata.valuefield) + '">' + eval('item.' + field.editdata.textfield) + '</option>';
                                            });
                                        }

                                        editSpan += '</select>';

                                        break;
                                }



                                //SAVE
                                editSpan += '<span class="btn-group">';
                                editSpan += '   <input type="button" class="btn btn-sm btn-default" value="Save" ';
                                if (field.saveclick)
                                    editSpan += '      onclick="Apps.Grids.SaveCallback(' + field.saveclick.toString() + ', $(this).parent().parent().parent())" ';
                                editSpan += '   />';

                                //CANCEL
                                editSpan += '   <input type="button" class="gridcancelcontrol btn btn-sm btn-default" value="Cancel" ';
                                if (field.cancelclick)
                                    editSpan += '      onclick="Apps.Grids.CancelCallback(' + field.cancelclick.toString() + ', $(this).parent().parent().parent())" ';
                                else
                                    editSpan += '      onclick="Apps.Grids.CancelCallback(function(){}, $(this).parent().parent().parent())" ';
                                editSpan += '   />';
                                editSpan += '</span></span>';

                                rows += '<td valign="top" class="' + settings.id + 'Cell editCellStyle" index="' + index + '">';
                                rows += viewSpan;
                                rows += editSpan;
                                rows += '</td>';

                                //}//Check if field value (eval'd) is null
                                //else {
                                //  var hi = "ya";
                                //}
                            } //Check if hidden
                            else {
                                var hi = "ya";
                            }
                        }//No columns match this field/cell
                        else {
                            var hi2 = "ya";
                        }
                    });

                    if (rowbuttons && rowbuttonorientation === "right")
                        rows += rowbuttons;

                    rows += '</tr>';


                });
            }//Check if columns exist


            if (!returnonly) {
                table.append(rows).addClass("table");

                $.each($('.' + settings.id + 'Cell'), function (index, cell) {

                    var cellTop = $(cell).position().top;
                    var editSpan = $($(cell).children()[1]);

                    editSpan.css("top", cellTop + 5).css("position", "absolute").css("border", "1px lightgrey solid").css("border-radius", "3px").css("padding", "3px");

                });
            }

            settings.table = $('<table style="' + tablestyle + '">' + rows + '</table>').addClass("table");

            return settings;
        },
        Refresh: function (gridId, data, jsonFields, jsonColumns, useFieldAndColumnSchema) {

            var result = new Me.Result();

            if (!useFieldAndColumnSchema) {
                jsonFields = {};
                jsonColumns = [];
            }

            var gridResult = Me.Exists(gridId);
            if (gridResult.Success) {

                var grid = gridResult.Grid;

                var gridElement = $("#" + gridId).kendoGrid({
                    height: grid.Height,
                    dataSource: {
                        data: data,
                        schema: {
                            model: {
                                fields: jsonFields
                            }
                        },
                        toolbar: ["create", "save", "cancel"],
                        editable: true
                    },
                    scrollable: true,
                    sortable: true,
                    filterable: true,
                    //pageable: {
                    //    input: true,
                    //    numeric: false
                    //},
                    columns: jsonColumns
                });

                //Post attributes
                $(gridElement).css("overflow-y", "auto");

                //Row click handler
                $(gridElement).on("click", "td", function (e) {      //fire when clicking on a cell in this grid element

                    var row = $(this).closest("tr");                 //associated row for this td (this is clicked td)
                    var rowIdx = $("tr", gridElement).index(row) - 1;//Looking through rows in grid, get index of this row (minus one)
                    var colIdx = $("td", row).index(this);           //Looking through cells in row, get index of this td

                    //alert(rowIdx + '-' + colIdx);
                    if (Me.ClickCellCallback)
                        Me.ClickCellCallback(gridId, row, rowIdx, colIdx);

                    return false;

                });

                if (grid.Editable) {

                    //Add button and click handler
                    var addButtonId = "#" + gridId + "AddButton";

                    if ($(addButtonId).length === 0) {
                        $("#" + gridId).prepend("<input id='" + gridId + "AddButton' type='button' value='Add' style='float:right;' class='" + gridId + "AddButtonStyle GridAddButtonStyle'>");

                        $(addButtonId).click(function (e) {
                            if (Me.AddCallback)
                                Me.AddCallback(gridId, e);
                        });
                    }

                    //Row edit/delete buttons and handlers
                    $.each($("#" + gridId).find("tr"), function (index, row) {

                        if (index === 0) //top row
                        {
                            //$(row).prepend("<td>&nbsp;</td>");
                            //$(row).prepend("<td>&nbsp;</td>");
                        }
                        else if (index > 0) //ignore header row
                        {
                            $($(row)[0].cells[0]).html("<td><input id='" + gridId + "EditButton" + index + "' type='button' value='Edit' class='" + gridId + index + "EditButtonStyle'></td>");
                            $($(row)[0].cells[1]).html("<td><input id='" + gridId + "DeleteButton" + index + "' type='button' value='Delete' class='" + gridId + index + "DeleteButtonStyle'></td>");
                            //$(row).prepend("<td><input id='" + gridId + "EditButton" + index + "' type='button' value='Edit' class='" + gridId + index + "EditButtonStyle'></td>");

                            $("#" + gridId + "EditButton" + index).click(function (e) {
                                //alert('hiya' + index); return false;
                                if (Me.EditCallback)
                                    Me.EditCallback(gridId, index, row, e);

                                return false;

                            });

                            $("#" + gridId + "DeleteButton" + index).click(function (e) {

                                if (Me.DeleteCallback)
                                    Me.DeleteCallback(gridId, index, row, e);

                                return false;

                            });
                        }
                    });

                    ////format button columns
                    ////stopgap to adjust width of button columns. "col" attribute 
                    ////gets put automatically on ALL columns Kendo knows about
                    //$($("#" + gridId).find("col")[1]).css("width", "74px");
                    //$($("#" + gridId).find("col")[3]).css("width", "57px");
                    //$($("#" + gridId).find("col")[4]).css("width", "74px");

                    ////2 colgroup: header and body
                    //$($("#" + gridId).find("colgroup")[0]).prepend("<col style='width:74px;'>");
                    //$($("#" + gridId).find("colgroup")[0]).prepend("<col style='width:57px;'>");
                    //$($("#" + gridId).find("colgroup")[1]).prepend("<col style='width:74px;'>");
                    //$($("#" + gridId).find("colgroup")[1]).prepend("<col style='width:57px;'>");

                    //phase 3: column construction done on server (column json creation)
                }
                else {
                    //Not editable
                    $($($("#" + gridId).find("colgroup")[0]).children()[0]).remove();
                    $($($("#" + gridId).find("colgroup")[1]).children()[0]).remove();
                    $($($("#" + gridId).find("colgroup")[0]).children()[1]).remove();
                    $($($("#" + gridId).find("colgroup")[1]).children()[1]).remove();
                }

                if (Me.RefreshCallback)
                    Me.RefreshCallback(gridId);

                result.Success = true;
            }
            else
                result.Message = gridResult.Message;

            return result;
        },
        Grid: function (gridId) {
            var grid = null;
            var gridResult = Me.Exists(gridId);
            if (gridResult.Success) {
                grid = gridResult.Grid;
            }

            return grid;
        },
        Exists: function (elementId) {

            var result = new Me.Result();

            if ($("#" + elementId) !== null) {
                var existsInCollection = Me.ExistsInCollection(elementId);
                if (existsInCollection.Success) {
                    result.Grid = existsInCollection.Grid;
                    result.Success = true;
                }
                else
                    result.Message = existsInCollection.Message;
            }

            return result;
        },
        ExistsInCollection: function (elementId) {

            var result = new Me.Result();

            var existingDialog = Enumerable.From(Apps.Grids).Where(function (d) { return d.ElementID === elementId }).ToArray();
            if (existingDialog.length === 1) {
                result.Grid = existingDialog[0];
                result.Success = true;
            }
            else if (existingDialog.length === 0)
                result.Message = 'Element "' + elementId + '" is not in Grids collection.';
            else if (existingDialog.length > 1)
                result.Message = 'Element "' + elementId + '" has more than one entry (' + existingDialog.length + ') in Grids collection.';

            return result;
        },
        Result: function () {
            return {
                Success: false,
                Message: '',
                Grid: null
            };
        },
        GridModel: function (newid) {

            var result = {
                ElementID: newid,
                Selector: null,
                Width: '400px',
                Height: '200px',
                X: null,
                Y: null,
                Editable: false,
                SelectedIndex: null, //used to identify zero-based index of row
                SelectedItemID: null //unique id of data in row
            };

            return result;
        }

    };

    Me.Initialize();

    //  window.Grids = Me;
    return Me;

});