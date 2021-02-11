{
  "Resources": [
   
    {
      "Name": "QueryString ES5",
      "Enabled": false,
      "LoadFirst": false,
      "Order": 1,
      "ModuleType": "require",
      "FileName": "QueryString_es5.js",
      "Description": "Parses and loads current querystring collection."
    },

    {
      "Name": "Require JS",
      "Enabled": true,
      "LoadFirst": true,
      "Order": 2,
      "ModuleType": "script",
      "FileName": "require.js",
      "Description": "AMD module loading library."
    },
    {
      "Name": "Dialog tool",
      "Enabled": false,
      "LoadFirst": false,
      "Order": 2,
      "ModuleType": "require",
      "ModuleName": "Dialogs",
      "FileName": "dialog.js",
      "Description": "Dialog tool. Depends on jquery and linq.js. Also, Apps.js expects it to be named 'Dialogsl'. Ain't coupling great!!?"
    },

    {
      "Name": "JQuery",
      "Enabled": true,
      "LoadFirst": true,
      "Order": 1,
      "ModuleType": "script",
      "FileName": "jquery.js",
      "Description": "Awesome library."
    },

    {
      "Name": "Notify JS",
      "Enabled": true,
      "LoadFirst": false,
      "Order": 1,
      "ModuleType": "script",
      "FileName": "vanilla-notify.js",
      "Description": "Enabled app to show popup notifications."
    },
    {
      "Name": "Notify CSS",
      "Enabled": true,
      "LoadFirst": false,
      "Order": 1,
      "ModuleType": "style",
      "FileName": "vanilla-notify.css",
      "Description": "Enabled app to show popup notifications."
    },
    {
      "Name": "Bootstrap JS",
      "Enabled": false,
      "LoadFirst": false,
      "Order": 1,
      "ModuleType": "require",
      "FileName": "bootstrap4withpopper.js",
      "Description": "Bootstrap 4."
    },
    {
      "Name": "Bootstrap CSS",
      "Enabled": true,
      "LoadFirst": false,
      "Order": 1,
      "ModuleType": "style",
      "FileName": "bootstrap4.min.css",
      "Description": "Bootstrap CSS."
    },
    {
      "Name": "Bind",
      "Enabled": true,
      "LoadFirst": false,
      "Order": 1,
      "ModuleType": "require",
      "ModuleName": "Bind",
      "FileName": "bind.js",
      "Description": "Simple two-way binding."
    }
  ]
}
