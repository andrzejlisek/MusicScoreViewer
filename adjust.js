function AdjustLimit(X, BoundL, BoundH)
{
    if (X < BoundL)
    {
        X = BoundL;
    }
    if (X > BoundH)
    {
        X = BoundH;
    }
    return X;
}

function AdjustVal(CtrlId, F, BoundL, BoundH)
{
    var X = document.getElementById(CtrlId).value;
    if (X)
    {
        if (isNaN(X))
        {
            return 0;
        }
        return AdjustLimit(X, BoundL, BoundH) / F;
    }
    return 0;
}

function AdjustPrompt(Msg, T, F, BoundL, BoundH)
{
    if (F > 0)
    {
        var X = Math.round(T * F);
        X = prompt(Msg + " (" + BoundL + "-" + BoundH + ")", X);
        if (X)
        {
            if (isNaN(X))
            {
                return T;
            }
            return AdjustLimit(X, BoundL, BoundH) / F;
        }
        else
        {
            return T;
        }
    }
    else
    {
        var Q = confirm(Msg + " (currently " + ((T == 0) ? "no" : "yes") + ")\nOK -> Yes\nCancel -> No");
        if (Q)
        {
            return 1;
        }
        else
        {
            return 0;
        }
    }
}

function Adjust(N)
{
    PedalAdjust = true;
    switch (AdjustMode)
    {
        case 1:
            {
                if (N < 0)
                {
                    ScaleN = AdjustPrompt("Resolution numerator", ScaleN, 1, 1, 1000000);
                    ScaleD = AdjustPrompt("Resolution denominator", ScaleD, 1, 1, 1000000);
                }
                if (N > 0)
                {
                    DispNotStretch = 1 - DispNotStretch;
                    DispNotStretch = AdjustPrompt("Stretch image?", DispNotStretch, 0, 0, 0);
                    DispNotStretch = 1 - DispNotStretch;
                }
                Scale = ScaleN / ScaleD;
            }
            break;
        case 2:
            {
                if (N == 0)
                {
                    CropL[0] = AdjustVal("CropL0", 100, 0, 99);
                    CropT[0] = AdjustVal("CropT0", 100, 0, 99);
                    CropR[0] = AdjustVal("CropR0", 100, 0, 99);
                    CropB[0] = AdjustVal("CropB0", 100, 0, 99);
                    CropL[1] = AdjustVal("CropL1", 100, 0, 99);
                    CropT[1] = AdjustVal("CropT1", 100, 0, 99);
                    CropR[1] = AdjustVal("CropR1", 100, 0, 99);
                    CropB[1] = AdjustVal("CropB1", 100, 0, 99);
                }
                if (N < 0)
                {
                    CropL[0] = AdjustPrompt("Left odd", CropL[0], 100, 0, 99);
                    CropT[0] = AdjustPrompt("Top odd", CropT[0], 100, 0, 99);
                    CropR[0] = AdjustPrompt("Right odd", CropR[0], 100, 0, 99);
                    CropB[0] = AdjustPrompt("Bottom odd", CropB[0], 100, 0, 99);
                }
                if (N > 0)
                {
                    CropL[1] = AdjustPrompt("Left even", CropL[1], 100, 0, 99);
                    CropT[1] = AdjustPrompt("Top even", CropT[1], 100, 0, 99);
                    CropR[1] = AdjustPrompt("Right even", CropR[1], 100, 0, 99);
                    CropB[1] = AdjustPrompt("Bottom even", CropB[1], 100, 0, 99);
                }
                if ((CropL[0] + CropR[0]) > 0.99)
                {
                    CropL[0] = 0;
                    CropR[0] = 0;
                }
                if ((CropT[0] + CropB[0]) > 0.99)
                {
                    CropT[0] = 0;
                    CropB[0] = 0;
                }
                if ((CropL[1] + CropR[1]) > 0.99)
                {
                    CropL[1] = 0;
                    CropR[1] = 0;
                }
                if ((CropT[1] + CropB[1]) > 0.99)
                {
                    CropT[1] = 0;
                    CropB[1] = 0;
                }
            }
            break;
        case 3:
            {
                if (N == 0)
                {
                    LevelsI1 = AdjustVal("LevelI1", 1, 0, 255);
                    LevelsI2 = AdjustVal("LevelI2", 1, 0, 255);
                    LevelsGamma = AdjustVal("LevelIG", 1, 100, 10000);
                    LevelsO1 = AdjustVal("LevelO1", 1, 0, 255);
                    LevelsO2 = AdjustVal("LevelO2", 1, 0, 255);
                }
                if (N < 0)
                {
                    LevelsI1 = AdjustPrompt("Input low", LevelsI1, 1, 0, 255);
                    LevelsI2 = AdjustPrompt("Input high", LevelsI2, 1, 0, 255);
                    LevelsGamma = AdjustPrompt("Input gamma", LevelsGamma, 1, 100, 10000);
                }
                if (N > 0)
                {
                    LevelsO1 = AdjustPrompt("Output low", LevelsO1, 1, 0, 255);
                    LevelsO2 = AdjustPrompt("Output high", LevelsO2, 1, 0, 255);
                }
                LevelsGenerate();
            }
            break;
        case 4:
            {
                ScreenInfoSetColor(1);
                PageRendering = true;
                setTimeout(function(){ DownloadWork(N); }, 10);
                return;
            }
    }
    PedalAdjust = false;
    PedalKeyboardClear();
    AdjustSave();
    if (N != 0)
    {
        CanvasBuf = [];
        DisplayRefresh();
    }
}

function DownloadFinish()
{
    PageRendering = false;
    PedalAdjust = false;
    PedalKeyboardClear();
    ScreenInfoSetColor(0);
}

function DownloadWork(N)
{
    DownloadState = 0;
    if (N != 0)
    {
        if (confirm("Save all buffered pages?"))
        {
            DownloadPageNo = 1;
            DownloadPageNext = true;
            DownloadPage();
        }
        else
        {
            if (N < 0)
            {
                DownloadPageNo = PageCalcDisp(1);
                DownloadPageNext = false;
                DownloadPage();
            }
            if (N > 0)
            {
                DownloadPageNo = PageCalcDisp(2);
                DownloadPageNext = false;
                DownloadPage();
            }
        }
    }
}

var DownloadState = 0;
var DownloadPageNext = false;
var DownloadPageNo = 0;

function DownloadPage()
{
    if (DownloadState == 1)
    {
        setTimeout(function(){ DownloadPage(); }, 10);
    }

    if ((DownloadPageNo < 1) || (DownloadPageNo > PageCount))
    {
        return;
    }
    if (DownloadState == 0)
    {
        if (CanvasBuf[DownloadPageNo])
        {
            DownloadState = 1;
            CanvasBuf[DownloadPageNo].toBlob(DownloadPageBlob, "image/png", 1);
        }
        else
        {
            if (DownloadPageNext)
            {
                DownloadPageNo = DownloadPageNo + 1;
                if (DownloadPageNo <= PageCount)
                {
                    setTimeout(function(){ DownloadPage(); }, 10);
                }
                else
                {
                    DownloadFinish();
                }
            }
            else
            {
                DownloadFinish();
            }
        }
    }
}

function DownloadPageBlob(Data)
{
    var ALink = document.getElementById("TempLink");
    if (SaveImageMode == 0)
    {
        ALink.download = "Page" + PageText(DownloadPageNo) + ".png";
    }
    else
    {
        ALink.download = "X";
        ALink.removeAttribute("download");
    }
    ALink.href = URL.createObjectURL(Data);
    ALink.click();
    DownloadPageNo = DownloadPageNo + 1;
    DownloadState = 0;
    if (DownloadPageNext)
    {
        if (DownloadPageNo <= PageCount)
        {
            setTimeout(function(){ DownloadPage(); }, 10);
        }
        else
        {
            DownloadFinish();
        }
    }
    else
    {
        DownloadFinish();
    }
}

var AdjustPrefix = "MusicScoreViewer_";
var AdjustKey = "";
var AdjustLS = "";

function AdjustLoad(Key)
{
    if (Key)
    {
        if (Key != "")
        {
            AdjustKey = Key;
            AdjustLS = AdjustPrefix + AdjustKey + "_";
            
            document.getElementById("PageScaleN").value             = DataGetIDefault(AdjustLS + "PageScaleN",     document.getElementById("PageScaleN").value);
            document.getElementById("PageScaleD").value             = DataGetIDefault(AdjustLS + "PageScaleD",     document.getElementById("PageScaleD").value);
            document.getElementById("DispNotStretch").selectedIndex = DataGetIDefault(AdjustLS + "DispNotStretch", document.getElementById("DispNotStretch").selectedIndex);
            
            document.getElementById("CropL0").value = DataGetIDefault(AdjustLS + "CropL0", document.getElementById("CropL0").value)
            document.getElementById("CropT0").value = DataGetIDefault(AdjustLS + "CropT0", document.getElementById("CropT0").value);
            document.getElementById("CropR0").value = DataGetIDefault(AdjustLS + "CropR0", document.getElementById("CropR0").value);
            document.getElementById("CropB0").value = DataGetIDefault(AdjustLS + "CropB0", document.getElementById("CropB0").value);
            document.getElementById("CropL1").value = DataGetIDefault(AdjustLS + "CropL1", document.getElementById("CropL1").value);
            document.getElementById("CropT1").value = DataGetIDefault(AdjustLS + "CropT1", document.getElementById("CropT1").value);
            document.getElementById("CropR1").value = DataGetIDefault(AdjustLS + "CropR1", document.getElementById("CropR1").value);
            document.getElementById("CropB1").value = DataGetIDefault(AdjustLS + "CropB1", document.getElementById("CropB1").value);

            document.getElementById("LevelI1").value = DataGetIDefault(AdjustLS + "LevelI1", document.getElementById("LevelI1").value);
            document.getElementById("LevelI2").value = DataGetIDefault(AdjustLS + "LevelI2", document.getElementById("LevelI2").value);
            document.getElementById("LevelIG").value = DataGetIDefault(AdjustLS + "LevelIG", document.getElementById("LevelIG").value);
            document.getElementById("LevelO1").value = DataGetIDefault(AdjustLS + "LevelO1", document.getElementById("LevelO1").value);
            document.getElementById("LevelO2").value = DataGetIDefault(AdjustLS + "LevelO2", document.getElementById("LevelO2").value);
        }
    }
}

function AdjustSave()
{
    if (AdjustKey)
    {
        if (AdjustKey != "")
        {
            DataSetI(AdjustLS + "PageScaleN",     ScaleN);
            DataSetI(AdjustLS + "PageScaleD",     ScaleD);
            DataSetI(AdjustLS + "DispNotStretch", DispNotStretch);
        
            DataSetI(AdjustLS + "CropL0", Math.round(CropL[0] * 100));
            DataSetI(AdjustLS + "CropT0", Math.round(CropT[0] * 100));
            DataSetI(AdjustLS + "CropR0", Math.round(CropR[0] * 100));
            DataSetI(AdjustLS + "CropB0", Math.round(CropB[0] * 100));
            DataSetI(AdjustLS + "CropL1", Math.round(CropL[1] * 100));
            DataSetI(AdjustLS + "CropT1", Math.round(CropT[1] * 100));
            DataSetI(AdjustLS + "CropR1", Math.round(CropR[1] * 100));
            DataSetI(AdjustLS + "CropB1", Math.round(CropB[1] * 100));

            DataSetI(AdjustLS + "LevelI1", LevelsI1);
            DataSetI(AdjustLS + "LevelI2", LevelsI2);
            DataSetI(AdjustLS + "LevelIG", LevelsGamma);
            DataSetI(AdjustLS + "LevelO1", LevelsO1);
            DataSetI(AdjustLS + "LevelO2", LevelsO2);
        }
    }
}

function SettingsLoad()
{
    if (navigator.maxTouchPoints > 0)
    {
        document.getElementById("TouchScreen").selectedIndex = 1;
    }
    else
    {
        document.getElementById("TouchScreen").selectedIndex = 0;
    }


    document.getElementById("ScreenInfoDisplay").selectedIndex     = DataGetIDefault(AdjustPrefix + "_ScreenInfoDisplay",     document.getElementById("ScreenInfoDisplay").selectedIndex);
    document.getElementById("ScreenInfoOrientation").selectedIndex = DataGetIDefault(AdjustPrefix + "_ScreenInfoOrientation", document.getElementById("ScreenInfoOrientation").selectedIndex);
    document.getElementById("ScreenInfoSize").value                = DataGetIDefault(AdjustPrefix + "_ScreenInfoSize",        document.getElementById("ScreenInfoSize").value);
    document.getElementById("ScreenInfoColor").selectedIndex       = DataGetIDefault(AdjustPrefix + "_ScreenInfoColor",       document.getElementById("ScreenInfoColor").selectedIndex);

    document.getElementById("SaveImageMode").selectedIndex = DataGetIDefault(AdjustPrefix + "_SaveImageMode", document.getElementById("SaveImageMode").selectedIndex);

    document.getElementById("TouchScreen").selectedIndex   = DataGetIDefault(AdjustPrefix + "_TouchScreen",   document.getElementById("TouchScreen").selectedIndex);
    document.getElementById("DisplayMode").selectedIndex   = DataGetIDefault(AdjustPrefix + "_DisplayMode",   document.getElementById("DisplayMode").selectedIndex);
    document.getElementById("DisplayLayout").selectedIndex = DataGetIDefault(AdjustPrefix + "_DisplayLayout", document.getElementById("DisplayLayout").selectedIndex);
    document.getElementById("Orientation").selectedIndex   = DataGetIDefault(AdjustPrefix + "_Orientation",   document.getElementById("Orientation").selectedIndex);
    document.getElementById("SwitchMode").selectedIndex    = DataGetIDefault(AdjustPrefix + "_SwitchMode",    document.getElementById("SwitchMode").selectedIndex);
    document.getElementById("AdjustArea").value            = DataGetIDefault(AdjustPrefix + "_AdjustArea",    document.getElementById("AdjustArea").value);
    
    document.getElementById("PedalMouseL").selectedIndex   = DataGetIDefault(AdjustPrefix + "_PedalMouseL",   document.getElementById("PedalMouseL").value);
    document.getElementById("PedalMouseR").selectedIndex   = DataGetIDefault(AdjustPrefix + "_PedalMouseR",   document.getElementById("PedalMouseR").value);
    document.getElementById("PedalMouseM").selectedIndex   = DataGetIDefault(AdjustPrefix + "_PedalMouseM",   document.getElementById("PedalMouseM").value);
    document.getElementById("PedalKey1").selectedIndex     = DataGetIDefault(AdjustPrefix + "_PedalKey1",     document.getElementById("PedalKey1").value);
    document.getElementById("PedalKey2").selectedIndex     = DataGetIDefault(AdjustPrefix + "_PedalKey2",     document.getElementById("PedalKey2").value);
    document.getElementById("PedalKey3").selectedIndex     = DataGetIDefault(AdjustPrefix + "_PedalKey3",     document.getElementById("PedalKey3").value);
    PreviewUpdate();
}

function SettingsSave()
{
    DataSetI(AdjustPrefix + "_ScreenInfoDisplay",     document.getElementById("ScreenInfoDisplay").selectedIndex);
    DataSetI(AdjustPrefix + "_ScreenInfoOrientation", document.getElementById("ScreenInfoOrientation").selectedIndex);
    DataSetI(AdjustPrefix + "_ScreenInfoSize",        document.getElementById("ScreenInfoSize").value);
    DataSetI(AdjustPrefix + "_ScreenInfoColor",       document.getElementById("ScreenInfoColor").selectedIndex);

    DataSetI(AdjustPrefix + "_SaveImageMode", document.getElementById("SaveImageMode").selectedIndex);

    DataSetI(AdjustPrefix + "_TouchScreen",   document.getElementById("TouchScreen").selectedIndex);
    DataSetI(AdjustPrefix + "_DisplayMode",   document.getElementById("DisplayMode").selectedIndex);
    DataSetI(AdjustPrefix + "_DisplayLayout", document.getElementById("DisplayLayout").selectedIndex);
    DataSetI(AdjustPrefix + "_Orientation",   document.getElementById("Orientation").selectedIndex);
    DataSetI(AdjustPrefix + "_SwitchMode",    document.getElementById("SwitchMode").selectedIndex);
    DataSetI(AdjustPrefix + "_AdjustArea",    document.getElementById("AdjustArea").value);

    DataSetI(AdjustPrefix + "_PedalMouseL",   document.getElementById("PedalMouseL").selectedIndex);
    DataSetI(AdjustPrefix + "_PedalMouseR",   document.getElementById("PedalMouseR").selectedIndex);
    DataSetI(AdjustPrefix + "_PedalMouseM",   document.getElementById("PedalMouseM").selectedIndex);
    DataSetI(AdjustPrefix + "_PedalKey1",     document.getElementById("PedalKey1").selectedIndex);
    DataSetI(AdjustPrefix + "_PedalKey2",     document.getElementById("PedalKey2").selectedIndex);
    DataSetI(AdjustPrefix + "_PedalKey3",     document.getElementById("PedalKey3").selectedIndex);
}

function ToggleFullScreen()
{
    var VideoElement = document.getElementById("ParamCtrl");
    if (!document.mozFullScreen && !document.webkitIsFullScreen && !document.fullscreen)
    {
        if (VideoElement.mozRequestFullScreen)
        {
            VideoElement.mozRequestFullScreen();
        }
        else
        {
            if (VideoElement.webkitRequestFullScreen)
            {
                VideoElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            }
            else
            {
                if (VideoElement.requestFullscreen)
                {
                    VideoElement.requestFullscreen();
                }
            }
        }
    }
    else
    {
        if (document.mozCancelFullScreen)
        {
            document.mozCancelFullScreen();
        }
        else
        {
            if (document.webkitCancelFullScreen)
            {
                document.webkitCancelFullScreen();
            }
            else
            {
                if (document.exitFullscreen)
                {
                    document.exitFullscreen();
                }
            }
        }
    }
}

