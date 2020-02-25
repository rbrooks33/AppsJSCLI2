define(['./LoginAPIs/Google.js'], function (Google) {
    var Me = {
        Initialize: function (callback) {

            //Apps.Debug.Trace(this);

            Apps.LoadTemplate('Login', Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components/Login/Login.html', function () {

                Apps.LoadStyle(Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components/Login/Login.css');

                Apps.UI.Login.Show();

                $('#Index_Header').html(Apps.UI.Login.Selector);

                Me.Resize();
                $(window).resize(function () {
                    Me.Resize();
                });

                if (callback)
                    callback();
            });
        },
        Show: function () {
            //Apps.Debug.Trace(this);
            //Apps.UI.Login.Show();
            Me.Initialize(function () {

                //Google.Authenticate();

                $('.LoginContentStyle').animate({ opacity: 1 }, 700, 'swing', function () {

                    $('.Login_SignInContainer_Google').animate({ opacity: 1 }, 500, 'swing', function () {

                        //$('.Login_SignInContainer_Microsoft').animate({ opacity: 1 }, 2000, 'swing', function () {

                        //});
                    });
                    //While hidden start off left a little then show and move to grid default
                    $('.Login_imgHero').animate({ left: '-=200px' }, 100);
                    $('.Login_imgHero').animate({ left: '+=200px', opacity: 1 }, 200, 'swing', function () {

                        //$('.Login_SignInContainer_Google').animate({ opacity: 1 }, 500, 'swing', function () {

                        //    $('.Login_SignInContainer_Microsoft').animate({ opacity: 1 }, 2000, 'swing', function () {

                        //    });
                        //});
                        $('#Login_WelcomeTo').animate({ opacity: 1 }, 400, 'swing', function () {


                            $('#Login_KeepOnWorking').animate({ opacity: 1 }, 1500, 'swing', function () {

                                $('#Login_AutomateCreation').animate({ opacity: 1 }, 3000, 'swing', function () {


                                    $('#Login_DelegationMadeEasy').animate({ opacity: 1 }, 1500, 'swing', function () {

                                    });
                                });
                            });
                        });
                    });
                });
            });
        },
        Hide: function () {
            Apps.UI.Login.Hide();
        },
        Reload: function () {
            location.reload();
        },
        Resize: function () {

        },
        Event: function (sender, args, callback) {

        }
    };
    return Me;
});