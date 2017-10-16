var screenSetting = {
  // canvasId: 'tm-canvas',
  // frameSpeed: 40,
  // column: 60,
  // row: 20,
  // backgroundColor: '#151617',
  // webFontJsPath: 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js',
  // fontColor: '#F5F7FA',
  // fontFamily: 'monospace',
  // fontSource: null,
  // fontSize: 30,
  // zoom: 0.5,
  column: 70,
  row: 9,
};

var debugSetting = {
  // devMode: false,
  // outputDomId: 'tm-debug-output',
  devMode: true,
};

var TMS = new TM.ScreenManager(screenSetting),
    TMI = new TM.InputManager(screenSetting.canvasId,debugSetting.devMode),
    TMD = new TM.DebugManager(debugSetting);

var x = 1,
    y = 1,
    blogUrl = 'http://a-mean-blog.com/en/blog/Text-Game-Maker-JS';

TMS.cursor.move(x,y);
TMS.insertText('Hello World!\n\n', 'white', '#4e4e4e');
TMS.insertText('I\'m Text Game Maker JS!');

TMS.insertTextAt(x,y+5,'Find more information of me at:');
TMS.insertTextAt(x+3,y+6, blogUrl);

TMD.print('debug-data',{
  x: x,
  y: y,
  'Blog Url': blogUrl,
});
