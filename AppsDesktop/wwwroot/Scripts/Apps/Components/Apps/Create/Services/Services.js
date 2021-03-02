define([], function () {
    var Me = {
        Initialize: function () {
            
        },
        Show: function () {
            Apps.Components.Helpers.Dialogs.Content('Plan_Apps_Services_Dialog', '');
            Apps.Components.Helpers.Dialogs.Open('Plan_Apps_Services_Dialog');
        }
    };
    return Me;
});