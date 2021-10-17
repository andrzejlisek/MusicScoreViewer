"use strict";

var pdfDoc = null;
var scale = 1;
var PageNum = 1;
var PageCount = 1;
var PageRendering = false;

var Canvas = [];
var CanvasCtx = [];

var PageOrientation = 0;
var PageLayout = 0;
var PageSwitch = 0;


var AdjustMode = 0;
var AdjustArea = 0;


var CropL = [0.0, 0.0];
var CropT = [0.0, 0.0];
var CropR = [0.0, 0.0];
var CropB = [0.0, 0.0];

var LevelsI1 = 0;
var LevelsI2 = 255;
var LevelsO1 = 0;
var LevelsO2 = 255;
var LevelsGamma = 1000;


var DispMode = 0;
var DispBufSize = 6;

var DispPointer1 = 0;
var DispPointer2 = 0;
var DispPage;
var DispLoaded;
var DispFirst = true;

var ScreenObj;
var ScreenW = 100;
var ScreenH = 100;


var CanvasBuf = [];

var PaintLevels = [];
var PaintThreshold = [];

function LevelsGenerate()
{
    for (var I = 0; I < 256; I++)
    {
        var ValI = I / 255.0;
        ValI = Math.pow(ValI, 1000 / LevelsGamma);
        ValI = ValI * 255.0;
        var A = (LevelsO2 - LevelsO1) / (LevelsI2 - LevelsI1);
        var B = LevelsO1 - LevelsI1 * A;
        var ValX = Math.round(ValI * A + B);
        if (ValX < 0)
        {
            ValX = 0;
        }
        if (ValX > 255)
        {
            ValX = 255;
        }
        PaintLevels[I] = ValX;
        if (I >= 128)
        {
            PaintThreshold[I] = 0;
        }
        else
        {
            PaintThreshold[I] = 255;
        }
    }
}        
        
function LoadPdf(data)
{
    document.getElementById('ParamCtrl').style.display = "none";
    AdjustArea = document.getElementById('AdjustArea').value;
    
    SettingsSave();    
    AdjustMode = 1;
    Adjust(0);
    AdjustMode = 2;
    Adjust(0);
    AdjustMode = 0;
    PedalSet();
    LevelsGenerate();

    ScreenObj = document.getElementById('Screen');
    if (document.getElementById('TouchScreen').selectedIndex == 1)
    {
        ConfTouch = 1;
    }
    else
    {
        ConfTouch = 0;
    }
    
    ScreenObj.style["width"] = ScreenW + "px";
    ScreenObj.style["height"] = ScreenH + "px";
    CanvasBuf = [];

    //var url = {data: atob(data.replace(/\r\n/g,""))};
    var url = {data: data};
    
    scale = parseFloat(document.getElementById('PageScale').value);
    DispPage = [];
    DispLoaded = [];
    PageNum = 1;
    switch (DispMode)
    {
        case 0:
            DispPointer1 = 1;
            DispPointer2 = 1;
            break;
        case 1:
        case 3:
            DispPointer1 = 0;
            DispPointer2 = 1;
            PageNum = 0;
            break;
        case 2:
        case 4:
            DispPointer1 = 1;
            DispPointer2 = 2;
            break;
    }
    for (var I = 0; I < DispBufSize; I++)
    {
        Canvas[I] = document.getElementById('Screen' + I);
        CanvasCtx[I] = Canvas[I].getContext('2d');
        if (I >= 5)
        {
            DispPage.push(-1);
        }
        else
        {
            DispPage.push(I);
        }
        DispLoaded.push(false);
    }
    
    // Loaded via <script> tag, create shortcut to access PDF.js exports.
    var pdfjsLib = window['pdfjs-dist/build/pdf'];

    // The workerSrc property shall be specified.
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf.worker.js';


    pdfjsLib.getDocument(url).promise.then(function (pdfDoc_)
    {
        pdfDoc = pdfDoc_;
        PageCount = pdfDoc.numPages;
        PedalKeyboardClear();

        // Initial/first page rendering
        DisplayRefresh();
        PedalKeyDisabled = false;
    });
}

function DisplayRefresh()
{
    for (var I = 0; I < DispBufSize; I++)
    {
        DispLoaded[I] = false;
    }
    DispFirst = true;
    DisplayPages();
}

function DisplayVisible(N, V)
{
    var PageSepSize = 1;
    var FitHeight = true;
    var ScreenW_ = ScreenW;
    var ScreenH_ = ScreenH;
    var DispNotInverse = true;
    
    if (DispMode > 0)
    {
        if ((PageLayout == 0) || (PageLayout == 2))
        {
            ScreenW_ = Math.floor(ScreenW_ / 2) - PageSepSize;
        }
        else
        {
            ScreenH_ = Math.floor(ScreenH_ / 2) - PageSepSize;
        }
        if ((DispMode % 2) == 1)
        {
            if ((PageNum % 2) == 1)
            {
                DispNotInverse = false;
            }
        }
        else
        {
            if ((PageNum % 2) == 0)
            {
                DispNotInverse = false;
            }
        }
        if (PageLayout > 1)
        {
            DispNotInverse = !DispNotInverse;
        }
    }

    var CanvasW = ScreenW_;
    var CanvasH = ScreenH_;
    var CanvasX = 0;
    var CanvasY = 0;

    if ((Canvas[N].width / Canvas[N].height) > (ScreenW_ / ScreenH_))
    {
        FitHeight = false;
    }
    
    if (FitHeight)
    {
        CanvasW = Math.floor((CanvasH * Canvas[N].width) / Canvas[N].height);
        CanvasX = Math.round((ScreenW_ - CanvasW) / 2);
    }
    else
    {
        CanvasH = Math.floor((CanvasW * Canvas[N].height) / Canvas[N].width);
        CanvasY = Math.round((ScreenH_ - CanvasH) / 2);
    }

    if (DispMode > 0)
    {
        if ((PageLayout == 0) || (PageLayout == 2))
        {
            if (DispNotInverse)
            {
                if (N == DispPointer1)
                {
                    CanvasX = ScreenW_ - CanvasW - PageSepSize;
                }
                if (N == DispPointer2)
                {
                    CanvasX = ScreenW_ + PageSepSize;
                }
            }
            else
            {
                if (N == DispPointer2)
                {
                    CanvasX = ScreenW_ - CanvasW - PageSepSize;
                }
                if (N == DispPointer1)
                {
                    CanvasX = ScreenW_ + PageSepSize;
                }
            }
        }
        else
        {
            if (DispNotInverse)
            {
                if (N == DispPointer1)
                {
                    CanvasY = ScreenH_ - CanvasH - PageSepSize;
                }
                if (N == DispPointer2)
                {
                    CanvasY = ScreenH_ + PageSepSize;
                }
            }
            else
            {
                if (N == DispPointer2)
                {
                    CanvasY = ScreenH_ - CanvasH - PageSepSize;
                }
                if (N == DispPointer1)
                {
                    CanvasY = ScreenH_ + PageSepSize;
                }
            }
        }
    }


    if (V)
    {
        Canvas[N].style["left"] = CanvasX + "px";
        Canvas[N].style["top"] = CanvasY + "px";
        Canvas[N].style["width"] = CanvasW + "px";
        Canvas[N].style["height"] = CanvasH + "px";
        Canvas[N].style["display"] = "block";
    }
    else
    {
        Canvas[N].style["left"] = "0px";
        Canvas[N].style["top"] = "0px";
        Canvas[N].style["width"] = "10px";
        Canvas[N].style["height"] = "10px";
        Canvas[N].style["display"] = "none";
    }
}

function DispPointerMod(DispPointer)
{
    if (DispPointer < 0)
    {
        return DispPointer + DispBufSize;
    }
    if (DispPointer >= DispBufSize)
    {
        return DispPointer - DispBufSize;
    }
    return DispPointer;
}

var DisplayCanvasColor = true;


function DisplayCanvas()
{
    ScreenUpdateLayout();
    if (DisplayCanvasColor)
    {
        ScreenObj.style["background-color"] = "#000000";
        DisplayCanvasColor = false;
    }
    else
    {
        ScreenObj.style["background-color"] = "#000001";
        DisplayCanvasColor = true;
    }

    if (DispPointer1 < 0)
    {
        DispPointer1 += DispBufSize;
    }
    if (DispPointer2 < 0)
    {
        DispPointer2 += DispBufSize;
    }
    if (DispPointer1 >= DispBufSize)
    {
        DispPointer1 -= DispBufSize;
    }
    if (DispPointer2 >= DispBufSize)
    {
        DispPointer2 -= DispBufSize;
    }
    
    for (var I = -2; I <= 3; I++)
    {
        if (DispPage[DispPointerMod(DispPointer1 + I)] != (PageNum + I))
        {
            DispPage[DispPointerMod(DispPointer1 + I)] = (PageNum + I);
            DispLoaded[DispPointerMod(DispPointer1 + I)] = false;
        }
    }
    
    for (var I = 0; I < DispBufSize; I++)
    {
        if ((I == DispPointer1) || (I == DispPointer2))
        {
            DisplayVisible(I, true);
        }
        else
        {
            DisplayVisible(I, false);
        }
    }
}

function DisplayPages()
{
    for (var I = 0; I < DispBufSize; I++)
    {
        if (!DispLoaded[I])
        {
            DispLoaded[I] = true;
            RenderPage(DispPage[I], I);
            return;
        }
    }
    PageRendering = false;
    if (DispFirst)
    {
        DisplayCanvas();
        DispFirst = false;
    }
}

function CanvasCopy(CSrc, CDst)
{
    if (!CDst)
    {
        CDst = document.createElement('canvas');
    }
    CDst.width = CSrc.width;
    CDst.height = CSrc.height;
    CDst.getContext('2d').drawImage(CSrc, 0, 0);
    return CDst;
}


function RenderPagePaint()
{
    DisplayPages();
}

function RenderPage(num, ScrNum)
{
    if ((num < 1) || (num > PageCount))
    {
        Canvas[ScrNum].width = 1;
        Canvas[ScrNum].height = 1;
        CanvasCtx[ScrNum].fillStyle = 'black';
        CanvasCtx[ScrNum].fillRect(0, 0, 11, 11);        
        setTimeout(function(){ DisplayPages(); }, 10);
        return;
    }
    
    if (CanvasBuf[num])
    {
        CanvasCopy(CanvasBuf[num], Canvas[ScrNum]);
        RenderPagePaint();
    }
    else
    {
        // Using promise to fetch the page
        pdfDoc.getPage(num).then(function (page)
        {
            var CropN = ((num + 1) % 2);
            var CropL_ = 0;
            var CropT_ = 0;
            var CropR_ = 0;
            var CropB_ = 0;
            switch (PageOrientation)
            {
                case 0:
                    CropL_ = CropL[CropN];
                    CropT_ = CropT[CropN];
                    CropR_ = CropR[CropN];
                    CropB_ = CropB[CropN];
                    break;
                case 1:
                    CropL_ = CropB[CropN];
                    CropT_ = CropL[CropN];
                    CropR_ = CropT[CropN];
                    CropB_ = CropR[CropN];
                    break;
                case 2:
                    CropL_ = CropR[CropN];
                    CropT_ = CropB[CropN];
                    CropR_ = CropL[CropN];
                    CropB_ = CropT[CropN];
                    break;
                case 3:
                    CropL_ = CropT[CropN];
                    CropT_ = CropR[CropN];
                    CropR_ = CropB[CropN];
                    CropB_ = CropL[CropN];
                    break;
            }

            var viewport = null;
            switch (PageOrientation)
            {
                case 0: viewport = page.getViewport({ scale: scale, rotation: 0   }); break;
                case 1: viewport = page.getViewport({ scale: scale, rotation: 90  }); break;
                case 2: viewport = page.getViewport({ scale: scale, rotation: 180 }); break;
                case 3: viewport = page.getViewport({ scale: scale, rotation: 270 }); break;
            }
            
            var CanvasW_ = Math.floor(viewport.width * (1.0 - (CropL_ + CropR_)));
            var CanvasH_ = Math.floor(viewport.height * (1.0 - (CropT_ + CropB_)));
            Canvas[ScrNum].width = CanvasW_;
            Canvas[ScrNum].height = CanvasH_;
            
            var TranslateX = 0 - (viewport.width * CropL_);
            var TranslateY = 0 - (viewport.height * CropT_);

            // Render PDF page into canvas context
            var renderContext = {
                canvasContext: CanvasCtx[ScrNum],
                transform: [1, 0, 0, 1, TranslateX, TranslateY],
                viewport: viewport
            };
            var renderTask = page.render(renderContext);

            // Wait for rendering to finish
            renderTask.promise.then(function ()
            {
                var Temp = CanvasCtx[ScrNum].getImageData(0, 0, CanvasW_, CanvasH_);
                var P = 0;
                for (var Y = 0; Y < CanvasH_; Y++)
                {
                    for (var X = 0; X < CanvasW_; X++)
                    {
                        Temp.data[P + 0] = PaintLevels[Temp.data[P + 0]];
                        Temp.data[P + 1] = PaintLevels[Temp.data[P + 1]];
                        Temp.data[P + 2] = PaintLevels[Temp.data[P + 2]];
                        P += 4;
                    }
                }
                if (AdjustMode == 1)
                {
                    var PT = [];
                    var PTL = 0;
                    for (var I = 0; I < 9; I++)
                    {
                        var Pointer = Math.round(((viewport.width * (I + 1)) / 10.0) + TranslateX);
                        if (((Pointer - 1) >= 0) && ((Pointer - 1) < CanvasW_)) { PT.push((Pointer - 1) * 4); PTL++; }
                        if (((Pointer + 0) >= 0) && ((Pointer + 0) < CanvasW_)) { PT.push((Pointer + 0) * 4); PTL++; }
                        if (((Pointer + 1) >= 0) && ((Pointer + 1) < CanvasW_)) { PT.push((Pointer + 1) * 4); PTL++; }
                    }
                    for (var Y = 0; Y < CanvasH_; Y++)
                    {
                        for (var I = 0; I < PTL; I++)
                        {
                            Temp.data[PT[I] + 0] = PaintThreshold[Temp.data[PT[I] + 0]];
                            Temp.data[PT[I] + 1] = PaintThreshold[Temp.data[PT[I] + 1]];
                            Temp.data[PT[I] + 2] = PaintThreshold[Temp.data[PT[I] + 2]];
                            PT[I] += (CanvasW_ * 4);
                        }
                    }
                    PT = [];
                    PTL = 0;
                    for (var I = 0; I < 9; I++)
                    {
                        var Pointer = Math.round(((viewport.height * (I + 1)) / 10.0) + TranslateY);
                        if (((Pointer - 1) >= 0) && ((Pointer - 1) < CanvasH_)) { PT.push(((Pointer - 1) * 4 * CanvasW_)); PTL++; }
                        if (((Pointer + 0) >= 0) && ((Pointer + 0) < CanvasH_)) { PT.push(((Pointer + 0) * 4 * CanvasW_)); PTL++; }
                        if (((Pointer + 1) >= 0) && ((Pointer + 1) < CanvasH_)) { PT.push(((Pointer + 1) * 4 * CanvasW_)); PTL++; }
                    }
                    for (var Y = 0; Y < CanvasW_; Y++)
                    {
                        for (var I = 0; I < PTL; I++)
                        {
                            Temp.data[PT[I] + 0] = PaintThreshold[Temp.data[PT[I] + 0]];
                            Temp.data[PT[I] + 1] = PaintThreshold[Temp.data[PT[I] + 1]];
                            Temp.data[PT[I] + 2] = PaintThreshold[Temp.data[PT[I] + 2]];
                            PT[I] += 4;
                        }
                    }
                }
                CanvasCtx[ScrNum].putImageData(Temp, 0, 0);
                CanvasBuf[num] = CanvasCopy(Canvas[ScrNum], null);
                RenderPagePaint();
            });
        });
    }
}

function SwitchPage(N)
{
    if (PageRendering)
    {
        return;
    }
    if ((N < -1) || (N > 1))
    {
        if (AdjustMode > 0)
        {
            Adjust(N);
            PedalKeyboardClear();
            return;
        }
        DispFirst = true;
    }
    while (N < 0)
    {
        var Allow = false;
        if ((DispMode == 1) && (PageNum > 0))
        {
            Allow = true;
        }
        if (PageNum > 1)
        {
            Allow = true;
        }
        if (Allow)
        {
            if ((DispMode == 3) || (DispMode == 4))
            {
                if (!DispFirst)
                {
                    DispPointer1 -= 2;
                    DispPointer2 -= 2;
                }
                PageNum -= 2;
            }
            else
            {
                if (!DispFirst)
                {
                    DispPointer1--;
                    DispPointer2--;
                }
                PageNum--;
            }
        }
        N++;
    }
    while (N > 0)
    {
        var Allow = false;
        switch (DispMode)
        {
            case 0:
                if (PageNum < PageCount) { Allow = true; }
                break;
            case 1:
            case 3:
                if (PageNum < (PageCount - (PageCount % 2))) { Allow = true; }
                break;
            case 2:
            case 4:
                if (PageNum < (PageCount - (1 - (PageCount % 2)))) { Allow = true; }
                break;
        }
        if (Allow)
        {
            if ((DispMode == 3) || (DispMode == 4))
            {
                if (!DispFirst)
                {
                    DispPointer1 += 2;
                    DispPointer2 += 2;
                }
                PageNum += 2;
            }
            else
            {
                if (!DispFirst)
                {
                    DispPointer1++;
                    DispPointer2++;
                }
                PageNum++;
            }
        }
        N--;
    }
    PageRendering = true;
    DisplayCanvas();
    setTimeout(function(){ DisplayPages(); }, 10);
}

function ScreenUpdateLayout()
{
    ScreenW = document.documentElement.clientWidth;
    ScreenH = document.documentElement.clientHeight;
    ScreenObj.style.display = "";
    ScreenObj.style.left = "0px";
    ScreenObj.style.top = "0px";
    ScreenObj.style.position = "fixed";

    ScreenObj.style.width = ScreenW + "px";
    ScreenObj.style.height = ScreenH + "px";
}

function ScreenSwitchAdjust()
{
    PedalAdjust = true;
    AdjustMode++;
    if (AdjustMode == 3)
    {
        AdjustMode = 0;
    }
    switch (AdjustMode)
    {
        case 0: alert("Ten pages"); break;
        case 1: alert("Crop"); break;
        case 2: alert("Levels"); break;
    }
    PedalAdjust = false;
    PedalKeyboardClear();
    CanvasBuf = [];
    PedalKeyboardClear();
    DisplayRefresh();
}

function ScreenEvent(X, Y, Btn)
{
    ScreenUpdateLayout();

    var Pedal = PedalMouse(Btn);
    if (Pedal != 0)
    {
        return;
    }

    var ScreenW_ = X - (ScreenW / 2);
    var ScreenH_ = Y - (ScreenH / 2);
    
    if ((Math.abs(ScreenW_ * 200 / ScreenW) < AdjustArea) && (Math.abs(ScreenH_ * 200 / ScreenH) < AdjustArea))
    {
        ScreenSwitchAdjust();
        return;
    }
    
    switch (PageSwitch)
    {
        case 0:
            if ((ScreenW_ < 0) && (ScreenH_ < 0)) { SwitchPage(-10); }
            if ((ScreenW_ > 0) && (ScreenH_ < 0)) { SwitchPage(10); }
            if ((ScreenW_ < 0) && (ScreenH_ > 0)) { SwitchPage(-1); }
            if ((ScreenW_ > 0) && (ScreenH_ > 0)) { SwitchPage(1); }
            break;
        case 1:
            if ((ScreenW_ < 0) && (ScreenH_ < 0)) { SwitchPage(-1); }
            if ((ScreenW_ > 0) && (ScreenH_ < 0)) { SwitchPage(1); }
            if ((ScreenW_ < 0) && (ScreenH_ > 0)) { SwitchPage(-10); }
            if ((ScreenW_ > 0) && (ScreenH_ > 0)) { SwitchPage(10); }
            break;
        case 2:
            if ((ScreenW_ < 0) && (ScreenH_ < 0)) { SwitchPage(-10); }
            if ((ScreenW_ > 0) && (ScreenH_ < 0)) { SwitchPage(-1); }
            if ((ScreenW_ < 0) && (ScreenH_ > 0)) { SwitchPage(10); }
            if ((ScreenW_ > 0) && (ScreenH_ > 0)) { SwitchPage(1); }
            break;
        case 3:
            if ((ScreenW_ < 0) && (ScreenH_ < 0)) { SwitchPage(-1); }
            if ((ScreenW_ > 0) && (ScreenH_ < 0)) { SwitchPage(-10); }
            if ((ScreenW_ < 0) && (ScreenH_ > 0)) { SwitchPage(1); }
            if ((ScreenW_ > 0) && (ScreenH_ > 0)) { SwitchPage(10); }
            break;
        case 4:
            if ((ScreenW_ < 0) && (ScreenH_ < 0)) { SwitchPage(10); }
            if ((ScreenW_ > 0) && (ScreenH_ < 0)) { SwitchPage(-10); }
            if ((ScreenW_ < 0) && (ScreenH_ > 0)) { SwitchPage(1); }
            if ((ScreenW_ > 0) && (ScreenH_ > 0)) { SwitchPage(-1); }
            break;
        case 5:
            if ((ScreenW_ < 0) && (ScreenH_ < 0)) { SwitchPage(1); }
            if ((ScreenW_ > 0) && (ScreenH_ < 0)) { SwitchPage(-1); }
            if ((ScreenW_ < 0) && (ScreenH_ > 0)) { SwitchPage(10); }
            if ((ScreenW_ > 0) && (ScreenH_ > 0)) { SwitchPage(-10); }
            break;
        case 6:
            if ((ScreenW_ < 0) && (ScreenH_ < 0)) { SwitchPage(10); }
            if ((ScreenW_ > 0) && (ScreenH_ < 0)) { SwitchPage(1); }
            if ((ScreenW_ < 0) && (ScreenH_ > 0)) { SwitchPage(-10); }
            if ((ScreenW_ > 0) && (ScreenH_ > 0)) { SwitchPage(-1); }
            break;
        case 7:
            if ((ScreenW_ < 0) && (ScreenH_ < 0)) { SwitchPage(1); }
            if ((ScreenW_ > 0) && (ScreenH_ < 0)) { SwitchPage(10); }
            if ((ScreenW_ < 0) && (ScreenH_ > 0)) { SwitchPage(-1); }
            if ((ScreenW_ > 0) && (ScreenH_ > 0)) { SwitchPage(-10); }
            break;
    }
}




function LoadFileChange()
{
    var FF = document.getElementById("FileName");
    if (FF.files)
    {
        if (FF.files[0])
        {
            AdjustLoad(FF.files[0].name);
        }
    }
}


function LoadFile()
{
    if (typeof window.FileReader !== "function")
    {
        return;
    }

    var FF = document.getElementById("FileName");
    if (!FF.files)
    {
        return;
    }
    if (!FF.files[0])
    {
        alert("Select PDF file");
        return;
    }

    var FR = new FileReader();
    FR.onload = receivedText;
    FR.readAsBinaryString(FF.files[0]);

    function receivedText(e)
    {
        document.title = FF.files[0].name;
        LoadPdf(e.target.result); 
    }
}

