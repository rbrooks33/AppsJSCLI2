window.Apps = {
    Components: [],
    UI: [],
    LocalComponentsReady: function () {
        $ = jQuery.noConflict(true); //Allows legacy jquery to continue to be used

    },
    PreInit: function () {

        
        Apps.SetPolyfills();

        Apps['ActiveDeployment'] = {
            "Active": true,
            "Version": new Date().getDate(),
            "WebRoot": location.protocol + "//" + location.hostname,
            "VirtualFolder": "",
            "Port": location.port,
            "AppsRoot": "Scripts/Apps",
            "Debug": false,
            "Test": false,
            "Authenticated": false,
            "AgencyID": null
        };

        //if (location.pathname.toLowerCase().indexOf('default.aspx') > 0) {
        //    Apps.LoadDeployment(function () {
        //        if (Apps.Settings.Debug)
        //            console.log('active deployment loaded (no auth)');
        //    });

        //}
        //else {
        //    Apps.Authenticate(function () {
        //    });
        //}
                Apps.LoadDeployment(function () {
                    if (Apps.Settings.Debug)
                        console.log('active deployment loaded (with auth)');
                });
    },
    Test: function () {
        if (Apps.ActiveDeployment.Test) {
            //if (Apps.Components.Testing)
            //    Apps.Components.Testing.Test(arguments);
           
        }
    },
    LoadUtil: function (callback) {
        require([Apps.Settings.WebRoot + '/Scripts/Apps/Resources/util.js'], function (util) {
            Apps.Util = util;
            callback();
        });

    },
    Authenticate: function (callback) {

        let webRoot = Apps.ActiveDeployment.WebRoot;
        let port = Apps.ActiveDeployment.Port.length > 0 ? ':' + Apps.ActiveDeployment.Port : '';
        let virtualFolder = Apps.ActiveDeployment.VirtualFolder.length > 0 ? '/' + Apps.ActiveDeployment.VirtualFolder : '';
        let hostUrl = webRoot + port + virtualFolder;

        Apps.WebServiceXML(hostUrl + '/api/admin/Authenticate', function (resultString) {

            let result = JSON.parse(resultString);
            let authenticationData = result.Data; //Type of Models.Common.AuthenticationData

            sessionStorage.setItem('AuthenticationData', JSON.stringify(authenticationData));

            Apps.ActiveDeployment.Debug = result.Data.Debug;
            Apps.ActiveDeployment.Version = result.Data.Version;
            Apps.Features = authenticationData.Features; //Checked in Controls

            if (callback)
                callback(authenticationData);
        });
    },
    GetAuthenticationData: function () {
        return JSON.parse(sessionStorage.getItem('AuthenticationData'));
    },
    LoadDeployment: function (callback) {
        Apps.LoadSettings();

        if (Apps.Ready)
            Apps.Ready();


        Apps.LoadResources(function () {

            if (Apps.Settings.Debug)
                console.log('all resources loaded');

            Apps.LoadComponentsConfig(function () {

                if (Apps.Settings.Debug)
                    console.log('components config loaded');

                ////Set up error dialog
                Apps.Components.Common.Dialogs.Register('AppsErrorDialog', {
                    title: 'Exception',
                    size: 'full-width',
                    templateid: 'templateMyDialog1',
                    saveclick: function (id) {
                        Apps.Dialogs.Close('AppsErrorDialog');
                    },
                    cancelclick: function (id) {
                        Apps.Dialogs.Close('AppsErrorDialog');
                    }
                });
                if (callback)
                    callback()

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
    LoadSettings: function () {

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
        if (Apps.Settings.Debug)
            console.log('deployment settings applied');
    },
    LoadResources: function (callback) {

        Apps.Download(Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Resources/resources.js?version=' + Apps.Settings.Version, function (response) {

            Apps.Resources = JSON.parse(response);

            var scriptResources = [];
            var nonScriptResources = [];
            var resourceArray = Apps.Resources.Resources; //Object.values(Apps.Resources.Resources);

            for (let x = 0; x < resourceArray.length; x++) {
                if (resourceArray[x].Enabled) {
                    if (resourceArray[x].ModuleType === 'script')
                        scriptResources.push(resourceArray[x]);
                    else
                        nonScriptResources.push(resourceArray[x]);
                }
            }


            if (Apps.Settings.Debug)
                console.log('resources loading begin');

            Apps.LoadScriptResources(scriptResources, function () {

                ///var allNonScriptResources = nonScriptResources;
                Apps.LoadUtil(function () { //After require, before components. non-optimal
                    //Apps.LoadResizer(function () {

                    if (Apps.Settings.Debug)
                        console.log('script resources loaded');

                    let styleResources = nonScriptResources.filter(function (ns) {
                        return ns.ModuleType === 'style';
                    });

                    Apps.LoadStyleResources(styleResources);

                    let nonStyleResources = nonScriptResources.filter(function (ns) {
                        return ns.ModuleType !== 'style';
                    });

                    if (nonStyleResources.length > 0) {
                        Apps.LoadNonScriptResources(nonStyleResources, function () {

                            if (Apps.Settings.Debug)
                                console.log('non-script resources loaded');
                            if (callback)
                                callback();
                        });
                    }
                    else {
                        if (callback)
                            callback();
                    }
                });
                //});
            });
        });
    },

    LoadScriptResources: function (scriptResources, callback) {

        //Earlier doing by order but order doesn't mean anything when 
        //all is asynx :)
        //let orderedResources = Object.values(scriptResources).sort(function (a, b) {
        //    return a.Order - b.Order;
        //});

        //let orderedResources = Apps.Values(scriptResources);

        //Instead, pick some to "LoadFirst", order them and load sync and in order
        let loadFirst = Apps.Filter(scriptResources, function (item, index, fullArray) {
            return item.LoadFirst === true;
        });

        //loadFirst.forEach(function (r, index) {
        //    r.Done = false;
        //});

        for (var firstIndex = 0; firstIndex < loadFirst.length; firstIndex++) {
            loadFirst[firstIndex].Done = false;
        }

        //let loadNext = orderedResources.filter(function (r) {
        //    return r.LoadFirst === false;
        //});

        let loadNext = Apps.Filter(scriptResources, function (item, index, fullArray) {
            return item.LoadFirst === false;
        });

        Apps.LoadFirstScripts(loadFirst, function () {

            loadNext.forEach(function (r, index) {

                let resourcesFolder = Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Resources';

                Apps.CountDownScriptResources.count++;

                Apps.LoadScript(resourcesFolder + '/' + r.FileName + '?version=' + Apps.Settings.Version, function () {

                    if (Apps.Settings.Debug)
                        console.log('Script: loading next ' + r.FileName);

                    Apps.CountDownScriptResources.check();

                });
            });
        });
        Apps.ScriptResourcesReady = callback;

    },
    Values: function (obj) {
        //var obj = { foo: 'bar', baz: 42 };
        var result = null;
        var values = Object.keys(obj).map(function (e) {
            result = obj[e]; //return obj[e]
        });
        return result;
    },
    Filter: function (myArray, callBack) {
        let newArray = [];
        for (let i = 0; i < myArray.length; i++) {
            let result = callBack(myArray[i], i, myArray);
            if (result) {
                newArray.push(myArray[i]);
            }
        }
        return newArray;
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
            Apps.LoadScript(resourcesFolder + '/' + fileName + '?version=' + Apps.Settings.Version, function () {

                if (Apps.Settings.Debug)
                    console.log('Script: loading first ' + fileName);
                Apps.LoadFirstScripts(loadFirsts, callback);
            });

        }
        else
            if (callback)
                callback();
    },
    LoadStyleResources: function (styleResources) {

        var resourcesFolder = Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Resources';
        //Style loads sync, do first
        styleResources.forEach(function (s, index) {
            if (Apps.Settings.Debug)
                console.debug('Loading style ' + s.Name);
            Apps.LoadStyle(resourcesFolder + '/' + s.FileName + '?version=' + Apps.Settings.Version);
        });
        if (Apps.Settings.Debug)
            console.debug("All styles loaded.");
    },
    LoadNonScriptResources: function (nonScriptResources, callback) {

        var resourcesFolder = Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Resources';

        Apps.NonScriptResourcesReady = callback;

        let orderedResources = nonScriptResources.sort(function (a, b) {
            return a.Order - b.Order;
        });

        orderedResources.forEach(function (r, index) {

            if (Apps.Settings.Debug)
                console.log('Non-Script: loading ' + r.FileName + ' (via ' + r.ModuleType + ')');

            if (r.Enabled) {
                if (r.ModuleType === 'require') {
                    Apps.CountDownNonScriptResources.count++;
                    require([resourcesFolder + '/' + r.FileName + '?version=' + Apps.Settings.Version], function (resource) {

                        if (r.ModuleName) {
                            Apps[r.ModuleName] = resource;

                            if (r.ModuleName === 'JQTE')
                                Apps.JQTE = $.fn.jqte; //Don't try this at home
                        }

                        Apps.CountDownNonScriptResources.check();
                    });
                }
                //else if (r.ModuleType === 'import') {
                //    Apps.CountDownResources.count++;
                //    import(resourcesFolder + '/' + r.FileName)
                //        .then((resource) => {
                //            Apps.CountDownResources.check();
                //        });
                //}
                //else if (r.ModuleType === 'require') {
                //    Apps.CountDownResources.count++;
                //    require([resourcesFolder + '/' + r.FileName], function (obj) {
                //        Apps.CountDownResources.check();
                //    });
                //}
                else if (r.ModuleType === 'script') {
                    Apps.CountDownNonScriptResources.count++;
                    Apps.LoadScript(resourcesFolder + '/' + r.FileName + '?version=' + Apps.Settings.Version, function () {
                        Apps.CountDownNonScriptResources.check();
                    });
                }
                //else if (r.ModuleType === 'style') {
                //    Apps.CountDownNonScriptResources.count++;
                //    Apps.LoadStyle(resourcesFolder + '/' + r.FileName + '?version=' + Apps.Settings.Version, function () {
                //        Apps.CountDownNonScriptResources.check();
                //    });
                //}
            }
        });


    },
    LoadComponentsConfig: function (callback) {

        Apps.Components = [];

        if (!Apps.Settings.UseServer) {

            if (Apps.Settings.Debug)
                console.log('loading components: auto mode');

            Apps.Download(Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components/components.js?version=' + Apps.Settings.Version, function (response) {

                var components = JSON.parse(response);
                let componentsFolder = Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components';

                //if (Apps.ActiveDeployment.Test) {
                //    components.Components.push({
                //        "Name": "Testing",
                //        "Version": null,
                //        "Description": null,
                //        "ComponentFolder": null,
                //        "TemplateFolder": null,
                //        "Load": true,
                //        "Initialize": true,
                //        "Color": "blue",
                //        "ModuleType": "require",
                //        "Framework": "default",
                //        "Components": [],
                //        "IsOnDisk": false
                //    });
                //}

                Apps.LoadComponents(null, components.Components, componentsFolder);
            });
        }
        //Apps.ComponentsReady = callback; //just for testing, external app needs to wire this up
    },
    LoadComponents: function (parentComponent, components, componentsFolder) {

        Apps.CountDownComponents.count++;

        if (components) {
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

                //Make require moduletype default (rb 3/12/2021)
                if (c.Load && (c.ModuleType === 'require' || c.ModuleType == null)) {

                    if (Apps.Settings.Debug)
                        console.log('loading component: ' + c.Name + ' (via ' + c.ModuleType + ')');

                    Apps.CountDownComponents.count++;
                    require([componentsFolder + '/' + c.Name + '/' + c.Name + '.js?version=' + Apps.Settings.Version], function (cObj) {
                        Apps.LoadComponent(parentComponent, cObj, c);
                        Apps.LoadComponents(cObj, c.Components, componentsFolder + '/' + c.Name); // + '/Components');
                        Apps.CountDownComponents.check();
                    });
                }

            });
        }
        Apps.CountDownComponents.check();
    },
    LoadComponent: function (parentComponent, c, config) {

        if (Object.keys(c).length > 0) {

            if (parentComponent) {
                //Not top (e.g. "Apps.Components.TopComponent.*")
                parentComponent[config.Name] = c;
                c['Parent'] = parentComponent;
                c['Path'] = c.Parent.Path + '/' + config.Name;
            }
            else {
                //Top level (e.g. "Apps.Components.*")
                Apps.Components[config.Name] = c;
                c['Path'] = Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components/' + config.Name;
            }

            if (typeof c === 'function')
                c = new c();

            if (config.Initialize) {

                console.log('running intitialize of ' + config.Name);

                //Added "UI" config (rb 3/12/2021)
                if (config.UI && config.UI === true) {

                    Apps.LoadUI(config.Name, c, function () {

                        c.Initialize();

                        //if (config.Framework === 'react' && config.AutoTranspile) {

                        //    var input = JSON.stringify(c); // 'const getMessage = () => "Hello World";';
                        //    var output = Babel.transform(input, { presets: ['es2015'] }).code;
                        //    //console.log(output);
                        //    c = JSON.parse(output); //Put back on coll as js
                        //}

                        //We might not initialize by default any more??
                        //Apps.AutoComponents[componentName].Initialize();
                    });
                }
                else {
                    c.Initialize();
                }
            }
        }
        else
            if (Apps.Settings.Debug)
                console.log('Component ' + c.Name + ' not anything.');

    },
    LoadUI: function (configName, component, callback) {
        if (!component['UI']) {

            Apps.Download(component.Path + '/' + configName + '.html?version=' + Apps.ActiveDeployment.Version, function (data) {

                component['UI'] = new Apps.Template({ id: configName, content: data });
                component['UI'].Load(data);

                Apps.LoadStyle(component.Path + '/' + configName + '.css?version=' + Apps.ActiveDeployment.Version)

                if (callback)
                    callback();
            });
        }
        else {
            if (callback)
                callback();
        }
    },
    LoadStyle: function (filename) {
        var fileref = document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", filename + '?version=' + Apps.ActiveDeployment.Version);
        document.getElementsByTagName("head")[0].appendChild(fileref);
    },
    //LoadTemplate: function (name, path, callback) {

    //    if (!Apps.UI[name]) {
    //        Apps.Download(path + '?version=' + Apps.ActiveDeployment.Version, function (data) {

    //            Apps.UI[name] = new Apps.Template({ id: name, content: data });
    //            Apps.UI[name].Load(data);

    //            if (callback)
    //                callback();
    //        });
    //    }
    //    else {
    //        if (callback)
    //            callback();
    //    }
    //    //$.ajax({
    //    //    url: path + '?' + Apps.Settings.Version, type: 'get', datatype: 'html', async: true,
    //    //    success: function (data) {

    //    //        Apps.UI[name] = new Apps.Template({ id: name, content: data });
    //    //        Apps.UI[name].Load(data);

    //    //        if (callback)
    //    //            callback(Apps.UI[name]);
    //    //    }
    //    //});
    //},
    //LoadTemplateAndStyle: function (componentName, callback) {
    //    let componentRoot = Apps.Settings.WebRoot + '/Scripts/Apps/Components/' + componentName + '/' + componentName;
    //    Apps.LoadTemplate(componentName, componentRoot + '.html?ver=' + Apps.Settings.Version, function () {
    //        Apps.LoadStyle(componentRoot + '.css?ver=' + Apps.Settings.Version);

    //        if (callback)
    //            callback();
    //    });
    //},
    LoadComponentTemplate: function (component, templateName, templateId, argsArray) {
        //Assumptions: Template file is dropped

        let html = Apps.Util.GetHTML(templateId, argsArray);

        if (!component.UI)
            component['UI'] = {};

        component.UI[templateName] = new Apps.Template({ id: templateName, content: html });
        component.UI[templateName].Load(html);
    },
    //BindTemplate: function (templateId, argsArray) {
    //    var content = $("#" + templateId).html();
    //    if (argsArray) {
    //        content = content.SearchAndReplace.apply(content, argsArray);
    //    }
    //    return content;
    //},
    //Drops all template tags contained in a given file on body (does not check for already loaded)
    DropTemplateFile: function (path, callback) {
        Apps.Download(path + '?version=' + Apps.ActiveDeployment.Version, function (content) {
            //drop all templates in this file, if not already
            $.each($(content), function (index, el) {
                if (!document.getElementById(el.id)) {
                    document.body.appendChild(el);
                }
            });
            if (callback)
                callback();
        });
    },
    //Loads script-tagged template from disk (once) and applies data
    BindTemplate: function (templateId, path, argsArray, callback) {
        var content = '';

        //Download if template not already dropped on page
        if (!document.getElementById(templateId)) {

            Apps.Download(path + '?version=' + Apps.ActiveDeployment.Version, function (content) {

                //drop all templates in this file, if not already
                $.each($(content), function (index, el) {
                    if (!document.getElementById(el.id)) {
                        document.body.appendChild(el);
                    }
                });

                //get bound content for this particular template
                content = $("#" + templateId).html();

                if (argsArray) {
                    content = content.SearchAndReplace.apply(content, argsArray);
                    if (callback)
                        callback(content);
                }
                else {
                    if (callback)
                        callback(content);
                }

            });
        }
        else {
            //get bound content for this particular template
            content = $("#" + templateId).html();

            if (argsArray) {
                content = content.SearchAndReplace.apply(content, argsArray);
                if (callback)
                    callback(content);
            }
            else {
                if (callback)
                    callback(content);
            }

        }
    },
    LoadScript: function (url, callback, fileNameId) {

        if (!document.getElementById(fileNameId)) {
            var script = document.createElement('script');
            script.src = url + '?version=' + Apps.ActiveDeployment.Version;
            if (fileNameId)
                script.id = fileNameId;
            script.onload = callback;
            document.head.appendChild(script);
        }
        else
            callback();
    },
    Download: function (path, callback) {
        try {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    if (callback)
                        callback(this.response);
                }
            };
            xhttp.open('GET', path, true);
            xhttp.send();
        }
        catch (err) {
            console.log('Unable to download ' + path + '. Component files are optional.');
        }
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
    CountDownNonScriptResources: {
        count: 0,
        check: function () {
            this.count--;
            if (this.count === 0) {
                this.calculate();
            }
        },
        calculate: function () {
            if (Apps.NonScriptResourcesReady)
                Apps.NonScriptResourcesReady();
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

                if (Apps.ActiveDeployment.Debug)
                    Apps.Notify('warning', 'Debug configuration is enabled.');
                if (Apps.ActiveDeployment.Test) {
                    Apps.Notify('warning', 'Test mode is enabled. Running tests...');

                    require(['/Scripts/Apps/Resources/funcunit.js'], function (funcunit) {

                        require(['/Scripts/Apps/Resources/qunit.js'], function (qunit) {

                            QUnit.config.autostart = false;

                            F.speed = 400;
                            //    //Edit/save App
                            Apps.TestComponents();
                            //    Me.Edit(2);

                        });
                    });

                }
            }
        }
    },
    TestComponents: function () {
        let componentNames = Object.keys(Apps.Components);
        $.each(componentNames, function (index, componentName) {
            Apps.TestComponent(Apps.Components[componentName]);
        });
    },
    TestComponent: function (c) {
        if (c.Test) {
            c.Test();
            if (c.Components) {
                $.each(c.Components, function (index, component) {
                    Apps.TestComponent(component);
                });
            }
        }
    },
    BlockUI: function (settings) {
        if ($.isFunction($.blockUI)) {
            if (settings) {
                $.blockUI(settings);
            }
            else {
                $.blockUI();
            }
        }
    },
    UnBlockUI: function () {
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

            var messageObject = title ? { text: message, title: title, position: vNotify.options.position } : { text: message, position: vNotify.options.position };
            switch (type) {
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
    PostSync: function (url, dataString, callback) {
        Apps.Ajax('POST', url, dataString, function (error, result) {
            Apps.HandleAjaxResult(error, result, callback);
        }, null, true);

        //$.ajax({
        //    type: 'POST',
        //    url: url,
        //    data: dataString,
        //    contentType: 'application/json; charset=utf-8',
        //    dataType: 'json',
        //    async: false,
        //    success: function (result) {
        //        if (callback)
        //            callback(false, result);
        //    },
        //    error: function (result) {
        //        if (callback)
        //            callback(true, result);
        //    }
        //});
    },
    WebService: function (wsUrl, data, callback) {
        $.ajax({
            type: 'POST',
            url: wsUrl, //Apps.Settings.WebRoot + '/DriversLicenseWebService.asmx/ValidateDriversLicense',
            data: data, // "{ driversLicense: '" + licenseNumber + "' }",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                Apps.HandleAjaxResult(false, data.d, callback);
            },
            error: function (data) {
                Apps.HandleAjaxResult(true, data.d, callback);
            }
        });

    },
    WebServiceXML: function (path, callback) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                if (callback)
                    callback(this.response);
            }
        };
        xhttp.open('POST', path, true);
        xhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        xhttp.send();
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

                //Check if want to send a custom message along with failure
                if (!result.ShowFailMessage) {

                    vNotify.error({ text: 'A problem ocurred on the server.', title: 'Server Error', sticky: false, showClose: true });
                    let textDiv = $('body > div.vnotify-container.vn-top-right > div > div.vnotify-text');
                    textDiv.append('<div class="btn btn-dark" style="margin-top:10px;" onclick="Apps.Components.Helpers.OpenResponse(\'' + escape(JSON.stringify(result)) + '\');">View Response</div>');
                }
                else {
                    Apps.Notify('warning', result.FailMessage);
                }

                if (callback)
                    callback(result);
            }
        }
        else {
            //Apps.Notify('error', 'An exception happened during the last operation. Response: ' + responseText); //esult.inn. See the error dialog and logs for more information.');

            //if (Apps.Settings.Debug) {
            //    Apps.Components.Helpers.Dialogs.Content('AppsErrorDialog', JSON.stringify(result));
            //    Apps.Components.Helpers.Dialogs.Open('AppsErrorDialog');
            //}
            vNotify.error({ text: 'A problem ocurred on the server.', title: 'Server Error', sticky: false, showClose: true });
            let textDiv = $('body > div.vnotify-container.vn-top-right > div > div.vnotify-text');
            textDiv.append('<div class="btn btn-dark" style="margin-top:10px;" onclick="Apps.Components.Helpers.OpenResponse(\'' + escape(JSON.stringify(result)) + '\');">View Response</div>');

            if (callback)
                callback(result);
        }
    },
    ShowMessages: function (result) {
        if (result && result.Messages) {
            //$.each(result.SucMessages, function (index, message) {
            //    Apps.Notify('warning', message);
            //});
            $.each(result.FailMessages, function (index, failMessage) {
                vNotify.error({ text: failMessage, title: 'Fail Message', sticky: true, showClose: true });
            });
        }
        else {
            Apps.Notify('info', 'No messages available for failed call.');
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
                'by': by
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
                if (callback)
                    callback(false, result, successCallback);
            },
            error: function (result) {
                if (callback)
                    callback(true, result);
            }
        });

    },
    SetPolyfills: function () {
        if (!Object.keys) {
            Object.keys = (function () {
                var hasOwnProperty = Object.prototype.hasOwnProperty,
                    hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
                    dontEnums = [
                        'toString',
                        'toLocaleString',
                        'valueOf',
                        'hasOwnProperty',
                        'isPrototypeOf',
                        'propertyIsEnumerable',
                        'constructor'
                    ],
                    dontEnumsLength = dontEnums.length;

                return function (obj) {
                    if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) throw new TypeError('Object.keys called on non-object');

                    var result = [];

                    for (var prop in obj) {
                        if (hasOwnProperty.call(obj, prop)) result.push(prop);
                    }

                    if (hasDontEnumBug) {
                        for (var i = 0; i < dontEnumsLength; i++) {
                            if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i]);
                        }
                    }
                    return result;
                };
            })();
        }
    }

};
Apps.Data = {
/*
 For every GET, creates an object with
 1. A Path property holding the path used
 2. A Data  property holding the resulting data
 3. A Refresh() method to call and refresh data when needed

Instructions
1. Create a new method for every data object, providing optional
parameters and optional callback.

2. In the method call "Me.Set([hard-coded url], function(data))"
Note that "Set" handles errors and will not call back but
instead show notifications.

3. Optionally clean up the data returned and optionally call back
 */

    //Apps.Data.Register('App', '/api/Apps/GetApp?appId={0}')
    //Apps.Data.Load('App', function () {
    //Apps.Data.App.Refresh();
    //Apps.Data.App.Selected = selectedApp; //For collections

    Selected: null,

    Gets: [],
    Posts: [],
    RegisterGET: function (dataName, url) {

        this.Gets.push({ DataName: dataName, URL: url, Args: null });

        Apps.Data[dataName] = {
            Success: false,
            Path: url,
            Data: null,
            Refresh: function (args, callback) {

                let newPath = this.Path.SearchAndReplace.apply(Apps.Data[dataName].Path, args);

                Apps.Get(newPath, function (error, result) {

                    if (!error) {
                        Apps.Data[dataName].Success = !error && result.Success;
                        Apps.Data[dataName].Data = result.Data;
                    }
                    else
                        Apps.Data.HandleException(result);

                    Apps.Data[dataName].Result = result;

                    if (callback)
                        callback();

                });
            }
        };

    },
    RegisterPOST: function (dataName, url, args) {
        this.Posts.push({ DataName: dataName, URL: url, Args: args });
    },
    Post: function (dataName, obj, callback) {

        let mycallback = callback;
        let dataSources = Enumerable.From(this.Posts).Where('$.DataName == "' + dataName + '"').ToArray();

        if (dataSources.length == 1) {

            Apps.Post(dataSources[0].URL, JSON.stringify(obj), function (error, result) {
                if (!error) {
                    if (result.Success) {
                        if (mycallback)
                            mycallback();
                    }
                    else {
                        Apps.ShowMessages(result);
                        if (mycallback)
                            mycallback();
                    }
                }
                else {
                    Apps.Data.HandleException(result);
                }
            });
        }
        else
            Apps.Notify('warning', 'Data source name not found or more than one found: ' + dataName);
 
    },
    HandleException: function (result) {
        if (result) {
            if (result.responseText && result.responseText.length > 50) {
                Apps.Notify('error', 'From server: ' + result.responseText.substring(0, 50));
                //vNotify.error({ text: 'text', title: 'title', sticky: true, showClose: true });
            }
            else if (result.responseText) {
                Apps.Notify('error', 'From server: ' + result.responseText);
            }
        }
        else {
            Apps.Notify('error', 'Unable to contact web server.');
        }
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

            if (this.Template) {
                //Gets html from template and puts inside container div (exposing it)
                var content = this.Template.innerHTML; // this.Selector.find('div').html();

                if (argsArray)
                    content = content.SearchAndReplace.apply(content, argsArray);


                let contentDiv = document.createElement('div');
                contentDiv.id = 'content' + this.TemplateID;
                contentDiv.classList = this.TemplateID + 'ContentStyle';
                contentDiv.innerHTML = content;

                this.Selector.appendChild(contentDiv);
            }
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
        if (this.Selector)
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