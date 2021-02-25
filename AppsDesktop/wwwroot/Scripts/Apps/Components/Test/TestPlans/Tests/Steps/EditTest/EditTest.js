//JS
define([], function () {
    var Me = {
        Step:null,
        Parent: null,
        Editor: null,
        Initialize: function (steps) {
            Apps.LoadTemplate('EditTest', '/Scripts/Apps/Components/Plan/Apps/App/TestPlans/Tests/Steps/EditTest/EditTest.html', function () {
                Apps.LoadStyle('/Scripts/Apps/Components/Plan/Apps/App/TestPlans/Tests/Steps/EditTest/EditTest.css');

                Apps.UI.EditTest.Drop(); //Use Drop to put hidden on dom

                Me.Parent = steps;

                //if (callback)
                //    callback();
            });
        },
        Show: function (step) {

            Me.Step = step;
            Apps.UI.EditTest.Show();
            Apps.Notify('info', 'showing step ' + step.ID);

            //EditTest_Content_Container
            Me.Editor = ace.edit("EditTest_Content_Container");
            Me.Editor.setTheme("ace/theme/monokai");
            Me.Editor.session.setMode("ace/mode/xml");
            Me.Editor.renderer.onResize(true);
            Me.Editor.setValue(step.Script ? step.Script : '');

            $('#EditTest_Content_Container').css('height', '79vh').css('margin-top', '48px');
        },
        Hide: function () {
            Apps.UI.EditTest.Hide();
        },
        Save: function () {
            Me.Step.Script = Me.Editor.getValue();
            Me.Parent.CurrentStep = Me.Step;
            Me.Parent.UpsertStep();
        },
        Run: function () {
            Apps.Get2('/api/Test/RunStepScript?script=' + escape(Me.Step.Script), function (result) {
                if (result.Success) {
                    Apps.Notify('success', 'Script was run.');
                    
                }
                else {
                    Apps.Notify('warning', 'Problem running script.');
                }
            });
        }
    };
    return Me;
});
