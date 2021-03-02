define([], function () {
    var Me = {
        Enabled: true,
        Color: 'blue',
        Name: 'TestSUT',
        UniqueID: null, //Primary key
        Items: [], //Collection of items
        Item: null, //Represents a single item in collection
        Initialize: function () {

            Apps.Debug.Trace(this);

        },
        Show: function()
        {
            Apps.Debug.Trace(this);
            Apps.UI.TestSUT.Show();
        },
        Hide: function()
        {
            Apps.Debug.Trace(this);
            Apps.UI.TestSUT.Hide();
        },
        Event: function (sender, args, callback)
        {
            //TODO: change pages to components if a top-level
            Apps.Debug.Trace(this, 'TestSUT Event: ' + sender);

            switch (sender)
            {
                case 'view':

                    Me.Show();
                    break;

                case 'hide':

                    Apps.Components.TestSUT.Hide();
                    break;

                case 'add_sut':


                    break;
            }
        }

    };
    return Me;
})