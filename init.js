MouseInit();
PreviewInit();
SettingsLoad();

window.oncontextmenu = function ()
{
    return false;
}

PedalKeyboardClear();

document.addEventListener('keydown', PedalKeyboardDown);
document.addEventListener('keyup', PedalKeyboardUp);

