define([], function () {
    var Me = {
        Initialize: function () {
        },
        Show: function () {
            Me.TestPlans.Show();
        },
        Hide: function () {
            Me.UI.Hide();        }
    };
    return Me;
});