define([], function () {
    var Me = {
        Initialize: function () {

        },
        OpenResponse: function (resultEscapedString) {
            let resultString = unescape(resultEscapedString);
            Apps.Components.Helpers.Dialogs.Content('Helpers_Exception_Dialog', resultString);
            Apps.Components.Helpers.Dialogs.Open('Helpers_Exception_Dialog');

        }
    };
    return Me;
});