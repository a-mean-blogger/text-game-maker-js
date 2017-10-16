var TM = {};

TM.defaultSettings = {
  screen: {
    canvasId: 'tm-canvas',
    frameSpeed: 40,
    column: 60,
    row: 20,
    backgroundColor: '#151617',
    webFontJsPath: 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js',
    fontColor: '#F5F7FA',
    fontFamily: 'monospace',
    fontSource: null,
    fontSize: 30,
    zoom: 0.5,
  },
  charGroups: {
    korean: {//ㄱ     -힝
      chars: '\u3131-\uD79D',
      isFullwidth: true,
      sizeAdj: 1,
      xAdj: 0,
      yAdj: 0,
    },
  },
  debug: {
    devMode: false,
    outputDomId: 'tm-debug-output',
  }
};
