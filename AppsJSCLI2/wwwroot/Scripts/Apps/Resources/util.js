define([], function()
{
    var Me = {

        Initialize: function () {
            Me.GetQueryString();
            Me.ApplyStringSearchAndReplaceExtension();
            Me.ApplyObjectFromStringExtension();
            Me.LoadTemplateFiles("");
        },
        Get: function (url, callback) {
            Me.Ajax('GET', url, null, callback, false);
        },
        Post: function (url, callback) {
            Me.Ajax('POST', url, null, callback, false);
        },
        PostWithData: function (url, dataString, callback) {
            Me.Ajax('POST', url, dataString, callback, false);
        },
        Put: function (url, callback, data) {
            Me.Ajax('PUT', url, data, callback, false);
        },
        PutWithData: function (url, dataString, callback) {
            Me.Ajax('PUT', url, dataString, callback, false);
        },
        Delete: function (url, callback)
        {
            Me.Ajax('DELETE', url, null, callback, false);
        },
        Guid: function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);

            });
        },
        Linq: function (coll, where) {
            return Enumerable.From(coll).Where(where).ToArray();
        },
        Linq2: function (obj, where) {
            return Enumerable.From(obj).Where(where).ToArray();
        },

        ApplyToPlaceholder: function (templateId, templatePlaceholderId) {
            if (templatePlaceholderId !== null) {
                if ($("#" + templatePlaceholderId).length === 0) //might already be placed in position manually
                    $(document.forms[0]).append("<div id='" + templatePlaceholderId + "'></div>"); //create placeholder to put html copied from template

                $("#" + templatePlaceholderId).html($("#" + templateId).html()); //put template's html in placeholder
            }
        },

        ApplyObjectFromStringExtension: function ()
        {
            Object.FromString = function (o, s) {
                s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
                s = s.replace(/^\./, '');           // strip a leading dot
                var a = s.split('.');
                for (var i = 0, n = a.length; i < n; ++i) {
                    var k = a[i];
                    if (k in o) {
                        o = o[k];
                    } else {
                        return;
                    }
                }
                return o;
            };

        },
        //Specify
        //1.) HTML file that contains template
        //2.) Template ID inside the file. ID will be then  be available in DOM.
        //3.) ID of element in target document where you want the template html to be placed automatically
        //    (if it hasn't been created yet, will be created and placed at end of document)
        //      (Note: leave null to use template programmatically e.g. search and replace)
        LoadTemplateFiles: function (baseFolder) {

            //$.when(this.ApplyStringSearchAndReplaceExtension())
            //    .then(this.LoadTemplate('templates.html', null, null, this.ApplyTemplate))
            //    .done(function () { });


        },
        //New format: Downloads and appends to body and callback
        LoadTemplate2: function (templateId, templatePath, callback) {

            $.ajax({
                url: templatePath, type: 'get', datatype: 'html', async: true,
                success: function (data) {
                    $(document.body).append(data);
                    if (callback)
                        callback();
                },
                error: function (data) {
                    //callback(true, data, templateId, templatePlaceholderId);
                },
            });

        },
        LoadAndDropTemplate: function(templateId, templatePath, callback, targetId, argsArray)
        {
            Apps.Util.LoadTemplate2(templateId, templatePath, function () {
                Apps.Util.DropTemplate(templateId, targetId, argsArray);
                if (callback)
                    callback();
            });
        },
        LoadTemplate: function (templateFileUrl, templateId, templatePlaceholderId, callback) {

            $.ajax({
                url: templateFileUrl, type: 'get', datatype: 'html', async: false,
                success: function (data) {
                    callback(false, data, templateId, templatePlaceholderId);
                },
                error: function (data) {
                    callback(true, data, templateId, templatePlaceholderId);
                },
            });

        },

        ApplyTemplate: function (error, data, templateId, templatePlaceholderId) {

            if (!error) {

                //Append the template page contents to dom
                $(document.forms[0]).append(data);

                //Will be null if author does not want template placed immediately
                //and intends only to do a SearchAndReplace programmatically
                if (templatePlaceholderId !== null) {
                    if ($("#" + templatePlaceholderId).length === 0) //might already be placed in position manually
                        $(document.forms[0]).append("<div id='" + templatePlaceholderId + "'></div>"); //create placeholder to put html copied from template

                    $("#" + templatePlaceholderId).html($("#" + templateId).html()); //put template's html in placeholder
                }
            }

        },
        //String extension to search and replace
        ApplyStringSearchAndReplaceExtension: function () {

            String.prototype.SearchAndReplace = function () {
                var args = arguments;
                return this.replace(/{(\d+)}/g, function (match, number) {
                    return typeof args[number] !== 'undefined'
                      ? args[number]
                      : match
                    ;
                });
            }
        },
        //EXAMPLE:
        //var content = GetHTML('templateConditions', [index, conditionId, conditionName, "My Title"]);
        GetHTML: function (templateId, argsArray) {
            var content = $("#" + templateId).html();
            if (argsArray) {
                content = content.SearchAndReplace.apply(content, argsArray);
            }
            return content; 
        },
        GetHTMLFromTemplate: function (templateId, templateFilePath, argsArray, callback) {

            Apps.Util.LoadTemplate(templateFilePath, templateId, null, function (error, data, templateId, placeHolder) {
                var args = argsArray;
                if (data.SearchAndReplace && args) {
                    data = data.SearchAndReplace.apply(data, args);
                }
                var foundTemplate = '';
                $.each($(data), function (templateIndex, template) {
                    if ($(template)[0].id === templateId)
                        foundTemplate = $(template).html();
                });
                if (callback)
                    callback(foundTemplate);
            });
        },

        //New format: Binds and returns a DOM template
        BindTemplate: function (templateId, argsArray) {
            var content = $("#" + templateId).html();
            if (argsArray) {
                content = content.SearchAndReplace.apply(content, argsArray);
            }
            return content;
        },
        //New format: Binds, optionally append to a target and returns a DOM template
        DropTemplate: function (templateId, targetElementId, argsArray) {
            var result = null;
            var content = $("#" + templateId).html();
            if(argsArray)
                content = content.SearchAndReplace.apply(content, argsArray);

            //if ($(content).length === 0)
            { //only add if doesn't exist
                if (targetElementId)
                    result = $($("#" + targetElementId).html(content)[0]);
                else
                    result = $(content).appendTo($(document.body));
            }
            return result; //$("#" + targetElementId);
        },
        //Drop here means creating a div from a template
        DropTemplateSelectors: function (template, target, argsArray) {
            var result = target;

            var content = template.html();
            if (argsArray)
                content = content.SearchAndReplace.apply(content, argsArray);

            if (target && target.length === 1)
                target.append(content);
            else
                result = $(content).appendTo($(document.body));

            return $(result);
        },

        //Gets template content
        GetContent: function (templateId, argsArray) {
            var content = $("#" + templateId).html();
            if (argsArray) {
                content = content.SearchAndReplace.apply(content, argsArray);
            }
            return content;
        },
        //Places template content into target element along with any arguments
        AddContent: function (templateId, targetId, argsArray) {
            var templateHTML = $("#" + templateId).html();
            var newContent = templateHTML.SearchAndReplace.apply(templateHTML, argsArray);
            $("#" + targetId).html(newContent);
            return $("#" + targetId);
        },
        AddHTML: function (targetId, content, argsArray)
        {
            var newContent = content.SearchAndReplace.apply(content, argsArray);
            $("#" + targetId).html(newContent);
            return $("#" + targetId);
        },
        CenteredLeft: function(width)
        {
            var screenWidth = $(window).width();
            var centeredWidth = (screenWidth - width) / 2;
            return centeredWidth;
        },
        Ajax: function (verb, url, dataObjString, callback, successCallback, sync) {
            if (verb === null)
                verb = "POST";

            //if (dataObj == null)
            //    dataObj = new Object();

            $.ajax({
                type: verb,
                url: url,
                data: dataObjString,
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                async: !sync,
                success: function (result) {
                    if (callback !== null)
                        callback(false, result, successCallback);
                },
                error: function (result) {
                    if (callback !== null)
                        callback(true, result);
                }
            });

        },

        AjaxP: function (verb, url, dataObjString) {
            return new Promise(function (resolve, reject) {
                $.ajax({
                    type: verb,
                    url: url,
                    data: dataObjString,
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function (result) {

                        // Util.D("ajax to " + url + " success!");

                        var resultObj = result; //.d;

                        if (resultObj.Success) {

                            //Util.D("ajax business rules to " + url + " successs! ");

                            resolve(resultObj);
                        }
                        else {

                            // Util.W("ajax business rules to " + url + " failed. Message: " + resultObj.Message);
                            if (!resultObj.Message)
                                resultObj.Message = 'No message.';

                            //reject(Error(resultObj.Message))
                            reject(resultObj.Message)
                        }
                    },
                    error: function (result) {

                        //Util.W("ajax to " + url + " failed. Message: " + result.responseText);

                        reject(Error(result.responseText));
                    }
                });
            })
        },
        //New format
        LoadScript: function (filename) {
            var fileref = document.createElement('script')
            fileref.setAttribute("type", "text/javascript")
            fileref.setAttribute("src", filename)
            document.getElementsByTagName("head")[0].appendChild(fileref)
        },

        AddScriptReference: function (filename) {
            var fileref = document.createElement('script')
            fileref.setAttribute("type", "text/javascript")
            fileref.setAttribute("src", filename)
            document.getElementsByTagName("head")[0].appendChild(fileref)
        },

        //New format
        LoadStyle: function (filename) {
            var fileref = document.createElement("link")
            fileref.setAttribute("rel", "stylesheet")
            fileref.setAttribute("type", "text/css")
            fileref.setAttribute("href", filename)
            document.getElementsByTagName("head")[0].appendChild(fileref)
        },

        AddStyleReference: function (filename) {
            var fileref = document.createElement("link")
            fileref.setAttribute("rel", "stylesheet")
            fileref.setAttribute("type", "text/css")
            fileref.setAttribute("href", filename)
            document.getElementsByTagName("head")[0].appendChild(fileref)
        },

        QueryString: [],
        RefreshCombobox: function (collection, cboID, selectedValue, selectText, idFieldName, textFieldName, clickcallback) {
            $('#' + cboID).empty();

            $("<option value='-1'>" + selectText + "</option>").appendTo($('#' + cboID));

            $.each(collection, function (index, rtr) {

                var id = eval("rtr." + idFieldName);
                var name = eval("rtr." + textFieldName);

                var option = $("<option value='" + id + "'>" + name + "</option>").appendTo($('#' + cboID));

                if (id === selectedValue) {
                    $(option).prop('selected', 'true');
                }
            });

            if(clickcallback)
                $(document).on("change", "#" + cboID, clickcallback);
        },
        RefreshCombobox2: function (collection, cboID, selectedValue, selectText, idFieldName, textFieldName, returnOptionsCallback) {

            var options = ''; //var select = $('#' + cboID).empty();

            options += "<option value='-1'>" + selectText + "</option>"; //).appendTo($('#' + cboID));

            $.each(collection, function (index, rtr) {

                var id = eval("rtr." + idFieldName);
                var name = eval("rtr." + textFieldName);
                var selected = '';
                if (id === selectedValue) {
                    options += ' selected ';
                }
                options += '<option value="' + id + '"' + selected + '>' + name + '</option>'; //).appendTo($('#' + cboID));

                
            });

            if (returnOptionsCallback)
                returnOptionsCallback(options);

            //if (clickcallback)
            //    clickcallback() //$(document).on("change", "#" + cboID, clickcallback);
        },

        GetQueryString: function () {
            var qs_vars = [], hash;
            var q = document.URL.split('?')[1];
            if (q !== undefined) {
                q = q.split('&');
                for (var i = 0; i < q.length; i++) {
                    hash = q[i].split('=');
                    qs_vars.push(hash[1]);
                    qs_vars[hash[0]] = hash[1];
                }
            }
            Me.QueryString = qs_vars;
            return qs_vars;
        },
        MouseX: 0,
        MouseY: 0,
        IsInt: function (value) {
            return !isNaN(value) && (function (x) { return (x | 0) === x; })(parseFloat(value));
        },

        IsNumber: function (value) {
            return !isNaN(Number(value));
        },
        IsNormalInteger: function (str) {
            var n = Math.floor(Number(str));
            return String(n) === str && n >= 0;
        },
        GetSqlDateTime: function (jsDate) {
            var day = jsDate.getDate();        // yields day
            var month = jsDate.getMonth() + 1;    // yields month
            var year = jsDate.getFullYear();  // yields year
            var hour = jsDate.getHours();     // yields hours 
            var minute = jsDate.getMinutes(); // yields minutes
            var second = jsDate.getSeconds(); // yields seconds
            var time = month + "/" + day + "/" + year + " " + hour + ':' + minute + ':' + second;
            return time;
        },
        Now: function () {
            //2015-10-14T08:12:15.3829654-07:00
            //2015-10-14T8:18:28.893-7:00
            //2015-10-14T08:24:15.192-7:00
            var today = new Date();
            var hh = today.getHours();



            var mn = today.getMinutes();
            var sec = today.getSeconds();
            var mil = today.getMilliseconds();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!
            var yyyy = today.getFullYear();

            if (mn < 10)
                mn = '0' + mn;

            if (sec < 10)
                sec = '0' + sec;

            if (hh < 10)
                hh = '0' + hh;

            if (dd < 10) {
                dd = '0' + dd
            }

            if (mm < 10) {
                mm = '0' + mm
            }

            today = yyyy + '-' + mm + '-' + dd + 'T' + hh + ':' + mn + ':' + sec + '.' + mil + '-07:00';

            return today;
        },
        FormatDateTime: function (dateString) {
            //2015-10-14T08:12:15.3829654-07:00
            //2015-10-14T8:18:28.893-7:00
            //2015-10-14T08:24:15.192-7:00
            var result = "";

            if (dateString !== null) {
                var today = new Date(dateString);
                var hh = today.getHours();

                var mn = today.getMinutes();
                var sec = today.getSeconds();
                var mil = today.getMilliseconds();
                var dd = today.getDate();
                var mm = today.getMonth() + 1; //January is 0!
                var yyyy = today.getFullYear();

                if (mn < 10)
                    mn = '0' + mn;

                if (sec < 10)
                    sec = '0' + sec;

                if (hh < 10)
                    hh = '0' + hh;

                if (dd < 10) {
                    dd = '0' + dd
                }

                if (mm < 10) {
                    mm = '0' + mm
                }

                result = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + mn; // + ':' + sec + '.' + mil + '-07:00';
            }
            return result;
        },
        FormatDateTime2: function (dateString) {
            //2015-10-14T08:12:15.3829654-07:00
            //2015-10-14T8:18:28.893-7:00
            //2015-10-14T08:24:15.192-7:00
            var result = "";

            if (dateString !== null && dateString !== undefined) {
                var today = new Date(dateString);
                var hh = today.getHours();



                var mn = today.getMinutes();
                var sec = today.getSeconds();
                var mil = today.getMilliseconds();
                var dd = today.getDate();
                var mm = today.getMonth() + 1; //January is 0!
                var yyyy = today.getFullYear();

                if (mn < 10)
                    mn = '0' + mn;

                if (sec < 10)
                    sec = '0' + sec;

                if (hh < 10)
                    hh = '0' + hh;

                if (dd < 10) {
                    dd = '0' + dd
                }

                if (mm < 10) {
                    mm = '0' + mm
                }
                var amPM = (hh > 11) ? "PM" : "AM";

                result = mm + '/' + dd + '/' + yyyy + ' ' + hh + ':' + mn + ' ' + amPM; // + ':' + sec + '.' + mil + '-07:00';
            }
            return result;
        },
        FormatDate: function (date) {
            if (date)
                return (date.getMonth() + 1) + "/" + (date.getDate() + 1) + "/" + date.getUTCFullYear();
            else
                return "";
        },
        FormatDatePickerDate: function (date) {
            if (date)
                return date.getUTCFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
            else
                return "";
        },
        Middle: function (selector)
        {
            var result = { left: 0, top: 0 };
            var screenWidth = $(window).width();
            var screenHeight = $(window).height();
            result.left = (screenWidth - selector.width()) / 2;
            result.top = (screenHeight - selector.height()) / 2;

            //selector.css('left', result.left + 'px');
            selector.css('top', result.top + 'px');
            selector.css('position', 'relative');

            return result;
        },
        Center: function (selector) {
            var result = { left: 0, top: 0 };
            var screenWidth = $(window).width();
            var screenHeight = $(window).height();
            result.left = (screenWidth - selector.width()) / 2;
            result.top = (screenHeight - selector.height()) / 2;

            selector.css('left', result.left + 'px');
            //selector.css('top', result.top + 'px');
            selector.css('position', 'relative');

            return result;
        },
        CenterAbsolute: function (selector) {
            var result = { left: 0, top: 0 };
            var screenWidth = $(window).width();
            var screenHeight = $(window).height();
            result.left = (screenWidth - selector.width()) / 2;
            result.top = (screenHeight - selector.height()) / 2;

            selector.css('left', result.left + 'px');
            //selector.css('top', result.top + 'px');
            selector.css('position', 'absolute');

            return result;
        },
        CenterIn: function (parentSelector, childSelector) {
            var tableCreateViewPosition = parentSelector.width();
            var tableButtonsPosition = childSelector.width();
            var newLeft = (tableCreateViewPosition - tableButtonsPosition) / 2;
            childSelector.css('left', newLeft + 'px').css('position', 'relative');
        },

        MiddleAbsolute: function (selector) {
            var result = { left: 0, top: 0 };
            var screenWidth = $(window).width();
            var screenHeight = $(window).height();
           // result.left = (screenWidth - selector.width()) / 2;
            result.top = (screenHeight - selector.height()) / 2;

            //selector.css('left', result.left + 'px');
            selector.css('top', result.top + 'px');
            selector.css('position', 'absolute');

            return result;
        },

        FullHeight: function (selector)
        {
            selector.height($(window).height());

        },
        D:function(msg)
    {
        console.debug(msg);
    },
    W: function (msg) {
        console.warn(msg);
    },
    E:function(msg)
    {
        console.error(msg);
    },

    }

    Me.Initialize();
    return Me;
});


