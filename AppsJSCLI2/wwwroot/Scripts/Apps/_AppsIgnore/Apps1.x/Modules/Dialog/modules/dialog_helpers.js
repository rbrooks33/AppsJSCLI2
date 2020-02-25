//Note: Script file used in leiu of global since global is not guaranteed.
//File and functions should be named in such a way as to help identify purpose for casual developer

function dialog_dragstart_handler(event)
{
    event.dataTransfer.setData("text/plain", event.target.id); //info helps "drop" event identify dialog box
}