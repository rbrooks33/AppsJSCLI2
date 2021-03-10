define([], function () {
    var Me = {
        Initialize: function () {
        },
        Show: function () {
            Me.TestPlans.Show();
        },
        Hide: function () {
            Apps.UI.Test.Hide();
        }
    };
    return Me;
});