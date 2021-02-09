//Generic data binding
//Example:
//    <div type="div" data-bind-type="quote" data-bind-property="BusinessDescription"></div>
//
//Looks for attributes "data-bind-type" and
//    1.) Matches the "data-bind-property" attribute to a field on the obj
//    2.) Wires appropriate events (based on attribute "type") and sets the obj properties
//
//Params:
//obj: The object which contains the properties 
//dataBindType: Unique keyword that maps the element to the particular object
//    Note: if an element doesn't have an inherant property "type" one must be added.
//    See below for handled types. They usually equate to the type of element (e.g. "div")

define([], function () {
    var Me = {

        Obj: null,
        ChangedCallback: null,
        BindingCallback: null,
        BoundCallback: null,
        TableBound: null,
        TableRowBound: null,
        Initialize: function (util) {
            Me.Util = util;
        },
        CountDownBind: {
            count: 0,
            check: function () {
                this.count--;
                if (this.count === 0) {
                    this.calculate();
                }
            },
            calculate: function () {
                if (Me.BindingFinished)
                    Me.BindingFinished();
            }
        },
        BindingFinished: null,
        DataBind: function (obj, key, isCollection, callback, changedCallback, boundCallback) {

            Me.Obj = obj;
            var boundElements = $("[data-bind-type='" + key + "']");

            $.each(boundElements, function (index, boundElement) {

                Me.CountDownBind.count++;

                var propertyName = $(boundElement).attr("data-bind-property"); //For now: required
                var propertyCollectionName = $(boundElement).attr("data-bind-collection-property"); //Optional if using collection
                var propertyVisible = $(boundElement).attr("data-bind-property-visible");
                var propertyCollectionVisible = $(boundElement).attr("data-bind-collection-property-visible");
                var propertyValueIsInt = $(boundElement).attr("data-bind-int");

                //Note: "Me.Obj." denotes the binding always takes place with a single object
                //      Collection binding (e.g. "DynamicColumns[n].Property") also denote
                //      an object as root.
                //      What if we want to bind to a collection itself? The notation would be
                //      "[0].Property" and the eval would be "Me.Obj" + propertyName". The
                //      reason we want this is to support both templating and binding: with the
                //      same collection build the html and bind each row. Adding "isCollection" param.

                //var propertyValue = '';
                var collectionIndex = 0;
                //if (propertyCollectionName) {
                //    propertyValue = isCollection ? eval("Me.Obj" + propertyCollectionName) : eval("Me.Obj." + propertyName);
                //    let collectionIndexStart = propertyCollectionName.indexOf('[');
                //    let collectionIndexEnd = propertyCollectionName.indexOf(']');
                //    collectionIndex = propertyCollectionName.substr(collectionIndexStart + 1, collectionIndexEnd - (collectionIndexStart + 1));
                //}
                //else {
                //}
                var propertyValue = eval("Me.Obj." + propertyName);
                var elementType = boundElement.localName; // Apps.$(boundElement).localName; //.prev()[0].nodeName; // Apps.$(boundElement).attr("type");

                ////SET VISIBILITY
                //if (propertyVisible) {
                //    var isVisible = isCollection ? eval("Me.Obj" + propertyCollectionVisible) : eval("Me.Obj." + propertyVisible);
                //    if (isVisible)
                //        Apps.$(boundElement).show();
                //    else
                //        Apps.$(boundElement).hide();
                //}

                //ELEMENT TYPE
                if (elementType.toLowerCase() === "text"
                    || elementType.toLowerCase() === "textarea") {

                    var objCreate = Me.Obj; //Make avail to this scope

                    //SET THE VALUE
                    $(boundElement).val(propertyValue);

                    //WIRE EVENTS
                    $(boundElement).on('change keyup paste', function () {

                        var objWire = objCreate;
                        //isCollection ? eval("objWire" + propertyCollectionName + " = '" + Apps.$(this).val() + "'") : eval("objWire." + propertyName + " = '" + Apps.$(this).val() + "'");
                        eval("objWire." + propertyName + " = '" + $(this).val() + "'");
                        //if (propertyValueIsInt && propertyValueIsInt === true)
                        //    eval("objWire." + propertyName + " = '" + parseInt(Apps.$(this).val()) + "'");
                        //else
                        //    eval("objWire." + propertyName + " = '" + Apps.$(this).val() + "'");

                        if (changedCallback)
                            changedCallback($(boundElement), propertyName, $(this).val(), collectionIndex);
                    });

                    //CLICK EVENT ??
                    //Apps.$(boundElement).on('click', function () {
                    //    this.select();
                    //});
                }
                else if (elementType.toLowerCase() === "div"
                    || elementType.toLowerCase() === "span") {

                    $(boundElement).text(propertyValue);

                    //Note: Non-editable elements' change event must be fired programmatically
                    //(e.g. "Apps.$('element').change()")
                    $(boundElement).on('change', function () {

                        eval("Me.Obj." + propertyName + " = '" + $(this).text() + "'");

                        //if (Me.ChangedCallback)
                        //    Me.ChangedCallback(propertyName, Apps.$(this).text());
                    });
                }
                else if (elementType.toLowerCase() === "select") {
                    var objCreateSelect = Me.Obj; //Make avail to this scope
                    var isIntCreate = propertyValueIsInt;

                    $(boundElement).val(propertyValue);

                    $(boundElement).on('change', function () {

                        var objWire = objCreateSelect;
                        var isIntWire = isIntCreate;

                        if (isIntWire)
                            isCollection ? eval("objWire" + propertyCollectionName + " = " + $(this).val()) : eval("objWire." + propertyName + " = " + parseInt($(this).val()));
                        else
                            isCollection ? eval("objWire" + propertyCollectionName + " = '" + $(this).val() + "'") : eval("objWire." + propertyName + " = '" + $(this).val() + "'");

                        if (changedCallback)
                            changedCallback($(boundElement), propertyName, $(this).val(), collectionIndex);
                    });

                }
                //else if (elementType.toLowerCase() === "checkbox") {

                //    var objCreateCheckbox = Me.Obj; //Make avail to this scope

                //    Apps.$(boundElement).prop("checked", propertyValue);

                //    Apps.$(boundElement).on('change', function () {

                //        var objWire = objCreateCheckbox;

                //        isCollection ? eval("objWire" + propertyCollectionName + " = " + Apps.$(this).prop("checked")) : eval("objWire." + propertyName + " = " + Apps.$(this).prop("checked"));

                //        if (changedCallback)
                //            changedCallback(Apps.$(boundElement), propertyName, Apps.$(this).prop("checked"));

                //    });

                //}
                //Some elements by nature e.g. radio need logic so just let changed event fire
                else if (elementType.toLowerCase() === "input") {

                    if (boundElement.type === 'text') {
                        var objCreate = Me.Obj; //Make avail to this scope

                        //SET THE VALUE
                        $(boundElement).val(propertyValue);

                        //WIRE EVENTS
                        $(boundElement).off().on('change keyup paste', function () {

                            var objWire = objCreate;
                            isCollection ? eval("objWire" + propertyCollectionName + " = '" + $(this).val() + "'") : eval("objWire." + propertyName + " = '" + $(this).val() + "'");

                            //if (propertyValueIsInt && propertyValueIsInt === true)
                            //    eval("objWire." + propertyName + " = '" + parseInt(Apps.$(this).val()) + "'");
                            //else
                            //    eval("objWire." + propertyName + " = '" + Apps.$(this).val() + "'");

                            if (changedCallback)
                                changedCallback($(boundElement), propertyName, $(this).val(), collectionIndex);
                        });

                        //CLICK EVENT ??
                        //Apps.$(boundElement).on('click', function () {
                        //    this.select();
                        //});
                    }
                    else if (boundElement.type === 'checkbox') {

                        var objCreateCheckbox = Me.Obj; //Make avail to this scope

                        $(boundElement).prop("checked", propertyValue);

                        $(boundElement).on('change', function () {

                            var objWire = objCreateCheckbox;

                            isCollection ? eval("objWire" + propertyCollectionName + " = " + $(this).prop("checked")) : eval("objWire." + propertyName + " = " + $(this).prop("checked"));

                            if (changedCallback)
                                changedCallback($(boundElement), propertyName, $(this).prop("checked"), collectionIndex);

                        });

                    }
                    else if (boundElement.type === 'radio') {
                        $(boundElement).change(function () {
                            if (changedCallback)
                                changedCallback($(boundElement), propertyName, $(this).prop("checked"), collectionIndex);
                        });
                    }
                    else if (boundElement.type === 'number') {
                        var objNumber = Me.Obj; //Make avail to this scope
                        $(boundElement).val(propertyValue);
                        $(boundElement).change(function () {
                            var objWire = objNumber;
                            isCollection ? eval("objWire" + propertyCollectionName + " = '" + $(this).val() + "'") : eval("objWire." + propertyName + " = '" + $(this).val() + "'");
                            if (changedCallback)
                                changedCallback($(boundElement), propertyName, $(this).val(), collectionIndex);
                        });
                    }
                }
                else if (elementType.toLowerCase() === "image") {

                    //if (Me.ChangedCallback)
                    //    Me.ChangedCallback(Apps.$(boundElement), propertyName, propertyValue);
                }
                else if (elementType.toLowerCase() === "button") {

                }
                else if (elementType.toLowerCase() === "span") {
                    $(boundElement).text(propertyValue);
                }

                if (Me.BindCallback)
                    Me.BindCallback($(boundElement), propertyName, propertyValue);

                if (callback)
                    callback($(boundElement), propertyName, propertyValue, collectionIndex);

                Me.CountDownBind.check();
            });
        },
        DataBindControls: function (data, bindType, controlsObject) {
            //Binding and validation. 
            Apps.Bind.DataBind(data, bindType, false,
                function (selector, propertyName, boundValue) {
                    //Bound 
                    try {
                        let control = controlsObject[propertyName]; // eval('Me.Controls.' + propertyName);
                        if (control) {
                            control.Selector = selector;
                            control.Data = data;
                            if (control.Defaults) {
                                control.Defaults();
                            }
                            if (control.Cleanse) {
                                control.Cleanse(selector.val()); //Cleanses default value of element
                            }
                            if (control.Bound) {
                                control.Bound(propertyName, boundValue);
                            }
                        }
                        else {
                            Apps.Notify('info', 'Cant find a control for ' + propertyName);
                        }
                    }
                    catch (err) {
                        Apps.Notify('info', 'Need a control for ' + propertyName);
                    }
                },
                function (selector, propertyName, newValue) {
                    //Changed 
                    Me.Validate(bindType, controlsObject);

                    let control = controlsObject[propertyName]; // eval('Me.Controls.' + propertyName);

                    if (control) {
                        if (control.Cleanse) {
                            control.Cleanse(newValue);
                        }
                        if (control.Changed) {
                            control.Changed(propertyName, newValue);
                        }
                    }
                });

        },
        Validate: function (bindType, controlsObject) {
            var result = true;
            Me.IncompleteControlCount = 0;
            Me.PassedControlCount = 0;
            Me.FailedControlCount = 0;

            //Policy
            let elements = $('[data-bind-type="' + bindType + '"]');
            $.each(elements, function (index, el) {
                let prop = $(el).attr('data-bind-property');
                if (prop) {

                    let policyControl = controlsObject[prop]; // eval('Me.Controls.' + prop);
                    if (policyControl) {
                        Me.ValidateControl(policyControl);
                    }
                }
            });

            if (Me.FailedControlCount > 0 || Me.IncompleteControlCount > 0) {
                result = false; //Incomplete would only apply to required fields, all else pass
            }

            return result;
        },
        ValidateControl: function (control) {
            if (control.Validate) {
                let validationState = control.Validate();
                if (validationState == 3) {
                    Me.PassedControlCount++;
                    control.Selector.attr('title', '');
                }
                else if (validationState == 2) {
                    Me.FailedControlCount++;
                    control.Selector.attr('title', control.FailedMessage);
                }
                else if (validationState == 1) {
                    Me.IncompleteControlCount++;
                    control.Selector.attr('title', control.IncompleteMessage);
                }
            }

        },
        DataBindTable: function (settings) {

            var tableId = settings.tableid;

            ////APPEND TABLE
            //if (Apps.$("#" + settings.parentid).find("#" + tableId).length === 0) //Look for existing table in parent
            //{
            //    if (settings.tabletemplateid) {
            //        //Note: Table in template must have same ID as "settings.tableid"
            //        var tableTemplateHtml = Apps.$("#" + settings.tabletemplateid).html();
            //        var tableTemplate = Apps.$(tableTemplateHtml);
            //        if(tableTemplate.length === 1)
            //            Apps.$("#" + settings.parentid).append(tableTemplate[0].outerHTML); //Put on DOM
            //    }
            //}

            //GET AND CLEAR TABLE
            var table = $("#" + tableId); //Get from DOM
            if (table.length === 0) {
                //get parent template, if any
                var parentTemplate = settings.template.Selector;
                if (parentTemplate.length === 1)
                    table = $('<table id="' + settings.tableid + '" class="table"></table>').appendTo(parentTemplate);
            }

            $.each(table.find("tr"), function (index, child) {
                if (index > 0) //Assumption there is a header row
                    $(child).detach();
            });

            //APPEND ROWS
            $.each(settings.data, function (index, row) {

                var rowHtml = '';

                if (settings.rowbinding) //Used if more than index is needed as template param
                    rowHtml = settings.rowbinding(index, settings.rowtemplateid);
                else
                    rowHtml = Apps.Util.GetHTML(settings.rowtemplateid, [index]);

                var newRow = Apps.$(rowHtml).appendTo(table);

                if (settings.rowbound)
                    settings.rowbound(index, newRow, row); //index, row element and row data

                //if (Me.TableRowBound)
                //    Me.TableRowBound(settings.databindkey, rowHtml); 
            });

            //table.find("td").css("padding", "3px"); //Add padding to td

            //BIND
            Me.DataBind(settings.data, settings.databindkey, true);

            if (settings.drag)
                Me.EnableDrag(settings.drag);

            if (settings.tablebound)
                settings.tablebound(table, settings.data);

            ////SHOW
            //if (settings.show)
            //    table.show();
            //else
            //    table.hide();

            return table;
        },
        BindRow: function (row) {
            var rowstring = '';
            rowstring += '<tr>';
            var props = Object.keys(row);

            $.each(props, function (index, prop) {

                rowstring += '<td>' + prop + + '</td>';

            });

            rowstring += '</tr>';
            return rowstring;
        },
        GetTable: function (settings) {

            /*
            Settings:
            tableid: desired id for table
            data: collection of row data items
            databindkey:
            theadbinding: function
            rowbinding:
            rowbound:
            tablebound:
            */
            var tableId = settings.tableid;

            //GET AND CLEAR TABLE
            var table = $('<table id="' + settings.tableid + '" class="table"></table>');

            if (settings.theadbinding) {
                var theadHtml = settings.theadbinding();
                table.append(theadHtml);
            }

            //APPEND ROWS
            $.each(settings.data, function (index, row) {

                var rowHtml = '';

                if (settings.rowbinding)
                    rowHtml = settings.rowbinding(row, index);

                var newRow = $(rowHtml).appendTo(table);

                if (settings.rowbound)
                    settings.rowbound(index, newRow, row);
            });

            //BIND
            Me.DataBind(settings.data, settings.databindkey, true);

            if (settings.drag)
                Me.EnableDrag(settings.drag);

            if (settings.tablebound)
                settings.tablebound(table, settings.data);

            return table;
        },
        EnableDrag: function (drag) {
            var dragCallback = drag.dragged;

            $("." + drag.rowclass).mousedown(function (e) {
                var tr = $(e.target).closest("TR"), si = tr.index(), sy = e.pageY, b = $(document.body), drag;
                if (si === 0) return;
                b.addClass("grabCursor").css("userSelect", "none");
                tr.addClass("grabbed");
                function move(e) {
                    if (!drag && Math.abs(e.pageY - sy) < 10) return;
                    drag = true;
                    tr.siblings().each(function () {
                        var s = $(this), i = s.index(), y = s.offset().top;
                        if (i > 0 && e.pageY >= y && e.pageY < y + s.outerHeight()) {
                            if (i < tr.index())
                                s.insertAfter(tr);
                            else
                                s.insertBefore(tr);
                            return false;
                        }
                    });
                }
                function up(e) {
                    if (drag && si !== tr.index()) {
                        drag = false;
                        //alert("moved!");

                        dragCallback(si, tr);
                    }
                    $(document).unbind("mousemove", move).unbind("mouseup", up);
                    b.removeClass("grabCursor").css("userSelect", "none");
                    tr.removeClass("grabbed");
                }
                $(document).mousemove(move).mouseup(up);
            });

        }
    }
    return Me;
});