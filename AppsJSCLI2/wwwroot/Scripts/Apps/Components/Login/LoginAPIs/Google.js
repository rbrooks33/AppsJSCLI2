define([], function () {
    var Me = {
        Token: null,
        Authenticated: false,
        Authenticate: function (callback) {

            Apps.LoadScript('https://apis.google.com/js/platform.js', function () {

                gapi.signin2.render('my-signin2', {
                    'scope': 'profile email',
                    'width': 240,
                    'height': 50,
                    'longtitle': true,
                    'theme': 'dark',
                    'onsuccess': function (profile) {
                        //Used upon validation
                        Me.Token = profile.Zi.id_token;
                    },
                    'onfailure': function () {

                    }
                });

                gapi.load('auth2', function () {
                    Apps.auth2 = gapi.auth2.init({
                        client_id: '92970341323-cond57q8ldud62kcv7fghjoa81cma9i2.apps.googleusercontent.com'

                        // Scopes to request in addition to 'profile' and 'email'
                        //scope: 'additional_scope'
                    });

                    gapi.auth2.getAuthInstance().isSignedIn.listen(function (signedin) {
                        Me.Authenticated = signedin;
                        if(callback)
                            callback(Me.Authenticated);
                    });

                    if(callback)
                        callback(Me.Authenticated);
                });


            });

        },
        SignInSuccessCallback: null,
        Logout: function () {
            gapi.auth2.getAuthInstance().signOut();
        },
        RenderButton: function () {


        },
        OnSuccess: function (googleUser) {
            
            //let profile = googleUser.getBasicProfile();
            //console.log('Logged in as: ' + profile.getName());

            //$('.Login_SignInContainer_Google').css('opacity', '1');
            //$('.Login_divGoogleSignOut').css('opacity', '1');

            //if (Me.SignInSuccessCallback)
            //    Me.SignInSuccessCallback(profile);
        },
        OnFailure: function (error) {
            console.log(error);
        }
    };
    return Me;
});