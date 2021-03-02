define(['./Versions/Versions.js', './Events/Events.js'], function (versions, events) {
    var Me = {
        Versions :versions,
        Events: events,
        Initialize: function () {
            Me.Events.Initialize();
        }
    };
    return Me;
});