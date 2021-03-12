define([], function () {
    var Me = {
        Initialize: function (callback) {
                callback();
        },
        Show: function () {
            Me.Initialize(function () {
                Me.UI.Show();
                Me.GetSearchParams(function (searchParams) {

                });
            });
        },
        GetSearchParams: function (callback) {
            Apps.Get2('/api/Templates/GetSearchParams', function (result) {
                if (result.Success) {
                    callback(result.Data);
                }
            });
        },
        Create: function () {
            Apps.Get2('/api/Templates/Create', function (result) {
                if (result.Success) {
                    Apps.Notify('success', 'copied!');
                }
            });
        },
        AddComponent: function (level) {
            let level1UL = $('#CodGen_SPA_ComponentsMap_UL1');
            let level1LI1 = ('<li>' + $('#CodeGen_SPA_AddComponent_Name').val() + '</li>').appendTo(level1UL);
        }
    };
    return Me;
});