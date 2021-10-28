var ConfTouch = 0;





var ScreenX;
var ScreenMouse;


function MouseDown(X, Y, Btn)
{
    ScreenEvent(X, Y, Btn);
}

function MouseMove(X, Y, Btn)
{
}

function MouseUp(X, Y, Btn)
{
}


var MouseBtn = 0;
var MouseX = 0;
var MouseY = 0;


function MouseDown_(Evt)
{
    if (ConfTouch == 0)
    {
        var _ = ScreenMouse.getBoundingClientRect();
        MouseBtn = 1;
       
        // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
        if ("which" in Evt)
        {  
            if (Evt.which == 3)
            {
                MouseBtn = 2;
            }
            if (Evt.which == 2)
            {
                MouseBtn = 3;
            }
        }
        else
        {
            // IE, Opera
            if ("button" in Evt)
            {
                if (Evt.button == 2)
                {
                    MouseBtn = 2;
                }
                if (Evt.button == 1)
                {
                    MouseBtn = 3;
                }
            }
        }
        
        MouseDown(Evt.clientX + window.scrollX - _.left, Evt.clientY + window.scrollX - _.top, MouseBtn);
    }
}

function MouseMove_(Evt)
{
    if (ConfTouch == 0)
    {
        if (MouseBtn != 0)
        {
            var _ = ScreenMouse.getBoundingClientRect();
            MouseMove(Evt.clientX + window.scrollX - _.left, Evt.clientY + window.scrollX - _.top, MouseBtn);
        }
    }
}

function MouseUp_(Evt)
{
    if (ConfTouch == 0)
    {
        if (MouseBtn != 0)
        {
            var _ = ScreenMouse.getBoundingClientRect();
            MouseUp(Evt.clientX + window.scrollX - _.left, Evt.clientY + window.scrollX - _.top, MouseBtn);
            MouseBtn = 0;
        }
    }
}

function MouseDown_0(Evt)
{
    if ((ConfTouch == 1) && (Evt.touches.length > 0))
    {
        document.getElementsByTagName("BODY")[0].className = "lock-screen";
        var _ = ScreenMouse.getBoundingClientRect();
        MouseBtn = 1;
        MouseX = Evt.touches[0].clientX + window.scrollX - _.left;
        MouseY = Evt.touches[0].clientY + window.scrollX - _.top;
        MouseDown(Evt.touches[0].clientX + window.scrollX - _.left, Evt.touches[0].clientY + window.scrollX - _.top, MouseBtn);
    }
}

function MouseMove_0(Evt)
{
    if ((ConfTouch == 1) && (Evt.touches.length > 0))
    {
        if (MouseBtn != 0)
        {
            var _ = ScreenMouse.getBoundingClientRect();
            MouseX = Evt.touches[0].clientX + window.scrollX - _.left;
            MouseY = Evt.touches[0].clientY + window.scrollX - _.top;
            MouseMove(Evt.touches[0].clientX + window.scrollX - _.left, Evt.touches[0].clientY + window.scrollX - _.top, MouseBtn);
        }
    }
}

function MouseUp_0(Evt)
{
    if ((ConfTouch == 1))
    {
        document.getElementsByTagName("BODY")[0].className = "";
        if (MouseBtn != 0)
        {
            var _ = ScreenMouse.getBoundingClientRect();
            MouseUp(MouseX, MouseY, MouseBtn);
            MouseBtn = 0;
        }
    }
}

function MouseInit()
{
    ScreenX = document.getElementById("Screen");
    ScreenMouse = document.getElementById("ScreenMouse");
    ScreenMouse.addEventListener("mousedown", MouseDown_);
    ScreenMouse.addEventListener("mousemove", MouseMove_);
    ScreenMouse.addEventListener("mouseup", MouseUp_);
    ScreenMouse.addEventListener("mouseout", MouseUp_);
    ScreenX.addEventListener("touchstart", MouseDown_0);
    ScreenX.addEventListener("touchmove", MouseMove_0);
    ScreenX.addEventListener("touchend", MouseUp_0);
    ScreenX.addEventListener("touchcancel", MouseUp_0);
}
