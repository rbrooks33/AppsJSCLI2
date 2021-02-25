{
  "Components": [
      {
          "Name": "Create",
          "Load": true,
          "Initialize": true,
          "ModuleType": "require"
      },
      {
          "Name": "Plan",
          "Load": true,
          "Initialize": true,
          "ModuleType": "require",
          "Components": [
              {
                  "Name": "Apps",
                  "Load": true,
                  "Initialize": true,
                  "ModuleType": "require",
                  "Components": [
                      {
                          "Name": "AppComponents",
                          "Load": true,
                          "Initialize": true,
                          "ModuleType": "require",
                          "Components": [
                          ]
                      }

                  ]
              }

          ]
      },
      {
          "Name": "Publish",
          "Load": true,
          "Initialize": true,
          "ModuleType": "require"
      },
      {
          "Name": "Helpers",
          "Load": true,
          "Initialize": true,
          "ModuleType": "require"
      },
      {
          "Name": "Track",
          "Load": true,
          "Initialize": true,
          "ModuleType": "require"
      },
     
     {
          "Name": "CodeGen",
          "Load": false,
          "Initialize": true,
          "ModuleType": "require"
      },
   {
      "Name": "Debug",
      "Version": "1.0.0",
      "Description": "",
      "ComponentFolder": null,
      "TemplateFolder": null,
      "Load": false,
      "Initialize": true,
      "Color": "blue",
      "ModuleType": "require",
      "Framework": "default",
      "Components": [],
      "IsOnDisk": true
    },
    {
      "Name": "Overview",
      "Version": "1.0.0",
      "Description": "",
      "ComponentFolder": null,
      "TemplateFolder": null,
      "Load": false,
      "Initialize": true,
      "Color": "blue",
      "ModuleType": "require",
      "Framework": "default",
      "Components": [],
      "IsOnDisk": true
    },
   
   
    {
      "Name": "VitaTest",
      "Version": "1.0.1",
      "Description": null,
      "ComponentFolder": null,
      "TemplateFolder": null,
      "Load": false,
      "Initialize": false,
      "Color": "blue",
      "ModuleType": "require",
      "Framework": "default",
      "Components": [
        {
          "Name": "TestManager",
          "Load": true,
          "Initialize": false,
          "Color": "blue",
          "ModuleType": "require",
          "Components": [
            {
              "Name": "TestManagerFuncSpecs",
              "Load": false,
              "Initialize": false,
              "Color": "blue",
              "ModuleType": "require",
              "Components": []
            },
            {
              "Name": "TestManagerRequirements",
              "Load": false,
              "Initialize": false,
              "Color": "blue",
              "ModuleType": "require",
              "Components": []
            },
            {
              "Name": "TestManagerSoftware",
              "Load": false,
              "Initialize": false,
              "Color": "blue",
              "ModuleType": "require",
              "Components": [
                {
                  "Name": "ViewConfigs",
                  "Load": false,
                  "Initialize": false,
                  "Color": "blue",
                  "ModuleType": "require",
                  "Components": []
                },
                {
                  "Name": "ViewShopRunnerProducts",
                  "Load": false,
                  "Initialize": false,
                  "Color": "blue",
                  "ModuleType": "require",
                  "Components": []
                }

              ]
            },
            {
              "Name": "TestManagerTestPlans",
              "Load": false,
              "Initialize": false,
              "Color": "blue",
              "ModuleType": "require",
              "Components": []
            },
            {
              "Name": "TestManagerTests",
              "Load": false,
              "Initialize": false,
              "Color": "blue",
              "ModuleType": "require",
              "Components": [
                {
                  "Name": "TestManagerTests_History",
                  "Load": false,
                  "Initialize": false,
                  "Color": "blue",
                  "ModuleType": "require",
                  "Components": []
                }
              ]
            },
            {
              "Name": "TestManagerTestSteps",
              "Load": false,
              "Initialize": false,
              "Color": "blue",
              "ModuleType": "require",
              "Components": []
            }
          ]
        }
      ],
      "IsOnDisk": false
    }
  ]
}