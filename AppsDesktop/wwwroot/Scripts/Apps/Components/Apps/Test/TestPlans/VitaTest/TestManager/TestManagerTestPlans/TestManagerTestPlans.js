define([], function () {
    var Me = {
        Enabled: true,
        Color: 'blue',
        Name: 'TestManagerTestPlans',
        Initialize: function () {

            Apps.Debug.Trace(this);

        },
        Show: function()
        {
            Apps.Debug.Trace(this);
            Apps.UI.TestManagerTestPlans.Show();
        },
        Hide: function()
        {
            Apps.Debug.Trace(this);
            Apps.UI.TestManagerTestPlans.Hide();
        },
        Event: function (sender, args, callback)
        {
            Apps.Debug.Trace(this, 'TestManagerTestPlans Event: ' + sender);

            switch (sender)
            {
                case 'view':

                    Me.Show();
                    break;

                case 'hide':

                    Apps.Pages.TestManagerTestPlans.Hide();
                    break;

            }
        }

    };
    return Me;
})