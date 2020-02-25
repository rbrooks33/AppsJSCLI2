define([], function () {
    var Me = {
        MSAL: null,
        Token: null,
        Graph: null,
        Authenticated: false,
        Callback: null,
        Authenticate: function (msal, callback) {

            Me.Callback = callback;

            if (typeof msal !== 'undefined') {

                Me.MSAL = msal; //global is Msal

                // Browser check variables
                var ua = window.navigator.userAgent;
                var msie = ua.indexOf('MSIE ');
                var msie11 = ua.indexOf('Trident/');
                var msedge = ua.indexOf('Edge/');
                var isIE = msie > 0 || msie11 > 0;
                var isEdge = msedge > 0;

                //If you support IE, our recommendation is that you sign-in using Redirect APIs
                //If you as a developer are testing using Edge InPrivate mode, please add "isEdge" to the if check

                // can change this to default an experience outside browser use
                var loginType = isIE ? "REDIRECT" : "POPUP";

                // runs on page load, change config to try different login types to see what is best for your application
                if (loginType === 'POPUP') {
                    let myAccount = Me.myMSALObj().getAccount();
                    if (myAccount) {// avoid duplicate code execution on page load in case of iframe and popup window.
                        //Me.Token = myAccount.idToken.aio; //.accessToken;
                        //Me.showWelcomeMessage();
                        Me.acquireTokenPopupAndCallMSGraph(callback);
                        callback(true);
                    }
                    else
                        if (callback)
                            callback(false);
                }
                else if (loginType === 'REDIRECT') {
                    //document.getElementById("SignIn").onclick = function () {
                    //    Me.myMSALObj().loginRedirect(Me.requestObj);
                    //};

                    if (Me.myMSALObj().getAccount() && !Me.myMSALObj().isCallback(window.location.hash)) {// avoid duplicate code execution on page load in case of iframe and popup window.
                        Me.showWelcomeMessage();
                        Me.acquireTokenRedirectAndCallMSGraph(callback);
                    }
                    else
                        if (callback)
                            callback(false);

                } else
                    if (callback)
                        callback(false);
            }
            else
                if (callback)
                    callback(false);
        },
        LoginSuccess: function (graph, callback) {
            Me.Graph = graph;
            //Me.RefreshUser(Me.Graph);
            if (callback)
                callback(true);
            //Apps.Components.Login.LoginSuccess('Microsoft', 'You have logged in via Microsoft.');
        },
        RefreshUser: function (graph) {
            Apps.Components.Login.User.FirstName = graph.givenName;
            Apps.Components.Login.User.LastName = graph.surname;
            Apps.Components.Login.User.FullName = graph.displayName;
            Apps.Components.Login.User.Email = '';
        },
        msalConfig: {
            auth: {
                clientId: 'a454a0e8-8555-4be2-9f81-127d8b086525', //'a454a0e8-8555-4be2-9f81-127d8b086525', //This is your client ID
                authority: "https://login.microsoftonline.com/40cb2646-e788-4762-bc40-ab803b9f2f1b" //40cb2646-e788-4762-bc40-ab803b9f2f1b" //This is your tenant info
            },
            cache: {
                cacheLocation: "localStorage",
                storeAuthStateInCookie: true
            }
        },

        graphConfig : {
            graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
        },

        // create a request object for login or token request calls
        // In scenarios with incremental consent, the request object can be further customized
        requestObj : {
            scopes: ["user.read"],
            authority: 'https://login.microsoftonline.com/40cb2646-e788-4762-bc40-ab803b9f2f1b'
        },

        myMSALObj: function () {
            let userAgentApp = new Me.MSAL.UserAgentApplication(Me.msalConfig);
            return userAgentApp;
        },

        SignIn: function () {
            Me.myMSALObj().loginPopup(Me.requestObj).then(function (loginResponse) {
                //Successful login
                //Me.showWelcomeMessage();
                //Call MS Graph using the token in the response
                Me.acquireTokenPopupAndCallMSGraph(Me.Callback);
            }).catch(function (error) {
                //Please check the console for errors
                console.log(error);
            });
        },
        Logout: function () {
            Me.myMSALObj().logout();
        },

        acquireTokenPopupAndCallMSGraph: function (callback) {
            //Always start with acquireTokenSilent to obtain a token in the signed in user from cache
            Me.myMSALObj().acquireTokenSilent(Me.requestObj).then(function (tokenResponse) {
                Me.Token = tokenResponse.accessToken;
                //Me.Token = tokenResponse.idToken.rawIdToken;
                //callback(true);
                Me.callMSGraph(Me.graphConfig.graphMeEndpoint, tokenResponse.accessToken, callback);
            }).catch(function (error) {
                console.log(error);
                // Upon acquireTokenSilent failure (due to consent or interaction or login required ONLY)
                // Call acquireTokenPopup(popup window)
                if (Me.requiresInteraction(error.errorCode)) {
                    Me.myMSALObj().acquireTokenPopup(Me.requestObj).then(function (tokenResponse) {
                        Me.callMSGraph(Me.graphConfig.graphMeEndpoint, tokenResponse.accessToken, callback);
                    }).catch(function (error) {
                        console.log(error);
                    });
                }
            });
        },

        callMSGraph: function (theUrl, accessToken, callback) {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    Me.LoginSuccess(JSON.parse(this.responseText), callback);
                }
            };
            xmlHttp.open("GET", theUrl, true); // true for asynchronous
            xmlHttp.setRequestHeader('Authorization', 'Bearer ' + accessToken);
            xmlHttp.send();
        },

        graphAPICallback: function (data) {
            //document.getElementById("json").innerHTML = JSON.stringify(data, null, 2);
        },

        showWelcomeMessage: function () {
            //var divWelcome = document.getElementById('WelcomeMessage');
            //divWelcome.innerHTML = "Welcome " + myMSALObj.getAccount().userName + " to Microsoft Graph API";
            //var loginbutton = document.getElementById('SignIn');
            //loginbutton.innerHTML = 'Sign Out';
            //loginbutton.setAttribute('onclick', 'signOut();');
        },

        //This function can be removed if you do not need to support IE
        acquireTokenRedirectAndCallMSGraph: function () {
            //Always start with acquireTokenSilent to obtain a token in the signed in user from cache
            myMSALObj.acquireTokenSilent(requestObj).then(function (tokenResponse) {
                callMSGraph(graphConfig.graphMeEndpoint, tokenResponse.accessToken, graphAPICallback);
            }).catch(function (error) {
                console.log(error);
                // Upon acquireTokenSilent failure (due to consent or interaction or login required ONLY)
                // Call acquireTokenRedirect
                if (requiresInteraction(error.errorCode)) {
                    myMSALObj.acquireTokenRedirect(requestObj);
                }
            });
        },

        authRedirectCallBack: function (error, response) {
            if (error) {
                console.log(error);
            } else {
                if (response.tokenType === "access_token") {
                    callMSGraph(graphConfig.graphMeEndpoint, response.accessToken, graphAPICallback);
                } else {
                    console.log("token type is:" + response.tokenType);
                }
            }
        },

        requiresInteraction: function (errorCode) {
            if (!errorCode || !errorCode.length) {
                return false;
            }
            return errorCode === "consent_required" ||
                errorCode === "interaction_required" ||
                errorCode === "login_required";
        }


    };
    return Me;
});