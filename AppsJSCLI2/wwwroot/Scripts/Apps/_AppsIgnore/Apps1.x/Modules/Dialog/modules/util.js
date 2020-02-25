define([], function()
{
    var Me = {

        Initialize: function () {
            Me.GetQueryString();
        },
        //Specify
        //1.) HTML file that contains template
        //2.) Template ID inside the file. ID will be then  be available in DOM.
        //3.) ID of element in target document where you want the template html to be placed automatically
        //    (if it hasn't been created yet, will be created and placed at end of document)
        //      (Note: leave null to use template programmatically e.g. search and replace)
        LoadTemplateFiles: function (baseFolder) {

            $.when(this.ApplyFormatExtension())
                .then(this.LoadTemplate(baseFolder + '/templates/editor/ruler.html', 'templateEditorRuler', null, this.ApplyTemplate))
                 .done(function () { });


        },
        LoadTemplateFile: function(templatePagePath, templateId, targetId) //Load a single template from outside (refactor to load ALL from outside)
        {
            $.when(this.ApplyFormatExtension())
                .then(this.LoadTemplate(templatePagePath, templateId, targetId, this.ApplyTemplate))
                 .done(function () { });
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
                if (templatePlaceholderId != null) {
                    if ($("#" + templatePlaceholderId).length == 0) //might already be placed in position manually
                        $(document.forms[0]).append("<div id='" + templatePlaceholderId + "'></div>"); //create placeholder to put html copied from template

                    $("#" + templatePlaceholderId).html($("#" + templateId).html()); //put template's html in placeholder
                }
            }

        },
        //String extension to search and replace
        ApplyFormatExtension: function () {

            String.prototype.SearchAndReplace = function () {
                var args = arguments;
                return this.replace(/{(\d+)}/g, function (match, number) {
                    return typeof args[number] != 'undefined'
                      ? args[number]
                      : match
                    ;
                });
            }
        },
        //Gets template content
        GetContent: function (templateId) {
            return $("#" + templateId).html();
        },
        //Places template content into target element along with any arguments
        //Similar function as ApplyTemplate but allowing a
        AddContent: function (templateId, targetId, argsArray) {
            var templateHTML = $("#" + templateId).html();
            var newContent = templateHTML.SearchAndReplace.apply(templateHTML, argsArray);

            if ($("#" + targetId).length == 0) //create if doesn't exist
                $(document.forms[0]).append("<div id='" + targetId + "'></div>"); //create placeholder to put html copied from template

            $("#" + targetId).html(newContent);

        },

        Ajax: function (verb, url, dataObjString, callback, sync) {
            if (verb == null)
                verb == "POST";

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
                    if (callback != null)
                        callback(false, result);
                },
                error: function (result) {
                    if (callback != null)
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

        AddScriptReference: function (filename) {
            var fileref = document.createElement('script')
            fileref.setAttribute("type", "text/javascript")
            fileref.setAttribute("src", filename)
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

        GetQueryString: function () {
            var qs_vars = [], hash;
            var q = document.URL.split('?')[1];
            if (q != undefined) {
                q = q.split('&');
                for (var i = 0; i < q.length; i++) {
                    hash = q[i].split('=');
                    qs_vars.push(hash[1]);
                    qs_vars[hash[0]] = hash[1];
                }
            }
            Me.QueryString = qs_vars;
            return qs_vars;
        }
    }
    return Me;
});


