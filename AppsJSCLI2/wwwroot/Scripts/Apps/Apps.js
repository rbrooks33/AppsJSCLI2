window.Apps = {
    Components: [],
    UI: [],
    LocalComponentsReady: function () {
        //if (Apps.QueryStrings()['testid']) {


            //Apps.Notify('info', 'Testing MH');

            require([Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/resources/funcunit.js'], function (funcunit) {

                F.speed = 400;

                //let mhLink = $('body > div:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(5)');

                //F(mhLink).click();
                //F('#newquote').click();
                //F('#main2sub0prefix9').visible(function () {
                Apps.Components.Testing.TestProperty();

                //});

                
            });
        //}
    },
    PreInit: function () {

        Apps.Download('https://localhost:44326/Scripts/Apps/AppsDeployments.json', function (response) {
            let deployments = JSON.parse(response);
            Object.values(deployments).some(function (d, index) {
                if (d.Active) {
                    Apps['ActiveDeployment'] = d;
                    return true;
                }
            });
            if (Apps.ActiveDeployment) {
                console.log('active deployment loaded');
                Apps.LoadDeployment();
            }
        });
    },
    LoadDeployment: function () {
        Apps.LoadSettings();

        if (Apps.Ready)
            Apps.Ready();

        Apps.LoadResources(function () {

            console.log('all resources loaded');

            //Set up error dialog
            Apps.Dialogs.Register2('AppsErrorDialog', {
                width: 500,
                height: 300,
                style: 'position:absolute;left:100px;top:100px;',
                title: { color: 'steelblue', text: 'Apps Error' },
                content: '',
                saveclick: function (id) {
                    Apps.Dialogs.Close('AppsErrorDialog');
                },
                cancelclick: function (id) {
                    Apps.Dialogs.Close('AppsErrorDialog');
                }

            });

            Apps.LoadComponentsConfig(function () {

                console.log('components config loaded');
            });
        });
    },
    ApplyStringSearchAndReplaceExtension: function () {

        String.prototype.SearchAndReplace = function () {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] !== 'undefined'
                    ? args[number]
                    : match
                    ;
            });
        };
    },
    LoadSettings() {

        Apps.ApplyStringSearchAndReplaceExtension();

        let deployment = Apps.ActiveDeployment;

        Apps['Settings'] = {};
        Apps.Settings["Version"] = deployment.Version;
        Apps.Settings['WebRoot'] = deployment.WebRoot;
        Apps.Settings['Port'] = deployment.Port;
        Apps.Settings['VirtualFolder'] = deployment.VirtualFolder.length > 0 ? '/' + deployment.VirtualFolder : '';
        Apps.Settings['AppsRoot'] = deployment.AppsRoot;
        Apps.Settings['Debug'] = deployment.Debug;
        Apps.Settings['Required'] = deployment.Required;
        Apps.Settings['UseServer'] = deployment.UseServer;
        Apps.Settings.WebRoot = Apps.Settings.WebRoot + (deployment.Port.length > 0 ? ':' : '') + Apps.Settings.Port + Apps.Settings.VirtualFolder;
        console.log('deployment settings applied');
    },
    LoadResources: function (callback) {

        Apps.Download(Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Resources/resources.json', function (response) {

            Apps.Resources = JSON.parse(response);

            let scriptResources = [];
            let nonScriptResources = [];
            let resourceArray = Object.values(Apps.Resources.Resources);

            for (let x = 0; x < resourceArray.length; x++) {
                if (resourceArray[x].ModuleType === 'script')
                    scriptResources.push(resourceArray[x]);
                else
                    nonScriptResources.push(resourceArray[x]);
            }

            console.log('resources loading begin');

            Apps.LoadScriptResources(scriptResources, function () {

                console.log('script resources loaded');

                Apps.LoadNonScriptResources(nonScriptResources, function () {

                    console.log('non-script resources loaded');
                    if (callback)
                        callback();
                });
            });
        });
    },
    LoadScriptResources: function (scriptResources, callback) {

        //Earlier doing by order but order doesn't mean anything when 
        //all is asynx :)
        let orderedResources = Object.values(scriptResources).sort(function (a, b) {
            return a.Order - b.Order;
        });

        //Instead, pick some to "LoadFirst", order them and load sync and in order
        let loadFirst = orderedResources.filter(function (r) {
            return r.LoadFirst === true;
        });

        loadFirst.forEach(function (r, index) {
            r.Done = false;
        });

        let loadNext = orderedResources.filter(function (r) {
            return r.LoadFirst === false;
        });

        Apps.LoadFirstScripts(loadFirst, function () {

            Object.values(loadNext).forEach(function (r, index) {

                let resourcesFolder = Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Resources';

                Apps.CountDownScriptResources.count++;

                Apps.LoadScript(resourcesFolder + '/' + r.FileName, function () {

                    console.log('Script: loading next ' + r.FileName);

                    Apps.CountDownScriptResources.check();

                });
            });
        });
        Apps.ScriptResourcesReady = callback;

    },
    LoadFirstScripts: function (loadFirsts, callback) {
        //Get first (if any) that have not been loaded
        let notDone = loadFirsts.filter(function (r) {
            return r.Done === false;
        });

        if (notDone.length > 0) {

            notDone[0].Done = true;

            let resourcesFolder = Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Resources';
            let fileName = notDone[0].FileName;
            Apps.LoadScript(resourcesFolder + '/' + fileName, function () {

                console.log('Script: loading first ' + fileName);
                Apps.LoadFirstScripts(loadFirsts, callback);
            });

        }
        else
            if (callback)
                callback();
    },
    LoadNonScriptResources: function (nonScriptResources, callback) {

        let orderedResources = Object.values(nonScriptResources).sort(function (a, b) {
            return a.Order - b.Order;
        });

        Object.values(orderedResources).forEach(function (r, index) {

            let resourcesFolder = Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Resources';

            console.log('Non-Script: loading ' + r.FileName + ' (via ' + r.ModuleType + ')');

            if (r.ModuleType === 'require') {
                Apps.CountDownResources.count++;
                require([resourcesFolder + '/' + r.FileName], function (resource) {

                    if (r.ModuleName) {
                        Apps[r.ModuleName] = resource;

                        if (r.ModuleName === 'JQTE')
                            Apps.JQTE = $.fn.jqte; //Don't try this at home
                    }

                    Apps.CountDownResources.check();
                });
            }
            //else if (r.ModuleType === 'import') {
            //    Apps.CountDownResources.count++;
            //    import(resourcesFolder + '/' + r.FileName)
            //        .then((resource) => {
            //            Apps.CountDownResources.check();
            //        });
            //}
            else if (r.ModuleType === 'require') {
                Apps.CountDownResources.count++;
                require([resourcesFolder + '/' + r.FileName], function (obj) {
                    Apps.CountDownResources.check();
                });
            }
            else if (r.ModuleType === 'script') {
                Apps.CountDownResources.count++;
                Apps.LoadScript(resourcesFolder + '/' + r.FileName, function () {
                    Apps.CountDownResources.check();
                });
            }
            else if (r.ModuleType === 'style') {
                Apps.CountDownResources.count++;
                Apps.LoadStyle(resourcesFolder + '/' + r.FileName, function () {
                    Apps.CountDownResources.check();
                });
            }
        });

        Apps.ResourcesReady = callback;
    },
    LoadComponentsConfig: function (callback) {

        Apps.Components = [];

        if (!Apps.Settings.UseServer) {

            console.log('loading components: auto mode');

            Apps.Download(Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components/components.json', function (response) {

                let components = JSON.parse(response);
                let componentsFolder = Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components';

                Apps.LoadComponents(null, components.Components, componentsFolder);
            });
        }
        //Apps.ComponentsReady = callback; //just for testing, external app needs to wire this up
    },
    LoadComponents: function (parentComponent, components, componentsFolder) {

        Apps.CountDownComponents.count++;

        components.forEach(function (c, index) {

            //if (c.Load && c.ModuleType === 'es6') {

            //    console.log('loading component: ' + c.Name + ' (via ' + c.ModuleType + ')');
            //    Apps.CountDownComponents.count++;
            //    import(componentUrl).then((cObj) => {
            //        Apps.LoadComponent(parentComponent, cObj, c);
            //        Apps.LoadComponents(cObj, c.Components, componentsFolder + '/' + c.Name + '/Components');
            //        Apps.CountDownComponents.check();
            //    });
            //}
            if (c.Load && c.ModuleType === 'require') {

                console.log('loading component: ' + c.Name + ' (via ' + c.ModuleType + ')');

                Apps.CountDownComponents.count++;
                require([componentsFolder + '/' + c.Name + '/' + c.Name + '.js?version=' + Apps.ActiveDeployment.Version], function (cObj) {
                    Apps.LoadComponent(parentComponent, cObj, c);
                    Apps.LoadComponents(cObj, c.Components, componentsFolder + '/' + c.Name + '/Components');
                    Apps.CountDownComponents.check();
                });
            }

        });
        Apps.CountDownComponents.check();
    },
    LoadComponent: function (parentComponent, c, config) {

        if (Object.keys(c).length > 0) {

            if (parentComponent)
                parentComponent[config.Name] = c;
            else
                Apps.Components[config.Name] = c;

            if (typeof c === 'function')
                c = new c();

            if (config.Initialize) {

                console.log('Initializing component ' + config.Name);

                //if (Apps.Components[config.Name])
                //    Apps.Components[config.Name].Initialize();
                c.Initialize();

                if (config.Framework === 'react' && config.AutoTranspile) {

                    var input = JSON.stringify(c); // 'const getMessage = () => "Hello World";';
                    var output = Babel.transform(input, { presets: ['es2015'] }).code;
                    //console.log(output);
                    c = JSON.parse(output); //Put back on coll as js
                }

                //We might not initialize by default any more??
                //Apps.AutoComponents[componentName].Initialize();

            }
        }
        else
            console.log('Component ' + c.Name + ' not anything.');

    },
    LoadStyle: function (filename, callback) {
        var fileref = document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", filename + '?version=' + Apps.ActiveDeployment.Version);
        document.getElementsByTagName("head")[0].appendChild(fileref);

        if (callback)
            callback();
    },
    LoadTemplate: function (name, path, callback) {

        Apps.Download(path + '?version=' + Apps.ActiveDeployment.Version, function (data) {

                Apps.UI[name] = new Apps.Template({ id: name, content: data });
                Apps.UI[name].Load(data);

            if (callback)
                callback();
        });
        //$.ajax({
        //    url: path + '?' + Apps.Settings.Version, type: 'get', datatype: 'html', async: true,
        //    success: function (data) {

        //        Apps.UI[name] = new Apps.Template({ id: name, content: data });
        //        Apps.UI[name].Load(data);

        //        if (callback)
        //            callback(Apps.UI[name]);
        //    }
        //});
    },
    BindTemplate: function (templateId, argsArray) {
        var content = $("#" + templateId).html();
        if (argsArray) {
            content = content.SearchAndReplace.apply(content, argsArray);
        }
        return content;
    },
    LoadScript: function (url, callback) {
        var script = document.createElement('script');
        script.src = url + '?version=' + Apps.ActiveDeployment.Version;
        script.onload = callback;
        document.head.appendChild(script);
    },
    Download: function (path, callback) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                if (callback)
                    callback(this.response);
            }
        };
        xhttp.open('GET', path, true);
        xhttp.send();
    },
    CountDownScriptResources: {
        count: 0,
        check: function () {
            this.count--;
            if (this.count === 0) {
                this.calculate();
            }
        },
        calculate: function () {
            if (Apps.ScriptResourcesReady)
                Apps.ScriptResourcesReady();
        }
    },
    CountDownResources: {
        count: 0,
        check: function () {
            this.count--;
            if (this.count === 0) {
                this.calculate();
            }
        },
        calculate: function () {
            if (Apps.ResourcesReady)
                Apps.ResourcesReady();
        }
    },
    CountDownComponents: {
        count: 0,
        check: function () {
            this.count--;
            if (this.count === 0) {
                this.calculate();
            }
        },
        calculate: function () {

            Apps.LocalComponentsReady();

            if (Apps.ComponentsReady) {
                
                Apps.ComponentsReady();
            }
        }
    },
    Block: function () {
        if ($.isFunction($.blockUI))
            $.blockUI();
    },
    UnBlock: function () {
        if ($.isFunction($.blockUI))
            $.unblockUI();
    },

    Notify: function (type, message, title, position) {

        //Example calls:
        //Info Notification: vNotify.info({ text: 'text', title: 'title' });

        //Success Notification: vNotify.success({ text: 'text', title: 'title' });

        //Warning Notification: vNotify.warning({ text: 'text', title: 'title' });

        //Error Notification: vNotify.error({ text: 'text', title: 'title' });

        //Notify Notification: vNotify.notify({ text: 'text', title: 'title' });

        //Example globals:
        //vNotify.options = {
        //    fadeInDuration: 2000,
        //    fadeOutDuration: 2000,
        //    fadeInterval: 50,
        //    visibleDuration: 5000,
        //    postHoverVisibleDuration: 500,
        //    position: positionOption.topRight,
        //    sticky: false,
        //    showClose: true
        //};

        //var positionOption = {
        //    topLeft: 'topLeft',
        //    topRight: 'topRight',
        //    bottomLeft: 'bottomLeft',
        //    bottomRight: 'bottomRight',
        //    center: 'center'
        //};

        if (vNotify) {

            var delay = 1000;

            if (type === 'warning' || type === 'error')
                visibleDuration = 10000;

            vNotify.options = {
                fadeInDuration: 2000,
                fadeOutDuration: 2000,
                fadeInterval: 50,
                visibleDuration: -1,
                postHoverVisibleDuration: 500,
                position: position ? position : vNotify.positionOption.topRight,
                sticky: true,
                showClose: true
            };

            var messageObject = title ? { text: message, title: title, position: vNotify.options.position } : { text: message, position:vNotify.options.position };
            switch(type){
                case 'info': vNotify.info(messageObject); break;
                case 'success': vNotify.success(messageObject); break;
                case 'warning': vNotify.warning(messageObject); break;
                case 'error': vNotify.error(messageObject); break;
                case 'notify': vNotify.notify(messageObject); break;
            }
        }
        else
            console.log(type + ' notify: ' + message);
    },
    QueryStrings: function () {
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
        //Me.QueryString = qs_vars;
        return qs_vars;
    },
    CreateComponent: function (componentName) {
        var createComponentUrl = Apps.Settings.WebRoot + '/api/appsjs/CreateComponent?appsRoot=/' + Apps.Settings.VirtualFolder + '/Scripts/Apps&componentName=' + componentName;

        Apps.Util.Get(createComponentUrl, function (error, result) {

        });
    },
    CreateComponent2: function (componentName, framework) {
        var createComponentUrl = Apps.Settings.WebRoot + '/api/appsjs/CreateComponent2?appsRoot=/' + Apps.Settings.VirtualFolder + '/Scripts/Apps&componentName=' + componentName + '&framework=' + framework;

        Apps.Util.Get(createComponentUrl, function (error, result) {

        });
    },
    Get: function (url, callback) {
        Apps.Ajax('GET', url, null, callback, false);
    },
    Get2: function (url, callback) {
        Apps.Ajax('GET', url, null, function (error, result) {
            Apps.HandleAjaxResult(error, result, callback);
        }, false);
    },
    Put: function (url, callback, data) {
        Apps.Ajax('PUT', url, data, callback, false);
    },
    Post: function (url, dataString, callback) {
        if (callback)
            Apps.Ajax('POST', url, dataString, callback, false);
    },
    Post2: function (url, dataString, callback) {
        Apps.Ajax('POST', url, dataString, function (error, result) {
            Apps.HandleAjaxResult(error, result, callback);
        }, false);
    },
    HandleAjaxResult: function (error, result, callback) {
        //Handle result
        if (!error) {
            if (result.Success) {
                //Sunny day, all good
                if (callback)
                    callback(result);
            }
            else {
                Apps.Notify('warning', 'A problem happened while trying to doing that. See the error dialog for more information.');
                Apps.Dialogs.Content('AppsErrorDialog', JSON.stringify(result));
                Apps.Dialogs.Open('AppsErrorDialog');
            }
        }
        else {
            Apps.Notify('warning', 'An exception happened while trying to doing that. See the error dialog for more information.');
            Apps.Dialogs.Content('AppsErrorDialog', JSON.stringify(result));
            Apps.Dialogs.Open('AppsErrorDialog');
        }
    },
    Auth: function (url, token, by, callback) {
        $.ajax({
            type: "PUT",
            url: "api/Validate",
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            headers: {
                'Authorization': 'Bearer ' + token,
                'by' : by
            }
        }).done(function () {
            //console.log('PUT success.');
            if (callback)
                callback(false, arguments[0]); //error, result
        }).fail(function () {
            //console.log('Fail on todo PUT');
            if (callback)
                callback(false);
        }).always(function () {
            //refreshViewData();
            //description.val('');
        });
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
            headers: {
                'Authorization': 'Bearer ' + Apps.Token,
                'by': Apps.By
            },
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

    }

};

Apps.Template = function (settings) {

    this.TemplateID = settings.id; // templateId;
    //this.Selector = $("#" + this.TemplateID);
   
    //this.Selector.html(settings.data);
    this.Load = function (content) {

        if (!document.getElementById(this.TemplateID)) {

            let templateNode = document.createElement('div');
            templateNode.id = this.TemplateID;
            templateNode.style.display = "none";
            document.body.appendChild(templateNode); //Put template on dom first

            this.Selector = document.getElementById(this.TemplateID);

            this.Template = document.createElement('script');
            this.Template.id = 'template' + this.TemplateID;
            this.Template.type = "text/template";
            this.Template.innerHTML = content;

            this.Selector.appendChild(this.Template); //Puts template inside div container (not template inner html)
        }
    };

    this.Drop = function (argsArray) {
        //Get template html and drop to dom and reload selector
       // var content = Apps.Util.DropTemplate(this.TemplateID);
        if (!document.getElementById('content' + this.TemplateID)) {

        this.Selector = document.getElementById(this.TemplateID);

        //Gets html from template and puts inside container div (exposing it)
        var content = this.Template.innerHTML; // this.Selector.find('div').html();

        if (argsArray)
            content = content.SearchAndReplace.apply(content, argsArray);


            let contentDiv = document.createElement('div');
            contentDiv.id = 'content' + this.TemplateID;
            contentDiv.classList = this.TemplateID + 'ContentStyle';
            contentDiv.innerHTML = content;

            this.Selector.append(contentDiv);
        }
            

       // if($(content).length === 0)
       // if ($('#' + $(content)[0].id).length === 0)
        //    this.Selector.append(content);
         //   //this.Selector.append(content);

        return this;
    };
    this.Show = function (speed) {

        //Re-check since variable doesn't change when removed from dom
        //this.Selector = $(this.TemplateID);

        //if (this.Selector.length === 0)
            this.Drop(); //Drops the inner template content

       // this.Selector.style.opacity = 0;
        if(this.Selector)
            this.Selector.style.display = 'block';


        return this;
    };
    this.Hide = function (speed) {

        //if (this.Selector.length === 0)
        //    this.Drop();

        //this.Selector.style.display = 'none';
        let mySelector = $('#' + this.TemplateID);
        if (mySelector)
            mySelector.hide(speed); //this.Selector.style.display = 'none';

        return this;
    };
    this.Remove = function () {

        if (this.Selector.length === 1)
            this.Selector.detach();

        return this;
    };
    this.Move = function (top, left) {
        if (this.Selector.length === 0)
            this.Drop();

        this.Selector.css("left", left).css("top", top);

        return this;
    };
    this.Width = function (width) {
        if (this.Selector.length === 0)
            this.Drop();

        this.Selector.width(width);
        return this;
    };
    this.Height = function (height) {
        if (this.Selector.length === 0)
            this.Drop();

        this.Selector.height(height);
        return this;
    };
    this.Css = function (name, value) {
        if (this.Selector.length === 0)
            this.Drop();

        this.Selector.css(name, value);
        return this;
    };
    this.Animate = function (animation) {
        if (this.Selector.length === 0)
            this.Drop();

        this.Selector.animate(animation);
        return this;
    };
    this.Bind = function (data, key, isCollection, callback) {
        if (this.Selector.length === 0)
            this.Drop();

        Apps.Binder.DataBind(data, key, isCollection, callback);
        return this;
    };
    this.BindTable = function (settings) { //data, key, tableid, rowtemplateid, rowbinding, rowbound, tablebound) {

        if (this.Selector.length === 0)
            this.Drop();

        settings.template = this; //access to parent template

        var table = Apps.Binder.DataBindTable(settings);
        $.each($(table).find("td"), function (index, td) {
            $(td).css("padding", "5px");
        });
        //{
        //    databindkey : settings.databindkey,
        //    data: settings.data,
        //    rowtemplateid: settings.rowtemplateid,
        //    tableid: settings.tableid,
        //    rowbinding: settings.rowbinding,
        //    rowbound: settings.rowbound,
        //    tablebound: settings.tablebound
        //})
        return this;
    };
    this.HTML = function (paramArray) {
        if (this.Selector.length === 0)
            this.Drop();

        var currentHtml = $("#" + this.TemplateID).html();
        var newHtml = currentHtml.SearchAndReplace.apply(currentHtml, paramArray);

        this.Selector.html(newHtml);
        return this;
    };
    this.Click = function (sender, args) {

        return this;
    }; //Accepts events from template
    //this.AddContent = function (elementId, content) {

    //    var templateContent = Apps.Util.GetContent('templateCategoriesList');
    //    $('#divCategoryList').html(categories);


    //};
    return this;

};

Apps.PreInit();