define([], function () {
    var Me = {
        Enabled: true,
        Color: 'blue',
        Name: 'Test538',
        UniqueID: null, //Primary key
        Items: [], //Collection of items
        Item: null, //Represents a single item in collection
        Initialize: function () {

            Apps.Debug.Trace(this);

        },
        Show: function()
        {
            Apps.Debug.Trace(this);
            Apps.UI.Test538.Show();
        },
        Hide: function()
        {
            Apps.Debug.Trace(this);
            Apps.UI.Test538.Hide();
        },
        SA_Is_Not_Using_MD5: function()
        {
            //By this time we know we are in localhost.vitacost.com and testing this test
            //TODO: put in database as such

            require([Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/references/funcunit.js'], function (funcunit) {

                    F.speed = 400;

                //Home
                if (location.href === 'https://localhost.vitacost.com/') {

                    Apps.Notify('success', 'At home page. Going to My Account...');

                    F('#yourAccount > a').click();

                }
                //Account home
                else if (location.href === 'https://localhost.vitacost.com/MyAccount/Login.aspx?target=/MyAccount/MyAccountHome.aspx') {

                    Apps.Notify('success', 'At Login. Signing in...');

                    if ($('#IamMasterFrameYesIam_ctl02_objLogin_buttonLogin').length === 1) {
                        
                        Apps.Notify('success', 'Not signed in. Signing in...');
                    }
                    else {
                        Apps.Notify('warning', 'Sign In button not found.');
                    }
                }
                //Account home (signed in)
                else if (location.href === 'https://localhost.vitacost.com/MyAccount/MyAccountHome.aspx') {

                    Apps.Notify('success', 'At Account Home. ');


                }
            });

        },
        GetSku: function() {
            var sku = prompt("Now that the cart is empty, please enter a qualifying sku to test."); //confirm(Apps.Notify('success', 'Waiting for user: Search for a sku and select it.');

            Apps.Notify('success', 'Thank you, now searching for sku.');

            $('#searchInput').val(sku);

            F('#C_LeftNav_SearchGo').click();

        },
        Event: function (sender, args, callback)
        {
            //TODO: change pages to components if a top-level
            Apps.Debug.Trace(this, 'Test538 Event: ' + sender);

            switch (sender)
            {
                case 'view':

                    Me.Show();
                    break;

                case 'hide':

                    Apps.Components.Test538.Hide();
                    break;


            }
        }

    };
    return Me;
})