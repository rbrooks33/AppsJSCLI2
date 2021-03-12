{
    "Components": [
        {
        "Name": "Apps",
        "Load": true,
        "Initialize": true,
        "UI": true,
            "Components": [
                {
                    "Name": "Plan",
                    "Load": true,
                    "Initialize": true,
                    "UI": false,
                    "Components": [
                        {
                            "Name": "AppComponents",
                            "Load": true,
                            "Initialize": true,
                            "UI": true,
                            "Components": [
                                {
                                    "Name": "Stories",
                                    "Load": true,
                                    "Initialize": true,
                                    "UI": true,
                                    "Components": [
                                        {
                                            "Name": "Controls",
                                            "Load": true,
                                            "Initialize": false,
                                            "UI": false,
                                            "Components": []
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "Name": "Create",
                    "Load": true,
                    "Initialize": true,
                    "UI": true,
                    "Components": [
                        {
                            "Name": "Code",
                            "Load": true,
                            "Initialize": true,
                            "UI": true

                        },
                        {
                            "Name": "Services",
                            "Load": true,
                            "Initialize": true,
                            "UI": true

                        },
                        {
                            "Name": "Templates",
                            "Load": true,
                            "Initialize": true,
                            "UI": true

                        }

                        ]
                },
                {
                    "Name": "Test",
                    "Load": true,
                    "Initialize": false,
                    "UI": true,
                    "Components": [
                        {
                            "Name": "TestPlans",
                            "Load": true,
                            "Initialize": true,
                            "UI": true,
                            "Components": [
                                {
                                    "Name": "Tests",
                                    "Load": true,
                                    "Initialize": true,
                                    "UI": false,
                                    "Components": [
                                        {
                                            "Name": "Steps",
                                            "Load": true,
                                            "Initialize": true,
                                            "UI": false,
                                            "Components": [
                                                {
                                                    "Name": "EditTest",
                                                    "Load": true,
                                                    "Initialize": true,
                                                    "UI": true

                                                }
]
                                        },
                                        {
                                            "Name": "TestGrid",
                                            "Load": true,
                                            "Initialize": true,
                                            "UI": false

                                        }

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
                    "UI": true,
                    "Components": [
                        {
                            "Name": "Repo",
                            "Load": true,
                            "Initialize": true,
                            "UI": false

                        },
                        {
                            "Name": "Tools",
                            "Load": true,
                            "Initialize": true,
                            "UI": true

                        }

                    ]
                },
                {
                    "Name": "Track",
                    "Load": true,
                    "Initialize": true,
                    "UI": false,
                    "Components": [
                        {
                            "Name": "Events",
                            "Load": true,
                            "Initialize": true,
                            "UI": true

                        },
                        {
                            "Name": "Versions",
                            "Load": true,
                            "Initialize": true,
                            "UI": false

                        }

                    ]
                }
            ]
        },
    
      {
          "Name": "Helpers",
          "Load": true,
          "Initialize": true,
          "UI": false,
          "Components": [
              {
                  "Name": "Dialogs",
                  "Load": true,
                  "Initialize": true,
                  "UI": true

              }
          ]
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
       "UI": true,
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
        "UI": true,
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