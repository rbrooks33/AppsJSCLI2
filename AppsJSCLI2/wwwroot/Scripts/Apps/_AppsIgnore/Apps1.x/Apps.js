window.Apps = {
    Required: '',
    Settings: null,
    UtilReady: false,
    ComponentsReady: null,
    Ready: false,
    Error: false,
    ErrorLogs: [],
    CustomComponents: {},
    AutoComponents: {},
    UI: {},
    Data: {},
    Pages: {},
    Logs: {},
    Deployments: null,
    MyDeployments: null,
    PreInit: function () {

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {

                let deployments = JSON.parse(this.response);

                for (let deploymentIndex = 0; deploymentIndex < deployments.length; deploymentIndex++) {

                    if (deployments[deploymentIndex].Active) {

                        Apps['ActiveDeployment'] = deployments[deploymentIndex];

                        Apps.ApplySettings(Apps.ActiveDeployment, Apps.ActiveDeployment.Version);
                        Apps.LoadComponents(true, true);

                    }
                }
            }
        };
        xhttp.open('GET', '/Scripts/Apps/AppsDeployments.json', true);
        xhttp.send();
        //fetch('/Scripts/Apps/AppsDeployments.json')
        //    .then(response => response.json())
        //    .then(jsonResponse => {

        //        let deployments = jsonResponse.Deployments;

        //        for (let deploymentIndex = 0; deploymentIndex < deployments.length; deploymentIndex++) {

        //            if (deployments[deploymentIndex].Active) {

        //                Apps['ActiveDeployment'] = deployments[deploymentIndex];

        //                Apps.ApplySettings(Apps.ActiveDeployment, Apps.ActiveDeployment.Version);
        //                Apps.LoadComponents(true, true);

        //            }
        //        }
        //    });
    },
    ApplySettings(deployment, version) {

        Apps['Settings'] = {};

        Apps.Settings["Version"] = version;
        Apps.Settings['WebRoot'] = deployment.WebRoot; // Apps.Config.WebRoot;
        Apps.Settings['Port'] = deployment.Port; //.length > 0 ? ':' + deployment.Port : '';
        Apps.Settings['VirtualFolder'] = deployment.VirtualFolder.length > 0 ? '/' + deployment.VirtualFolder : ''; // deployment.VirtualFolder;
        Apps.Settings['AppsRoot'] = deployment.AppsRoot; // Apps.Config.DevAppsRoot;
        Apps.Settings['Debug'] = deployment.Debug; // Apps.Config.Debug;
        Apps.Settings['Required'] = deployment.Required; // 'jquery, require, linq, bootstrap, blockui, dialogs, grids, jqte, notify, binder';

        Apps.Settings.WebRoot = Apps.Settings.WebRoot + (deployment.Port.length > 0 ? ':' : '') + Apps.Settings.Port + Apps.Settings.VirtualFolder;

        Apps.GetQueryString();
    },
    LoadComponents: function (loadDefault, loadCustom) {

        if (loadDefault) {
            Apps.LoadDefaultComponents(Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot, function () {

                //if (Apps.ActiveDeployment === 'default') {
                    if (Apps.Ready)
                        Apps.Ready();

                    if (loadCustom)
                        Apps.LoadAutoComponents();
                //}
            });
        }
    }, QueryString: [],
    GetQueryString: function () {
        var qs_vars = [], hash;
        var q = document.URL.split('?')[1];
        if (q !== undefined) {
            q = q.split('&');
            for (var i = 0; i < q.length; i++) {
                hash = q[i].split('=');
                qs_vars.push(hash[1]);
                qs_vars[hash[0].toLowerCase()] = hash[1]; //this implementation forces lowercase
            }
        }
        Apps.QueryString = qs_vars;
        return qs_vars;
    },
    LoadDefaultComponents: function (webroot, callback) {

        switch (Apps.ActiveDeployment.Framework) {

            case 'default':

                Apps.RegisterJQueryRemote(webroot, function () {
                    Apps.RegisterRequireRemote(webroot, function () {
                        Apps.RegisterUtilRemote(webroot, function () {
                            Apps.RegisterLinqRemote(webroot, function () {
                                Apps.RegisterDialogsRemote(webroot, function () {
                                    Apps.RegisterBinderRemote(webroot, function () {
                                        Apps.RegisterDebugRemote(webroot, function () {
                                            Apps.RegisterBootstrapRemote(webroot, function () {
                                                Apps.RegisterGridsRemote(webroot, function () {
                                                    Apps.RegisterJQTERemote(webroot, function () {
                                                        Apps.RegisterBlockUIRemote(webroot, function () {
                                                            Apps.RegisterNotifyRemote(webroot, function () {
                                                                Apps.RegisterDateTimePickerRemote(webroot, function () {

                                                                    if (callback)
                                                                        callback();
                                                                });
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
                break;

            case 'react':

                Apps.LoadDefaultComponents2(webroot, function () {

                    Apps.LoadAutoComponents();

                });

                break;

            case 'vanilla':

                break;
        }
    },
    LoadDefaultComponents2: function (webroot) {

        //Util
        import(webroot + '/Templates/Vanilla/References/util.js')
            .then((util) => {
                Apps.Util = util.Util;
                Apps.UtilReady = true;
            })
            .then(() => {

                ////Debug
                //if (Apps.Settings.Debug) {
                //    import(webroot + '/Debug/debug.js')
                //        .then((debug) => {

                //            Apps.Debug = debug.Debug;
                //            Apps.Debug.Initialize(Apps);
                //            Apps.Debug.BuildBar();

                //        });
                //}

                //Require
                if (Apps.ActiveDeployment.Required.indexOf('require') > -1) {
                    Apps.LoadScript(webroot + '/Templates/Vanilla/References/require.js', function () {
                        console.log('Require js loaded.');

                        //For now, linqjs required for dialogs
                        Apps.RegisterLinqRemote(webroot, function () {

                            //For now, dialogs requires require
                            Apps.RegisterDialogsRemote(webroot, function () {
                                console.log('Dialogs is loaded.');

                                //For now, debug requires require
                                Apps.RegisterDebugRemote(webroot, function () {
                                    console.log('Debug is loaded.');
                                });
                            });
                        });
                    });
                }

                //LinqJS
                import(webroot + '/Templates/Vanilla/References/linq.js');

                //JQuery and libraries
                if (Apps.ActiveDeployment.Required.indexOf('jquery') > -1) {

                    Apps.LoadScript(webroot + '/Templates/Vanilla/References/jquery.js', function () {

                        //Bootstrap
                        let doBoostrap = Apps.ActiveDeployment.Required.indexOf('bootstrap ') > -1;
                        Apps.LoadDefaultScript(doBoostrap, webroot + '/Templates/Vanilla/References/bootstrap.min.js', function () {

                            if (doBoostrap)
                                Apps.LoadStyle(webroot + '/Templates/Vanilla/References/bootstrap.min.css');

                            let doBootstrap4 = Apps.ActiveDeployment.Required.indexOf('bootstrap4') > -1;
                            //Bootstrap4
                            Apps.LoadDefaultScript(doBootstrap4, webroot + '/Templates/Vanilla/References/bootstrap4.min.js', function () {

                                if (doBootstrap4)
                                    Apps.LoadStyle(webroot + '/Templates/Vanilla/References/bootstrap4.min.css');

                                let doJQTE = Apps.ActiveDeployment.Required.indexOf('jqte') > -1;

                                //JQTE
                                Apps.LoadDefaultScript(doJQTE, webroot + '/Templates/Vanilla/References/jquery-te-1.4.0.min.js', function () {

                                    if (doJQTE)
                                        Apps.LoadStyle(webroot + '/Templates/Vanilla/References/jquery-te-1.4.0.css');

                                    //BlockUI
                                    Apps.LoadDefaultScript(Apps.ActiveDeployment.Required.indexOf('blockui') > -1, webroot + '/Templates/Vanilla/References/jquery.blockui.js', function () {

                                        //Notify
                                        if (Apps.ActiveDeployment.Required.indexOf('notify') > -1) {
                                            import(webroot + '/Templates/Vanilla/References/notify.js')
                                                .then((notify) => {

                                                    if (Apps.Ready)
                                                        Apps.Ready();

                                                    Apps.LoadAutoComponentsReact();

                                                });
                                        }
                                    });
                                });
                            });
                        });
                    });

                }
            });

    },
    LoadDefaultScript: function (criteria, path, callback) {

        if (criteria) {
            Apps.LoadScript(path, callback);
        }
        else {
            if (callback)
                callback();
        }
    },

    LoadCustomComponents: function (settings) {

        if (settings) {

            if (settings.customcomponents || settings.customtemplates || settings.customdata || settings.customstyles) {            

                if (settings.customcomponents)
                    Apps.RegisterModules(settings.customcomponents);

                if (settings.customtemplates)
                    Apps.RegisterTemplates(settings.customtemplates);

                if (settings.customdata)
                    Apps.RegisterData(settings.customdata);

                if (settings.customstyles)
                    Apps.RegisterStyles(settings.customstyles);
            }

            //Data
            if (Apps.Data) {
                Apps.Debug.BuildData();
            }
            //Pages
            if (Apps.Pages) {
                Apps.Debug.BuildPages();
            }
            ////LOGS
            //if (Apps.Logs) {
            //    Apps.Debug.Build('Logs', 'logs', Apps.Logs);
            //}
        }
        else {
            //no settings
            //ready
        }
    },
    RegisterModules: function (modules) {
        $.each(modules, function (index, module) {
            Apps.CountDownModules.count++;
            require([module.path], function (mymodule) {
                Apps.CustomComponents[module.name] = mymodule;
                Apps.CountDownModules.check();
            });
        });
    },
    RegisterTemplates: function (templates) {
        $.each(templates, function (index, template) {
            Apps.LoadTemplate(template.name, template.path, function () {
            });

        });
    },
    RegisterData: function (data) {
        //Apps.Logs['Data'] = [];
        $.each(data, function (index, datum) {
            Apps.CountDownData.count++;
            Apps.Util.Get(datum.path, function (error, result) {

               // Apps.Debug.HandleError2(error || result.Success === false, "Problem loading data. Click for details.", JSON.stringify(result), "Projects loaded.", function () {

                    Apps.RefreshData(datum, result);
                    Apps.CountDownData.check();

                //});
            });
        });
    },
    RefreshData: function (datum, result, callback) {
        if (datum.dataobjectname)
            Apps.Data[datum.name] = result[datum.dataobjectname];
        else
            Apps.Data[datum.name] = result;

        if (Apps.Data[datum.name]) {
            Apps.Data[datum.name].Refresh = function (callback) {
                Apps.Util.Get(datum.path, function (error, refreshresult) {
                    //if (datum.dataobjectname)
                    //    Apps.Data[datum.name] = result[datum.dataobjectname];
                    //else
                    //    Apps.Data[datum.name] = result;
                    Apps.RefreshData(datum, refreshresult);

                    if (callback)
                        callback();
                });
            };
        }
        if (callback)
            callback();
    },
    RegisterStyles: function (styles) {
        $.each(styles, function (styleIndex, style) {
            
            Apps.LoadStyle(style.path, function () {
                
            });

        });
    },
    LoadStyle: function (filename, callback) {
        var fileref = document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", filename + '?' + Apps.Settings.Version);
        document.getElementsByTagName("head")[0].appendChild(fileref);

        if (callback)
            callback();
    },
    LoadScript: function (url, callback) {
        var script = document.createElement('script');
        script.src = url;
        script.onload = callback;
        document.head.appendChild(script);
    },
    LoadScript2: function (url, callback) {

        var fileExists = false;

        //TODO: was eliminating duplicate references (caused by implicitly referencing for remote components)
        //however this causes dependent libraries (such as blockui and notify) to fail after require registration
        //maybe because the version of require that was loaded is not on the same domain? not sure. Living with
        //duplicate references for now.

        //if (window.jQuery !== undefined) {
        //    var fileName = url.split('/')[url.split('/').length - 1];
        //    var file = $('script[src$="' + fileName + '"]');
        //    if (file.length > 0)
        //        fileExists = true;
        //}

        if (!fileExists) {
            Apps.LoadScript(url, function (error, result) {
                if (callback)
                    callback();
            });

        }
        else {
            if (callback)
                callback();
        }

    },
    //puts on namespace, calls load which puts on dom and puts html on page 
    LoadTemplate: function (name, path, callback) {

        $.ajax({
            url: path + '?' + Apps.Settings.Version, type: 'get', datatype: 'html', async: true,
            success: function (data) {
                
                Apps.UI[name] = new Apps.Template({ id: name, content: data });
                Apps.UI[name].Load(data);

                if (callback)
                    callback(Apps.UI[name]);
            }
        });

    },
    //Pulls HTML from a page and creates an "Apps.UI.[name]" object, which can be Show[n] etc.
    LoadPage: function (name, path, callback) {

        $.ajax({
            url: path, type: 'get', datatype: 'html', async: false,
            success: function (data) {
                //$(document.forms[0]).append(data);
                Apps.UI[name] = new Apps.Template({ id: name, content: data });
                Apps.UI[name].Load(data);

                if (callback)
                    callback(Apps.UI[name]);
            }
        });

    },
    CountDownModules: {
        count: 0,
        check: function () {
            this.count--;
            if (this.count === 0) {
                this.calculate();
            }
        },
        calculate: function () {
            if (Apps.CustomComponentsReady)
                Apps.CustomComponentsReady();
        }
    },
    CountDownData: {
        count: 0,
        check: function () {
            this.count--;
            if (this.count === 0) {
                this.calculate();
            }
        },
        calculate: function () {

            //Build bar (data and schema visualizer)
                if (Apps.Data) {
                    Apps.Debug.BuildData();
            }

            //If user set up a callback
            if (Apps.DataReady) {


                //Pages
                Apps.DataReady();
            }
        }
    },
    CountDownPages: {
        count: 0,
        check: function () {
            this.count--;
            if (this.count === 0) {
                this.calculate();
            }
        },
        calculate: function () {
            if (Apps.PagesReady)
                Apps.PagesReady();
        }
    },
    LoadAutoComponents: function () {

        Apps.CountDownComponents.count++;

        Apps.Util.Get(Apps.Settings.WebRoot + '/api/AppsJS/GetAutoComponentFolders?webRoot=' + Apps.Settings.VirtualFolder, function (error, result) {

            if (!error && result.Success) {

                $.each(result.Data, function (componentIndex, componentName) {

                        Apps.CountDownComponents.count++;

                        var componentUrl = Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/AutoComponents/' + componentName + '/' + componentName + '.js?version=' + Apps.Settings.Version;

                        require([componentUrl], function (component) {

                            Apps.AutoComponents[componentName] = component;

                            if (Apps.AutoComponents[componentName].Enabled) {

                                Apps.AutoComponents[componentName].Initialize(Apps);
                            }

                            Apps.CountDownComponents.check();

                        });
                });

                Apps.CountDownComponents.check();
            }
        });


    },
    LoadAutoComponentsReact: function () {

        Apps.CountDownComponents.count++;

        Apps.Util.Get(Apps.Settings.WebRoot + '/api/AppsJS/GetAutoComponentFolders?webRoot=' + Apps.Settings.VirtualFolder, function (error, result) {

            if (!error && result.Success) {

                $.each(result.Data, function (componentIndex, componentName) {

                    Apps.CountDownComponents.count++;

                    var componentUrl = Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/AutoComponents/' + componentName + '/' + componentName + '.js?version=' + Apps.Settings.Version;

                    console.log('loading ' + componentName);

                    import(componentUrl).then((component) => {

                        if (Object.keys(component).length > 0) {

                            let c = component[componentName]; //.Component;

                            Apps.AutoComponents[componentName] = c;

                            if (typeof c === 'function')
                                c = new c();

                            if (c.Enabled) {

                                if (c.Framework === 'react' && c.AutoTranspile) {

                                    var input = JSON.stringify(c); // 'const getMessage = () => "Hello World";';
                                    var output = Babel.transform(input, { presets: ['es2015'] }).code;
                                    //console.log(output);
                                    c = JSON.parse(output); //Put back on coll as js
                                }

                                //We might not initialize by default any more??
                                //Apps.AutoComponents[componentName].Initialize();

                            }
                        }

                        Apps.CountDownComponents.check();

                    });
                });

                Apps.CountDownComponents.check();
            }
        });
    },
    AutoTranspile: function () {
        var pages = Object.values(Apps.AutoComponents);
        $.each(pages, function (index, c) {

            if (typeof c === 'function')
                c = new c();

            if (c.Framework === 'react' && c.AutoTranspile) {

                var input = JSON.stringify(c); // 'const getMessage = () => "Hello World";';
                var output = Babel.transform(input, { presets: ['es2015'] }).code;
                console.log(output);

            }
        });
    },
    UnloadUI: function()
    {
        if (Apps.UI) {
            $.each(Apps.UI, function (uiIndex, ui) {
                ui.Remove();
            });
        }
    },
    ReloadUI: function()
    {
        Apps.UnloadUI();
        Apps.RegisterRemoteComponents2();
    },
    RegisterRemoteComponents: function (webroot, virtualFolder, appsroot)
    {

        ////TODO: when we allow designing of components we'll put them in an internal config (maybe under components folder)
        ////      Then, here we'll add them to the externally-created components so they'll get registered along side

        Apps.CountDownComponents.count++;

        Apps.Util.Get(webroot + '/api/GetComponentFolders?webRoot=' + virtualFolder, function (error, result) {

            if (!error && result.Success) {
                $.each(result.Data, function (componentIndex, componentName) {

                    if (Apps.Required.includes(componentName.toLowerCase())) {

                        Apps.CountDownComponents.count++;

                        var componentUrl = webroot + '/' + virtualFolder + '/' + appsroot + '/Components/' + componentName + '/' + componentName + '.js';

                        require([componentUrl], function (component) {

                            var componentRoot = webroot + '/' + virtualFolder + '/' + appsroot + '/Components/' + componentName;

                            Apps.Components[componentName] = component;


                            if (Apps.Components[componentName].Enabled) {

                                //load any dependencies
                                Apps.CountDownComponents.count++;
                                require([webroot + '/' + virtualFolder + '/' + appsroot + "/modules/Tabstrip/tabstrip.js"], function (tabstrips) {
                                    Apps.Tabstrips = tabstrips;

                                    Apps.Components[componentName].Initialize(webroot + '/' + virtualFolder, appsroot, componentRoot);

                                    Apps.CountDownComponents.check();
                                });

                            }

                            Apps.CountDownComponents.check();

                        });
                    }
                });

                Apps.CountDownComponents.check();
            }
        });
        
        //var scriptme = $('script[src^="' + myappsroot + '/Apps/apps.js"]');
        //if (scriptme.length === 1) {

        //    var url = scriptme.attr("src").split("?");
        //    if (url.length > 1) {

        //        var remotemodules = url[1].split("&");

        //        //register remote components (url params: [official hosted component name]=[my key])
        //        Apps.RegisterRequireRemote(function (myappsroot) {

        //            Apps.RegisterUtilRemote(function (myappsroot) {
        //                $.each(remotemodules, function (index, mod) {

        //                    var module = mod.split("=");

        //                    if (module[0] === "Tiles") {
        //                        require([myappsroot + '/Apps/Components/Tile/tiles.js'], function (tiles) {
        //                            Apps.Components[module[1]] = tiles;
        //                            Apps.Components[module[1]].Bind({ key: module[1] });
        //                        });

        //                    }
        //                });
        //            });
        //        });

        //    }
        //}
    },
    RegisterComponents: function () {


    },
    RegisterComponent: function (componentName, callback) {

        require([Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components/' + componentName + '/' + componentName + '.js'], function (component) {

            Apps.Components[componentName] = component;

            if (Apps.Components[componentName].Enabled) {

                Apps.Components[componentName].Initialize();

                if (callback)
                    callback();
            }
        });
    },

    RegisterRemoteComponent: function (componentName, componentRoot, callback) {
        //var componentUrl = webroot + '/' + virtualFolder + '/' + appsroot + '/Components/' + componentName + '/' + componentName + '.js';
        //Convention is component js file is same name as component
        var componentUrl = '/Components/' + componentName + '.js';

        if (componentRoot)
            componentUrl = componentRoot + '/' + componentName + '.js';

        require([componentUrl], function (component) {

            Apps.Components[componentName] = component;

            if (Apps.Components[componentName].Enabled) {

                Apps.Components[componentName].Initialize();

                if (callback)
                    callback();
            }
        });
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

            if (Apps.AutoComponentsReady)
                Apps.AutoComponentsReady();

            if(Apps.ReloadComponentsReady)
                Apps.ReloadComponentsReady();
        }
    },


    RegisterRequireRemote: function(webroot, callback)
    {
        //if (Apps.Required.includes('require'))
        {
            Apps.LoadScript2(webroot + '/references/require.js', function (result, error) {

                //jQuery.noConflict(true);

                //require.config({
                //    packages: [{
                //        name: 'moment',
                //        // This location is relative to baseUrl. Choose bower_components
                //        // or node_modules, depending on how moment was installed.
                //        location: Apps.Settings.WebRoot + '/references/moment.js',
                //        main: 'moment'
                //    }]
                //});

                if (callback)
                    callback();
            });
        }
        //else
        //    if (callback)
        //        callback();
    },
    RegisterUtilRemote: function(webroot, callback)
    {
        //if (Apps.Required.includes('util'))
        {
            require([webroot + '/modules/util.js'], function (util) {
                Apps.Util = util;
                Apps.UtilReady = true;
                if (callback)
                    callback();
            });
        }
        //else
        //    if (callback)
        //        callback();
    },
    RegisterJQueryRemote: function (webroot, callback) {
        //if (Apps.Required.includes('jquery'))
        //{
            Apps.LoadScript2(webroot + '/references/jquery.js', function (result, error) {


                if (callback)
                    callback();
            });
        //}
        //else
        //    if (callback)
        //        callback();
    },
    RegisterBinderRemote: function (webroot, callback) {
        if (Apps.Settings.Required.includes('binder')) {

            require([webroot + "/modules/bind.js"], function (binder) {

                Apps.Binder = binder;
                if (callback)
                    callback();
            });


        }
        else
            if (callback)
                callback();
    },

    RegisterNotifyRemote: function (webroot, callback) {
        if (Apps.Settings.Required.includes('notify')) {
           // require([webroot + '/references/moment.js'], function (moment) {
 //           Apps.LoadScript2(webroot + '/references/moment.js', function (result, error) {
             //Apps.LoadScript2(webroot + '/references/notify.min.js', function () {
            //require([webroot + '/references/notify.min.js'], function (moment) {
            require([webroot + '/references/bootstrap-notify.min.js'], function (moment) {
                    if (callback)
                        callback();

   //             });
            });
        }
        else
            if (callback)
                callback();
    },
    //RegisterBootstrapRemote: function (webroot, callback) {
    //    if (Apps.Settings.Required.includes('bootstrap')) {

    //        Apps.LoadScript2(webroot + "/references/bootstrap.min.js", function () {

    //            Apps.LoadStyle(webroot + "/references/bootstrap.min.css");

    //            //Apps.LoadScript2(webroot + '/references/notify.min.js', function () {  });
    //            ////require([webroot + "/references/notify.js"], function (notify) {

    //            //    Apps.Notify = notify;
    //            //});

    //                if (callback)
    //                    callback();


    //        });
    //    }
    //    else {
    //        if (callback)
    //            callback();
    //    }
    //},
    RegisterBootstrapRemote: function (webroot, callback) {
        if (Apps.Settings.Required.includes('bootstrap4')) {
            Apps.LoadScript2(webroot + "/references/popper.js", function () {

                Apps.LoadStyle(webroot + "/references/bootstrap4.min.css");

                //bootstrap4 dropdowns require popper...jeez
                Apps.LoadScript2(webroot + '/references/bootstrap4.min.js', function () {

                    if (callback)
                        callback();
                });
            });
        }
        else if (Apps.Settings.Required.includes('bootstrap')) {
            Apps.LoadScript2(webroot + "/references/bootstrap.min.js", function () {

                Apps.LoadStyle(webroot + "/references/bootstrap.min.css");

                if (callback)
                    callback();
            });
        }
        else {
            if (callback)
                callback();
        }
    },
    RegisterDebugRemote: function (webroot, callback) {
        {
            require([webroot + '/Debug/debug.js'], function (debug) {

                Apps.Debug = debug;
                //TODO: Allow remote users ability to turn on/off debug overlay
                //Apps['Settings'] = {};
                //Apps.Settings['debug'] = debug;


                //DEBUG STUFF
                //if (Apps.Settings.debug && Apps.Settings.debug === true)
                //implication is this is running because user stipulated required tag
                if (Apps.Settings.Debug === true) {
                    // Apps.Settings.debug = true;

                    Apps.Debug.Initialize();
                    Apps.Debug.BuildBar();
                }

                //require([webroot + "/references/bootstrap-notify.min.js"], function (notify) {
                //    Apps.Notify = $.notify;

                //});

                if (callback)
                    callback();



            });
        }
    },
    RegisterLinqRemote: function (webroot, callback) {
        if (Apps.Settings.Required.includes('linq')) {
            Apps.LoadScript2(webroot + '/references/linq.js', function (result, error) {
                if (callback)
                    callback();
            });
        }
        else
            if (callback)
                callback();
    },
    RegisterJQTERemote: function(webroot, callback)
    {
        if (Apps.Settings.Required.includes('jqte'))
        {
            require([webroot + '/references/jquery-te-1.4.0.min.js'], function (jqte) {

                Apps.JQTE = $.fn.jqte; // Reference appears to get lost across modules. Use "$.fn.jqte = Apps.JQTE" to get it back.

                Apps.LoadStyle(webroot + '/references/jquery-te-1.4.0.css');

                if (callback)
                    callback();
            });
        }
        else
            if (callback)
                callback();
    },
    RegisterDateTimePickerRemote: function (webroot, callback) {
        //if (Apps.Settings.Required.includes('datetimepicker'))
        {
            //Apps.LoadScript2(webroot + '/references/flatpickr.js', function (result, error) {
            require([webroot + '/references/flatpickr.js'], function(flatpickr) {
                Apps.LoadStyle(webroot + '/references/flatpickr.css');
                Apps.Flatpickr = flatpickr;
                if (callback)
                    callback();
            });
        }
        //else
        //    if (callback)
        //        callback();
    },
    Block: function()
    {
        if ($.isFunction($.blockUI))
            $.blockUI();
    },
    UnBlock: function()
    {
        if ($.isFunction($.blockUI))
            $.unblockUI();
    },
    RegisterBlockUIRemote: function (webroot, callback) {
        if (Apps.Settings.Required.includes('blockui')) {
            //Apps.LoadScript2(webroot + '/references/jquery.blockui.js', function (util) {
            require([webroot + '/references/jquery.blockui.js'], function (util) {
                if (callback)
                    callback();
            });
        }
        else
            if (callback)
                callback();
    },
    RegisterKendoRemote: function (webroot, callback) {
        if (Apps.Settings.Required.includes('kendo')) {
            require([webroot + '/references/kendo.all.min.js'], function (util) {
                if (callback)
                    callback();
            });
        }
        else
            if (callback)
                callback();
    },
    RegisterDialogsRemote: function (webroot, callback) {
        if (Apps.Settings.Required.includes('dialogs')) {
            require([webroot + "/modules/Dialog/dialog.js"], function (dialog) {
                Apps.Dialogs = dialog;
                if (callback)
                    callback();
            });
        }
        else
            if (callback)
                callback();
    },
    RegisterGridsRemote: function (webroot, callback) {
        if (Apps.Settings.Required.includes('grids')) {
            require([webroot + "/modules/Grid/grid.js"], function (grids) {
                Apps.Grids = grids;
                if (callback)
                    callback();
            });
        }
        else
            if (callback)
                callback();
    },
    RegisterDataSingle: function (datum, callback) {

        Apps.Util.Get(datum.path, function (error, result) {

            Apps.Debug.HandleError2(error || result.Success === false, datum.failmessage, JSON.stringify(result), datum.successmessage, function () {

                Apps.RefreshData(datum, result, function () {

                    if (callback)
                        callback();
                });
            });
        });
    },

    RegisterDataRemote: function (data, callback) {

        $.each(data, function (index, datum) {
            Apps.CountDownData.count++;
            Apps.Util.Get(datum.path, function (error, result) {

               Apps.Debug.HandleError2(error || result.Success === false, datum.failmessage, JSON.stringify(result), datum.successmessage, function () {


                    if (datum.callback)
                        datum.callback();
                });

                    Apps.RefreshData(datum, result);
                    Apps.CountDownData.check();

            });
        });
    },

    Notify: function (type, message) {
        //$.notify(message, { className: type, globalPosition: 'right bottom', autoHide: true, clickToHide: false });
        if ($.isFunction($.notify)) {
            var delay = 1000;
            if (type === 'warning' || type === 'danger')
                delay = 10000;

            $.notify({
                message: message,
                url: 'javascript:Apps.Debug.ShowErrorDialog();'
            },
                {
                    type: type, //info, success, warning, danger
                    element: 'body',
                    position: null,
                    placement: { from: 'bottom', align: 'right' },
                    delay: delay,
                    animate: { enter: 'animated fadeInUp', exit: 'animated fadeOutDown' },
                    offset: { x: 20, y: 20 },
                    z_index: 1000,
                    spacing: 2
                });
        }
        else
            console.log(type + ' notify: ' + message);
    },
    CreateComponent: function (componentName)
    {
        var createComponentUrl = Apps.Settings.WebRoot + '/api/appsjs/CreateComponent?appsRoot=/' + Apps.Settings.VirtualFolder + '/Scripts/Apps&componentName=' + componentName;

        Apps.Util.Get(createComponentUrl, function (error, result) {

        });
    },
    CreateComponent2: function (componentName, framework) {
        var createComponentUrl = Apps.Settings.WebRoot + '/api/appsjs/CreateComponent2?appsRoot=/' + Apps.Settings.VirtualFolder + '/Scripts/Apps&componentName=' + componentName + '&framework=' + framework;

        Apps.Util.Get(createComponentUrl, function (error, result) {

        });
    },
   RegisterPage: function(page)
    {

    },
    RegisterPages: function (pages) {

        Apps.Logs['Pages'] = [];

        $.each(pages, function (pageIndex, page) {

            if (page.name && page.pageroot) {

                Apps.CountDownPages.count++;

                var pageUrl = (Apps.Settings.WebRoot ? Apps.Settings.WebRoot : '');
                //pageUrl += '/' + (Apps.Settings.VirtualFolder ? Apps.Settings.VirtualFolder : '');
                pageUrl += '/api/appsjs/CreatePage';

                var appsRoot = Apps.Settings.appsrootraw; //See register
                var webRoot = (Apps.Settings.WebRoot ? Apps.Settings.WebRoot : '');

                pageUrl += '?webRoot=' + Apps.Settings.WebRoot.replace('http://localhost/',''); // webRoot;
                pageUrl += '&appsRoot=' + Apps.Settings.AppsRoot; // appsRoot;
                pageUrl += '&pagesRoot=' + page.pageroot; //Apps.Settings.PagesRoot;
                pageUrl += '&pageName=' + page.name;
                var controlList = page.controls ? JSON.stringify(page.controls) : '';
                pageUrl += '&pageControls=' + controlList;
                var shortnamespacesValue = (Apps.Settings.shortnamespaces && Apps.Settings.shortnamespaces) ? true : false;
                pageUrl += '&shortnamespaces=' + shortnamespacesValue ;

                Apps.Logs.Pages[page.name] = [];
                Apps.Util.Post(pageUrl, function (error, result) {

                    Apps.Debug.HandleError2(error, 'Problem creating page "' + page.name + '.', JSON.stringify(result), '', function () {

                        //Apps.Logs.Pages[page.name] = Apps.Logs.Pages[page.name].concat(result.Logs);

                        if (!error) {
                            if (!result.Success || result.Success === true) {

                                //create page
                                Apps.CountDownPages.count++;
                                var pageReferenceUrl = webRoot + '/' + page.pageroot + '/' + page.name + '/' + page.name + '.js?' + Apps.Settings.Version;
                                require([pageReferenceUrl], function (pagereference) {

                                    Apps.Pages[page.name] = pagereference;

                                    //if (Apps.Settings.shortnamespaces && Apps.Settings.shortnamespaces === true);//Apps.Pages[page.name] = {};
                                    //{
                                    //    let doo = 'nothing';
                                    //}
                                    //else {
                                    //    Apps.Pages[page.name]['Controls'] = {};
                                    //}
                                    //Automatically register page template
                                    var mypagetemplatepath = webRoot + '/' + page.pageroot + '/' + page.name + '/' + page.name + '.html';
                                    Apps.LoadTemplate(page.name, mypagetemplatepath, function () {

                                        //Automatically load page css
                                        var mypagecsspath = webRoot + '/' + page.pageroot + '/' + page.name + '/' + page.name + '.css';
                                        Apps.LoadStyle(mypagecsspath, function () {

                                            //Fire initialize
                                            Apps.Pages[page.name].Initialize();

                                            Apps.CountDownPages.check();
                                            if (page.controls) {

                                                $.each(page.controls, function (controlIndex, pageControl) {

                                                    Apps.CountDownPages.count++;

                                                    //Apps.Pages[page.name]['Controls'][pageControl.name] 
                                                    var controlReferenceUrl = webRoot + '/' + page.pageroot + '/' + page.name + '/Controls/' + pageControl.name + '/' + pageControl.name + '.js';

                                                    if (Apps.Settings.shortnamespaces && Apps.Settings.shortnamespaces === true)
                                                        controlReferenceUrl = webRoot + '/' + page.pageroot + '/' + page.name + '/' + pageControl.name + '/' + pageControl.name + '.js';

                                                    require([controlReferenceUrl], function (controlreference) {

                                                        var pageName = page.name;
                                                        var controlName = pageControl.name;

                                                        if (Apps.Settings.shortnamespaces && Apps.Settings.shortnamespaces === true)
                                                            Apps.Pages[pageName][controlName] = controlreference;
                                                        else
                                                            Apps.Pages[pageName]['Controls'][controlName] = controlreference;

                                                        //get data
                                                        if (pageControl.data) {
                                                            Apps.RegisterData([pageControl.data]); //expects a collection
                                                        }
                                                        if (pageControl.templates) {
                                                            Apps.RegisterTemplates(pageControl.templates);
                                                        }

                                                        //Automatically register template
                                                        var mytemplatepath = webRoot + '/' + page.pageroot + '/' + page.name + '/Controls/' + pageControl.name + '/' + pageControl.name + '.html';

                                                        if (Apps.Settings.shortnamespaces && Apps.Settings.shortnamespaces === true)
                                                            mytemplatepath = webRoot + '/' + page.pageroot + '/' + page.name + '/' + pageControl.name + '/' + pageControl.name + '.html';

                                                        Apps.LoadTemplate(controlName, mytemplatepath, function () {

                                                            //Automatically load css
                                                            var mycsspath = webRoot + '/' + page.pageroot + '/' + page.name + '/Controls/' + pageControl.name + '/' + pageControl.name + '.css';

                                                            if (Apps.Settings.shortnamespaces && Apps.Settings.shortnamespaces === true)
                                                                mycsspath = webRoot + '/' + page.pageroot + '/' + page.name + '/' + pageControl.name + '/' + pageControl.name + '.css';

                                                            Apps.LoadStyle(mycsspath, function () {
                                                                Apps.CountDownPages.check();
                                                            });


                                                        });


                                                    });

                                                });
                                            }

                                        });


                                    });

                                    Apps.CountDownPages.check();
                                });
                            }
                        }
                    });
                    Apps.CountDownPages.check();
                });
            }

        });
    },

    //Doesn't get data, allows the control to produce data (might need to be bound etc.)
    LoadControl: function (name, data, callback) {

        Apps.Controls[name] = new Apps.Template({ id: name, content: data });
        Apps.Controls[name].Load(data);

        if (callback)
            callback(Apps.Controls[name]);

    }

};
Apps.Control = function (settings) {



};
Apps.Template = function (settings) {

    this.TemplateID = settings.id; // templateId;
    //this.Selector = $("#" + this.TemplateID);
   
    //this.Selector.html(settings.data);
    this.Load = function (content) {
       // this.Drop(content);
       // $(document.forms[0]).append('<div id="' + this.TemplateID + '" style="display:none;">' + content + '</div>'); //Put template on dom first
        $(document.body).append('<div id="' + this.TemplateID + '" style="display:none;"></div>'); //Put template on dom first

        this.Selector = $("#" + this.TemplateID);
        this.Selector.html(content); //Puts template inside div container (not template inner html)
    };

    this.Drop = function (argsArray) {
        //Get template html and drop to dom and reload selector
       // var content = Apps.Util.DropTemplate(this.TemplateID);

        this.Selector = $("#" + this.TemplateID);

        //Gets html from template and puts inside container div (exposing it)
        var content = this.Selector.find('script').html();

        if (argsArray)
            content = content.SearchAndReplace.apply(content, argsArray);

       // if($(content).length === 0)
        if ($('#' + $(content)[0].id).length === 0)
            this.Selector.append(content);
            //this.Selector.append(content);

        return this;
    };
    this.Show = function (speed) {

        //Re-check since variable doesn't change when removed from dom
        this.Selector = $("#" + this.TemplateID);

        //if (this.Selector.length === 0)
            this.Drop(); //Drops the inner template content

        this.Selector.show(speed);

        return this;
    };
    this.Hide = function (speed) {

        if (this.Selector.length === 0)
            this.Drop();

        this.Selector.hide(speed);

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