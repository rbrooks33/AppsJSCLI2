define([], function () {

    //Represents a block of HTML content, almost a mini-web application.
    //Data for a template is arbitrary and according to whats needed: Binding is a custom event.
    //Main and sub-templates are loaded to page

    var Me = {
        ID: null,
        Templates: [],
        Initialize: function(util, binder)
        {
            Me.Util = util;
            Me.Binder = binder;

            //RESIZE EACH TEMPLATE (IF CONFIGURED FOR RESIZE)
            $(window).resize(function () {
                if (Me.Templates) {
                    $.each(Me.Templates, function (index, template) {
                        Me.Resize(template.ElementID);
                    });
                }
            });
        },
        Register: function(util, settings)
        {
            if (settings) {

                var exists = Me.Exists(settings.id);
                if (!exists.Success) {

                    //create dialog object
                    var newTemplate = new Me.TemplateModel(settings.id);

                    Me.Util = util;
                    /*
        
                     Example: Register({
                        id: 'Columns',
                        style: '',
                        parentelement: null, 
                        templates: [
                            { page: 'templates.html', id: 'templateColumns', data: DynamicColumns, style: '' }, 
                            { page: 'templates.html', id: 'templateColumn', data: DynamicColumns, style: '' }
                        ]
                     });
        
                     Notes:
                     1.) If no parentelement, templates go in form[0]
                     2.) "Template" method returns main template selector: Templates.Template("Columns").show();
        
                     */
                    Me.ID = settings.id;

                    //Put template in a single div
                    var style = '';
                    var parent = null;

                    if (settings.style)
                        style = settings.style;

                    var mainDiv = $('<div id="' + Me.ID + '" style="' + style + '">').appendTo($(document.forms[0]));

                    $.each(settings.templates, function (index, template) {

                        Me.LoadTemplate(mainDiv, template);

                    });

                    if (settings.parentid) {
                        if ($("#" + settings.parentid).length === 0) {
                            //IF DOESNT EXIST CREATE AND PUT IN ROOT
                            $(window.forms[0]).append($('<div id="' + settings.parentid + '">')); //.appendTo(mainDiv);
                        }
                        else
                            $("#" + settings.parentid).append(mainDiv);
                    }

                    //SAVE TEMPLATE TO MEMORY
                    newTemplate.Selector = mainDiv;
                    newTemplate.ElementID = settings.id;
                    newTemplate.OnLoad = settings.onload;
                    newTemplate.OnResize = settings.onresize;
                    newTemplate.OnRefresh = settings.onrefresh;
                    newTemplate.OnShow = settings.onshow;
                    newTemplate.OnHide = settings.onhide;
                    newTemplate.ParentID = settings.parentid;
                    newTemplate.Style = settings.style;

                    Me.Templates.push(newTemplate);

                    if (settings.onload)
                        settings.onload();

                    mainDiv.hide();
                }
            }
        },
        Template: function(id)
        {
            return $("#" + id);
        },
        Load: function(mainId, templateId)
        {
            var html = $("#" + templateId).html();

            var newDiv = $('<div id="' + mainId + '_' + templateId + '">' + html + '</div>')
                .appendTo($("#" + mainId));
            return newDiv;
        },
        Show: function(id)
        {
            var exists = Me.Exists(id);
            if (exists.Success) {
                if (exists.Template.OnShow)
                    exists.Template.OnShow();
            }
        },
        Hide: function (id) {
            var exists = Me.Exists(id);
            if (exists.Success) {
                if (exists.Template.OnHide)
                    exists.Template.OnHide();
            }
        },
        Resize: function (id) {
            var exists = Me.Exists(id);
            if (exists.Success) {
                if (exists.Template.OnResize)
                    exists.Template.OnResize();
            }
        },
        Refresh: function (id)
        {
            var exists = Me.Exists(id);
            if (exists.Success) {
                if(exists.Template.OnRefresh)
                    exists.Template.OnRefresh();
            }
        },
        DOM: function(templateid, parentid, rootid, argsArray)
        {
            //GET HTML
            var html = $("#" + templateid).html();
            var parent = null;

            if (argsArray && argsArray.length > 0)
                html = html.SearchAndReplace.apply(html, argsArray);

            //ADD PARENT TO ROOT, ADD TEMPLATE HTML TO PARENT
            if ($("#" + parentid).length === 0) {
                //IF DOESNT EXIST CREATE AND PUT IN ROOT
                parent = $('<div id="' + parentid + '">').appendTo($("#" + rootid));
                parent.append(html);
            }
            else {
                $("#" + parentid).empty();
                $("#" + parentid).append(html);
                parent = $("#" + parentid);
            }
            return parent;
        },
        LoadTemplate: function (rootDiv, template) {

            $.ajax({
                url: template.page, type: 'get', datatype: 'html', async: false,
                success: function (data) {

                    var fileHtml = $(data); //Becomes an array of objects (comments, templates etc.) inside page
                    var templateElement = Enumerable.From(fileHtml).Where(function (f) { return f.id === template.id; }).ToArray();

                    if (templateElement.length === 1)
                    {
                        var newDiv = '';

                        rootDiv.append(templateElement); //Always put template inside main div

                        if (template.dom) {

                            //GET HTML
                            var html = ''
                            if (template.templatebind)
                                html = templatebind(template.id)

                            //CREATE DOM ELEMENT
                            newDiv = $('<div id="' + Me.ID + '_' + template.id + '">' + $(templateElement[0]).html() + '</div>')
                                .appendTo(rootDiv);

                            //ADD TO SPECIFIC PARENT
                            if (template.parentid) {

                                if ($("#" + template.parentid).length === 0)
                                {
                                    //IF DOESNT EXIST CREATE AND PUT IN ROOT
                                    var parentDiv = $('<div id="' + template.parentid + '">').appendTo(rootDiv);
                                    parentDiv.append(newDiv);
                                }
                                else
                                    $("#" + template.parentid).append(newDiv);
                            }

                            //SHOW/HIDE //Note: let's leave this logic to implementation
                            if (template.show)
                                $(newDiv).show();
                            else
                                $(newDiv).hide();
                        }

                        $(document.forms[0]).append(rootDiv);
                    }
                    //var templateHtml = fileHtml.find("#" + templateId);
                    //$(document.forms[0]).append('<div id="' + Me.ID + '_' + templateId + '">' + data + '</div>');
                },
                error: function (data) {
                    //callback(true, data, templateId, templatePlaceholderId);
                },
            });

        },
        Exists: function (elementId) {

            var result = new Me.Result();

            if ($("#" + elementId) != null) {
                var existsInCollection = Me.ExistsInCollection(elementId);
                if (existsInCollection.Success) {
                    result.Template = existsInCollection.Template;
                    result.Success = true;
                }
                else
                    result.Message = existsInCollection.Message;
            }

            return result;
        },
        ExistsInCollection: function (elementId) {

            var result = new Me.Result();

            var existingDialog = Enumerable.From(Me.Templates).Where(function (d) { return d.ElementID == elementId }).ToArray();
            if (existingDialog.length == 1) {
                result.Template = existingDialog[0];
                result.Success = true;
            }
            else if (existingDialog.length == 0)
                result.Message = 'Element "' + elementId + '" is not in Templates collection.';
            else if (existingDialog.length > 1)
                result.Message = 'Element "' + elementId + '" has more than one entry (' + existingDialog.length + ') in Dialogs collection.';

            return result;
        },
        Result: function () {
            return {
                Success: false,
                Message: '',
                Template: null
            };
        },
        TemplateModel: function (newid) {

            var result = {
                ElementID: newid,
                Selector: null,
                Style: '',
                ParentID: null,
                OnLoad: null,
                OnResize: null,
                OnRefresh: null,
                OnShow: null,
                OnHide: null
            };

            return result;
        }

    }
    return Me;
})