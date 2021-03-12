define(['./Dialogs/Dialogs.js'], function (dialogs) {
    var Me = {
        Dialogs: dialogs,
        Initialize: function () {
            Me.Dialogs.Initialize(); //Loads all dialogs
        },
        OpenResponse: function (resultEscapedString) {
            let resultString = unescape(resultEscapedString);
            Apps.Components.Helpers.Dialogs.Content('Helpers_Exception_Dialog', resultString);
            Apps.Components.Helpers.Dialogs.Open('Helpers_Exception_Dialog');

        }
    };
    return Me;
});