define([], function () {
    var Me = {
        Initialize: function () {
            Apps.Notify('info', 'The Main component has been initialized (it was loaded via components.js).');
        },
        GetUserCount: function () {
            return 3;
        }
    };
    return Me;
});