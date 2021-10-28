var PreviewTable;


function PreviewInit()
{
    PreviewTable = document.getElementById("LayoutPreview");
    PreviewUpdate();
    for (var Y = 0; Y < 4; Y++)
    {
        for (var X = 0; X < 4; X++)
        {
            PreviewTable.rows[Y].cells[X].style["font-family"] = "monospace";
        }
    }
}

function PreviewUpdate()
{
    DispMode = document.getElementById("DisplayMode").selectedIndex;
    PageLayout = document.getElementById("DisplayLayout").selectedIndex;
    PageSwitch = document.getElementById("SwitchMode").selectedIndex;
    PageOrientation = document.getElementById("Orientation").selectedIndex;

    ScreenInfoDisplay = document.getElementById("ScreenInfoDisplay").selectedIndex;
    ScreenInfoOrientation = document.getElementById("ScreenInfoOrientation").selectedIndex;
    ScreenInfoSize = document.getElementById("ScreenInfoSize").value;
    ScreenInfoColor = document.getElementById("ScreenInfoColor").selectedIndex;
    DispNotStretch = document.getElementById("DispNotStretch").selectedIndex;


    var Space1 = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>";
    var Space2 = "<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    for (var Y = 0; Y < 4; Y++)
    {
        for (var X = 0; X < 4; X++)
        {
            PreviewTable.rows[Y].cells[X].style["background-color"] = "#000000";
            PreviewTable.rows[Y].cells[X].style["border-top"] = "1px solid black";
            PreviewTable.rows[Y].cells[X].style["border-bottom"] = "1px solid black";
            PreviewTable.rows[Y].cells[X].style["border-left"] = "1px solid black";
            PreviewTable.rows[Y].cells[X].style["border-right"] = "1px solid black";
            PreviewTable.rows[Y].cells[X].style["color"] = "white";
            PreviewTable.rows[Y].cells[X].innerHTML = Space1 + "" + Space2;
        }
    }

    var PageColor = "#E0E0E0";
    var X1 = 1;
    var X2 = 2;
    var Y1 = 1;
    var Y2 = 2;

    if (DispMode > 0)
    {
        if ((PageLayout == 0) || (PageLayout == 2))
        {
            X1 = 0;
            X2 = 3;
        }
        else
        {
            Y1 = 0;
            Y2 = 3;
        }
    }

    var Arrow = ["&#x2191;", "&#x2192;", "&#x2193;", "&#x2190;", "&#x21C8;", "&#x21C9;", "&#x21CA;", "&#x21C7;"];

    for (var Y = Y1; Y <= Y2; Y++)
    {
        for (var X = X1; X <= X2; X++)
        {
            PreviewTable.rows[Y].cells[X].style["background-color"] = PageColor;
            PreviewTable.rows[Y].cells[X].style["border-top"] = "1px solid " + PageColor;
            PreviewTable.rows[Y].cells[X].style["border-bottom"] = "1px solid " + PageColor;
            PreviewTable.rows[Y].cells[X].style["border-left"] = "1px solid " + PageColor;
            PreviewTable.rows[Y].cells[X].style["border-right"] = "1px solid " + PageColor;
            PreviewTable.rows[Y].cells[X].style["color"] = "black";
            var ArrowX = 0;
            if ((DispMode == 1) || (DispMode == 3))
            {
                if ((PageLayout == 0) && (X < 2)) { ArrowX = 4; }
                if ((PageLayout == 1) && (Y < 2)) { ArrowX = 4; }
                if ((PageLayout == 2) && (X > 1)) { ArrowX = 4; }
                if ((PageLayout == 3) && (Y > 1)) { ArrowX = 4; }
            }
            if ((DispMode == 2) || (DispMode == 4))
            {
                if ((PageLayout == 0) && (X > 1)) { ArrowX = 4; }
                if ((PageLayout == 1) && (Y > 1)) { ArrowX = 4; }
                if ((PageLayout == 2) && (X < 2)) { ArrowX = 4; }
                if ((PageLayout == 3) && (Y < 2)) { ArrowX = 4; }
            }
            PreviewTable.rows[Y].cells[X].innerHTML = Space1 + Arrow[(PageOrientation % 4) + ArrowX] + Space2;
        }
    }

    PreviewTable.rows[0].cells[0].style["color"] = "white";
    PreviewTable.rows[0].cells[3].style["color"] = "white";
    PreviewTable.rows[3].cells[0].style["color"] = "white";
    PreviewTable.rows[3].cells[3].style["color"] = "white";

    
    for (var I = 0; I < 4; I++)
    {
        PreviewTable.rows[0].cells[I].style["border-top"] = "1px solid white";
        PreviewTable.rows[2].cells[I].style["border-top"] = "1px solid white";
        PreviewTable.rows[1].cells[I].style["border-bottom"] = "1px solid white";
        PreviewTable.rows[3].cells[I].style["border-bottom"] = "1px solid white";

        PreviewTable.rows[I].cells[0].style["border-left"] = "1px solid white";
        PreviewTable.rows[I].cells[2].style["border-left"] = "1px solid white";
        PreviewTable.rows[I].cells[1].style["border-right"] = "1px solid white";
        PreviewTable.rows[I].cells[3].style["border-right"] = "1px solid white";
    }
    
    var RotL = "&#x21BA;";
    var RotR = "&#x21BB;";
    
    var PageNum = ["A", "B", "C", "D"];
    var Func = ["-10", "+10", "-1", "+1"];


    switch (PageSwitch)
    {
        case 0: PageNum = [Func[0], Func[1], Func[2], Func[3]]; break;
        case 1: PageNum = [Func[2], Func[3], Func[0], Func[1]]; break;
        case 2: PageNum = [Func[0], Func[2], Func[1], Func[3]]; break;
        case 3: PageNum = [Func[2], Func[0], Func[3], Func[1]]; break;
        case 4: PageNum = [Func[1], Func[0], Func[3], Func[2]]; break;
        case 5: PageNum = [Func[3], Func[2], Func[1], Func[0]]; break;
        case 6: PageNum = [Func[1], Func[3], Func[0], Func[2]]; break;
        case 7: PageNum = [Func[3], Func[1], Func[2], Func[0]]; break;
    }

    PreviewTable.rows[0].cells[0].innerHTML = Space1 + PageNum[0] + Space2;
    PreviewTable.rows[0].cells[3].innerHTML = Space1 + PageNum[1] + Space2;
    PreviewTable.rows[3].cells[0].innerHTML = Space1 + PageNum[2] + Space2;
    PreviewTable.rows[3].cells[3].innerHTML = Space1 + PageNum[3] + Space2;
}

