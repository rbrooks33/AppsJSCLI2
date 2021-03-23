define([], function () {
    var Me = {
        Parent: null,
        Initialize: function () {
        },
        Show: function () {
            Me.UI.Drop();
            Apps.Notify('info', 'hiya');
        },
        Hide: function () {
            Me.UI.Hide(400);
        }
    };
    return Me;
});