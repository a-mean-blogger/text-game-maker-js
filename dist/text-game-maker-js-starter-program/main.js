var screenSetting = {
  /* Default Values */
  // canvasId: 'tm-canvas',
  // frameSpeed: 40,
  // column: 60,
  // row: 20,
  // backgroundColor: '#151617',
  // webFontJsPath: 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js',
  // fontFaceObserverJsPath:'https://cdnjs.cloudflare.com/ajax/libs/fontfaceobserver/2.0.13/fontfaceobserver.js',
  // fontColor: '#F5F7FA',
  // fontFamily: 'monospace',
  // fontSource: null,
  // fontSize: 30,
  // zoom: 0.5,

  /* Try This */
  // fontFamily: 'Nanum Gothic Coding',
  // fontSource: 'https://fonts.googleapis.com/css?family=Nanum+Gothic+Coding',

  column: 70,
  row: 9,
};

var charGroups = {
  /* There is no default value for this.            */
  /* Try This with 'Nanum Gothic Coding' font,      */
  /* then insert special characters like: ■ □ ★ ☆ △ ▷ ▽ ◁ */
  // fullwidth: {
  //   chars: '\u2500-\u2BFF\u2022\u2008',
  //   isFullwidth: true,
  //   sizeAdj: 1.2,
  //   xAdj: -0.05,
  //   yAdj: 0.03,
  // },
};

var debugSetting = {
  // devMode: false,
  // outputDomId: 'tm-debug-output',
  devMode: true,
};

var TMS = new TM.ScreenManager(screenSetting,charGroups),
    TMI = new TM.InputManager(screenSetting.canvasId,debugSetting.devMode),
    TMD = new TM.DebugManager(debugSetting);

var x = 1,
    y = 1,
    blogUrl = 'http://a-mean-blog.com/en/blog/Text-Game-Maker-JS';

TMS.cursor.move(x,y);
TMS.insertText('Hello World!\n\n', 'white', '#4e4e4e');
TMS.insertText(`I\'m Text Game Maker JS v${TM.version}!`);

TMS.insertTextAt(x,y+5,'Find more information of me at:');
TMS.insertTextAt(x+3,y+6, blogUrl);

TMD.print('debug-data',{
  x: x,
  y: y,
  'Blog Url': blogUrl,
});
