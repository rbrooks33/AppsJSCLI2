define([], function () {
    var Me = {
        SoftwareModel: null,
        Initialize: function () { },
        GetSoftwareModel: function () {
            Apps.Get2('/api/Software/GetSoftwareModel', function (result) {
                if (result.Success) {

                }
                
            });
        }
    };
    return Me;
});