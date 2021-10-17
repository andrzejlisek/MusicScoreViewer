# Music Score Viewer

This application allows to view most PDF files in fullscreen mode using [Mozilla's pdf\.js library](https://mozilla.github.io/pdf.js/ "https://mozilla.github.io/pdf.js/")\. The main purpose is displaying music score sheets for playing any musical instrument\. The application runs inside standard web browser, so you can run it on almost any system, including Windows, Linux, Android\. This application was tested on the Firefox and Chrome browsers, but may work on another browsers\.

The PDF file can be displayed as single page or two pages simultaneously\. In double page display, tou can flip one page ot two pages\. The application can be used in any screen orientation\.

# Display settings

At the top of page, you have select the PDF file in the filed **PDF file**\. Below, you have the display settings:


* **Resolution** \- The rendering resolution\. In the value is higher, the picture will be more detailed, but buffering the pages will take longer time and occupy more memory\. In most cases, the resolution should be between 1 and 3\.
* **Display mode** \- The display mode and the way of flipping pages:
  * **Single page** \- Display one page at a time\.
  * **Even\-odd, flip one** \- Display two pages at a time, every even page at the left side and every odd page at the right side\. Replace one page at a time\.
  * **Odd\-even, flip one** \- Display two pages at a time, every odd page at the left side and every even page at the right side\. Replace one page at a time\.
  * **Even\-odd, flip two** \- Display two pages at a time, every even page at the left side and every odd page at the right side\. Replace two pages at a time\.
  * **Odd\-even, flip two** \- Display two pages at a time, every odd page at the left side and every even page at the right side\. Replace two pages at a time\.
* **Page layout** \- The display layout, when you display two pages, its affects, when you select the other mode than **Single page** in the **Display mode** field\.
* **Page orient\.** \- The page display orientation\. You can use it if the screen of your device is rotated or the PDF contents are incorrectly orientated\.
* **Zone orient\.** \- The active zone orientation\. During the display, the screen is splitted into four corner zones, the value of the field determines the zone layout\.

# Screen preview

The picture shows the beaning of the current display settings for imagining the screen layout\. At the picture, there are marked the four zones and the zone meaning in the corners\. The zones are as following:


* **\-1** \- Go through one previous page\.
* **\+1** \- Go through one next page\.
* **\-10** \- Go through ten previous pages or go to adjustment settings\.
* **\+10** \- Go through ten next pages or go to adjust settings\.

The pages are displayed as gray rectangle\. The arrows shows the page orientation\. Whe the **Display mode** is other than **single page**, the single arrow indicates the odd page placement and the double arrow indicates the even page placement\.

# Showing the PDF file

Below the **Screen preview** field, there are two buttons:


* **Fullscreen** \- Switches between the normal and fullscreen display of the web browser\. Click this button before the **Show file**, if you want to show in fullscreen mode\.
* **Show file** \- Performs the file show\.

During the file show, all the setting will be saved into the browser memory\. The screen will be splitted into 5 zones, where the four has meaning as shown in the **Screen preview** field and the fifth zone is in the middle of the screen and allows to display adjustment\. You can also use the following keys on the keyboard:


* **Adjust** \- Insert, Delete, Numpad 5\.
* **Previous page** \- Page Up, Arrow Up, Numpad 8\.
* **Next page** \- Page Down, Arrow Down, Numpad 2\.
* **Ten previous pages** \- Home, Arrow Left, Numpad 4\.
* **Ten next pages** \- End, Arrow Right, Numpad 6\.

Everytime, when any page is displayed, the two previous and two next pages will be buffered, so, the flipping one page are very quickly\. After flipping page, the another page must be buffered\. During buffering any page, the flipping page commands are ignored\. When you flip ten pages, the new page will be displayed with short delay, when the page is not buffered\. If the page is displayed, the page will be retain in the buffer, so going into such page will be quickly\.

When you resize the browser window, the display will be incorrect\. To correct this, flip the page or ten pages\.

If you want to display other PDF file, refresh the applicaton using appropriate browser function\.

# Image adjustment

You can adjust the image cropping and levels before showing using the fields bellow the buttons or during show using the **\-10** and **\+10** zones\. The adjustment values will be saved in the browser memory associated with the file name\. You can save the adjust settings of several files, but every file must have different name\. The path of file will not be saved due to the JavaScript limitations\.

## Crop

In most cases, the PDF file is designed to print on the paper, so it can have big margins\. You can crop unnecessary margins during display\. The crop settings are independed for odd pages and the even pages\. The value are the percentage of the paper size\.

## Levels

Some PDF files contains the serie of scanned paper instead of contents generated by software\. Such image can have improper levels, which reduces the readability\. In such cases, you can adjust the color levels including gamma by the same way, as in many bitmap editors\. The gamma value is multiplied by 1000, so the 1000 means 1\.0\. The gamma renge is from 100 \(means 0\.1\) to 10000 \(means 10\.0\)\.

## Before show

Below the **Fullscreen** and **Show file** buttons, there are the fields with crop and level settings\. When you select the PDF file, the settings will be recovered if there are saved in the memory\.

## During show

During the show, you can change the meaning of the **\-10** and **\+10** fields\. The initial meaning is the flipping the ten pages\. When you click in the middle of the screen, the meaning of the fields will be changed within the following cycle:


* **Ten pages** \- Flip ten pages:
  * **\-10** \- Go through 10 previous pages\.
  * **\+10** \- Go through 10 next pages\.
* **Crop** \- Set the crop sizes, in this mode, there will be show the grid, which splits the picture into cells, when single row or columns represents the 10% in the size:
  * **\-10** \- Crop the odd pages\.
  * **\+10** \- Crop the even pages\.
* **Levels** \- Set the color levels:
  * **\-10** \- Input level values and gamma\.
  * **\+10** \- Output level values\.

In the **Crop** and **Level** states, when you click the **\-10** or **\+10** zone, there will be displayed appropriate input boxes\. In every input box, if the input value exceedes the permitted range, the value will be corrected to be in the range\. If the new value will not be a integer number, it will be ignored and the value of the parameter will not be changed\.

After every change, the crop and levels value will be saved in the memory with associating the file name\.

# Other settings

At the bottom of application settings page, there are the other settings:


* **Adjust area** \- The size of the adjust zone in the screen during the file showing\. The value is the percentage as follows:
  * **0** \- The adjust zone does not exist\.
  * **100** \- The adjust zone occupies whole screen, so the page flipping by clicking or tapping the screen is not possible\.
* **Pointer type** \- The pointer type, you have set this according your device\.
  * **Mouse** \- Use it on the computers\. Its works both when using the mouse and the touch screen, but insome devices, the tapping the screen will be interpreted as mouse click with the short while\.
  * **Touch** \- Use it on the tablets, smartphones and similar devices\. The mouse will not work in this mode\.

# Keyboard and mouse

You can configure page flipping by your foot, which is convenient during playing the instrument\. To do this, put keyboard or mouse on the floor and use it as pedal\. The keyboard used as pedal, has the three zones:


* **Alpha** \- Letters, numbers above letters, space, Alt keys and every other key in the alphanumeric zone\.
* **Arrows** \- The arrows and Ins/Del/Home/End/PhUp/PgDpwn zone\.
* **Numpad** \- All keys in the numpad zone\.

The other keys, like Escape and function keys are outside the mentioned zones and can not be used as pedal\. The application is resistant to pressing multiple keys at a time and auto\-repeating keys, so you can press the several keys inside one zone and it will be interpreted as single action\.

You can also use the mouse as single pedal, or convert it into single, double or triple pedal\. To use mouse as single pedal, configure the same action for every button\.

To use mouse as multiple pedal, you can set the other action to every button\. You need the mouse \(which will not be longer used as mouse\) and from one to three universal piano pedals or similar devices\. The preparation are following:


1. Disassembly the mouse\.
2. Unsolder the mouse button microswitches\.
3. On every piano pedal cut the plug and \.
4. Isolate the wires of the every pedal cable\.
5. Solder the wires of the first pedal in the place of left mouse button\.
6. Solder the wires of the second pedal in the place of right mouse button\.
7. Solder the wires of the third pedal in the place of middle mouse button\.
8. Connect the mouse into the device and chech the pedals\. Every soldered pedal will act as mouse click\.

To use keyboard or mouse as pedal, set the most bottom **Keyboard** and **Mouse** fields\. The **Normal** setting indicates normal using the mouse button or keyboard zone\. The other settings matches five possible actions during the file show\.




