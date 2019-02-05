var TM = {};
TM.version = '1.0.2';
TM.defaultSettings = {
  screen: {
    canvasId: 'tm-canvas',
    frameSpeed: 40,
    column: 60,
    row: 20,
    backgroundColor: '#151617',
    webFontJsPath: 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js',
    fontFaceObserverJsPath: 'https://cdnjs.cloudflare.com/ajax/libs/fontfaceobserver/2.0.13/fontfaceobserver.js',
    fontColor: '#F5F7FA',
    fontFamily: 'Nanum Gothic Coding',
    fontSource: 'https://cdn.jsdelivr.net/font-nanum/1.0/nanumgothiccoding/nanumgothiccoding.css',
    fontSize: 30,
    zoom: 0.5,
  },
  charGroups: {
    korean: {//ㄱ   -힣
      chars: '\u3131-\uD7A3',
      isFullwidth: true,
      sizeAdj: 1,
      xAdj: 0,
      yAdj: 0,
    },
    fullwidth: {// ■□★☆△▷▽◁┍┑┕┙│━┏┓┗┛━┃...
      targetFonts: ['Nanum Gothic Coding'],
      chars: '\u2008\u2022\u2190-\u21f0\u2500-\u2BFF',
      isFullwidth: true,
      sizeAdj: 1.2,
      xAdj: -0.05,
      yAdj: 0.03,
    },
  },
  debug: {
    devMode: false,
    outputDomId: 'tm-debug-output',
  }
};
