var PedalMouseL = 0;
var PedalMouseR = 0;
var PedalMouseM = 0;
var PedalKey1 = 0;
var PedalKey2 = 0;
var PedalKey3 = 0;
var PedalKeyDisabled = true;
var PedalAdjust = false;

function PedalSet()
{
    PedalMouseL = document.getElementById('PedalMouseL').selectedIndex;
    PedalMouseR = document.getElementById('PedalMouseR').selectedIndex;
    PedalMouseM = document.getElementById('PedalMouseM').selectedIndex;
    PedalKey1 =   document.getElementById('PedalKey1').selectedIndex;
    PedalKey2 =   document.getElementById('PedalKey2').selectedIndex;
    PedalKey3 =   document.getElementById('PedalKey3').selectedIndex;
}

function PedalMouse(Btn)
{
    var OpCode = 0;
    if (Btn == 1) { OpCode = PedalMouseL; }
    if (Btn == 2) { OpCode = PedalMouseR; }
    if (Btn == 3) { OpCode = PedalMouseM; }

    PedalOpcode(OpCode);
    return OpCode;
}

var PedalKeys = [];

function PedalKeyboardClear()
{
    PedalKeys = [];
}

function PedalKeyboardDown(Evt)
{
    if (PedalKeyDisabled || PedalAdjust)
    {
        return;
    }

    if (Evt.repeat)
    {
        return;
    }
    
    var OpCode = 0;
    
    switch (Evt.code)
    {
        case "Backquote":
        case "Digit1":
        case "Digit2":
        case "Digit3":
        case "Digit4":
        case "Digit5":
        case "Digit6":
        case "Digit7":
        case "Digit8":
        case "Digit9":
        case "Digit0":
        case "Minus":
        case "Equal":
        case "Backspace":

        case "Tab":
        case "KeyQ":
        case "KeyW":
        case "KeyE":
        case "KeyR":
        case "KeyT":
        case "KeyY":
        case "KeyU":
        case "KeyI":
        case "KeyO":
        case "KeyP":
        case "BracketLeft":
        case "BracketRight":
        case "Backslash":

        case "CapsLock":
        case "KeyA":
        case "KeyS":
        case "KeyD":
        case "KeyF":
        case "KeyG":
        case "KeyH":
        case "KeyJ":
        case "KeyK":
        case "KeyL":
        case "Semicolon":
        case "Quote":
        case "Enter":

        case "ShiftLeft":
        case "KeyZ":
        case "KeyX":
        case "KeyC":
        case "KeyV":
        case "KeyB":
        case "KeyN":
        case "KeyM":
        case "Comma":
        case "Period":
        case "Slash":
        case "ShiftRight":

        case "OSLeft":
        case "AltLeft":
        case "Space":
        case "AltRight":
        case "OSRight":
        case "ContextMenu":
            OpCode = PedalKey1;
            break;

        case "Insert":
        case "Delete":
        case "Home":
        case "End":
        case "PageUp":
        case "PageDown":
        case "ArrowUp":
        case "ArrowDown":
        case "ArrowLeft":
        case "ArrowRight":
            OpCode = PedalKey2;
            break;
            
        case "NumLock":
        case "NumpadDivide":
        case "NumpadMultiply":
        case "NumpadSubtract":
        case "NumpadAdd":
        case "NumpadEnter":
        case "NumpadDecimal":
        case "Numpad0":
        case "Numpad1":
        case "Numpad2":
        case "Numpad3":
        case "Numpad4":
        case "Numpad5":
        case "Numpad6":
        case "Numpad7":
        case "Numpad8":
        case "Numpad9":
            OpCode = PedalKey3;
            break;
    }

    var FireEvent = false;
    if (PedalKeys.length == 0)
    {
        FireEvent = true;
    }

    if (PedalKeys.indexOf(Evt.code) < 0)
    {
        PedalKeys.push(Evt.code);
    }

    if (!FireEvent)
    {
        return;
    }

    if (OpCode == 0)
    {
        switch (Evt.code)
        {
            case "Insert":
            case "Delete":
            case "Numpad5":
                OpCode = 1;
                break;

            case "PageUp":
            case "ArrowUp":
            case "Numpad8":
                OpCode = 2;
                break;

            case "PageDown":
            case "ArrowDown":
            case "Numpad2":
                OpCode = 3;
                break;

            case "Home":
            case "ArrowLeft":
            case "Numpad4":
                OpCode = 4;
                break;

            case "End":
            case "ArrowRight":
            case "Numpad6":
                OpCode = 5;
                break;
        }
    }
    
    PedalOpcode(OpCode);
}

function PedalOpcode(OpCode)
{
    switch (OpCode)
    {
        case 1:
            ScreenSwitchAdjust();
            break;
        case 2:
            SwitchPage(-1);
            break;
        case 3:
            SwitchPage(1);
            break;
        case 4:
            SwitchPage(-10);
            break;
        case 5:
            SwitchPage(10);
            break;
    }
}

function PedalKeyboardUp(Evt)
{
    if (PedalKeys.indexOf(Evt.code) >= 0)
    {
        PedalKeys.splice(PedalKeys.indexOf(Evt.code), 1);
    }
}

