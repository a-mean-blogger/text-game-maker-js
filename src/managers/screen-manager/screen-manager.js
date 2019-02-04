//=============================
// TM.ScreenManager
//=============================
// Object Type: TM.ILoopObject
TM.ScreenManager = function(customSreenSetting, customCharGroups){
  this.screenSetting = TM.common.mergeObjects(TM.defaultSettings.screen, customSreenSetting);
  this.charGroups = TM.common.mergeObjects(TM.defaultSettings.charGroups, customCharGroups);
  this.speed = this.screenSetting.frameSpeed;

  try{
    this.canvas = document.querySelector('#'+this.screenSetting.canvasId);
    if(!this.canvas){
      throw('[#'+this.screenSetting.canvasId+'] does not exist! ');
    }
    else if (this.canvas.tagName !=='CANVAS'){
      throw('[#'+this.screenSetting.canvasId+'] is not a canvas! ');
    }
  }
  catch(errorMessage){
    this.isActive = false;
    console.error('new TM.ScreenManager ERROR: '+errorMessage+' TM.ScreenManager is not created correctly.');
    return;
  }

  var blockWidth = TM.common.getBlockWidth(this.screenSetting.fontSize);
  var blockHeight = TM.common.getBlockHeight(this.screenSetting.fontSize);

  //DOM setting
  this.canvas.width = blockWidth * this.screenSetting.column;
  this.canvas.height = blockHeight * this.screenSetting.row;
  this.canvas.style.width = this.canvas.width * this.screenSetting.zoom+'px';
  this.canvas.style.height = this.canvas.height * this.screenSetting.zoom+'px';
  this.canvas.tabIndex = 1; // for input keydown event
  this.canvas.style.outline = 'none'; // for input keydown event

  this.ctx = this.canvas.getContext('2d');

  this.canvasContainer = document.createElement('div');
  this.canvasContainer.style.position = 'relative';
  this.canvasContainer.width = this.canvas.width;
  this.canvasContainer.height = this.canvas.height;
  this.canvasContainer.style.border = this.screenSetting.backgroundColor+' 1px solid';
  this.canvasContainer.style.borderRadius = '5px';
  this.canvasContainer.style.backgroundColor = this.screenSetting.backgroundColor;
  this.canvasContainer.style.width = this.canvas.width * this.screenSetting.zoom+'px';
  this.canvasContainer.style.height = this.canvas.height * this.screenSetting.zoom+'px';
  this.canvasContainer.style.overflow = 'hidden';

  this.canvas.parentNode.insertBefore(this.canvasContainer, this.canvas);
  this.canvasContainer.appendChild(this.canvas);

  //other properties
  this.scrollOffsetY = 0;
  this.isFontLoaded = false;
  this.FullwidthRegex = TM.common.getFullwidthRegex(this.charGroups);
  this.blockWidth = blockWidth;
  this.blockHeight = blockHeight;

  //screen & cursor
  this.screen = {
    data: [],
    isDrawRequested: false,
    isDrawProcessed: true,
  };

  this.cursor = new TM.ScreenManager_Cursor(this);

  TM.ILoopObject.call(this, this.speed);
};
TM.ScreenManager.prototype = Object.create(TM.ILoopObject.prototype);
TM.ScreenManager.prototype.constructor = TM.ScreenManager;

// TM.ILoopObject functions implementation
TM.ScreenManager.prototype._init = function(){
  this.resetScreenData();
  if(this.screenSetting.fontSource){
    this.startLoadingFont();
  }
  else {
    this.isFontLoaded = true;
  }
};
TM.ScreenManager.prototype._inactivate = function(){};
TM.ScreenManager.prototype._calculate = function(){
  if(this.checkReady()){
    if(this.onReadyFunc){
      this.onReadyFunc();
      delete this.onReadyFunc;
    }
  }
  else {
    this.drawSystemMessage('Loading...');
  }
};
TM.ScreenManager.prototype.draw = function(){
  if(this.screen.isDrawRequested === true){
    this.screen.isDrawRequested = false;

    var _self = this;
    window.requestAnimationFrame(function(){
      _self.drawAnimationFrame();
    });
  }
}

// TM.ScreenManager private functions
TM.ScreenManager.prototype.requestDraw = function(){
  if(this.screen.isDrawProcessed){
    this.screen.isDrawProcessed = false;
    this.screen.isDrawRequested = true;
  }
}
TM.ScreenManager.prototype.drawAnimationFrame = function(){
  //console.log(Math.floor(Date.now()-1000));
  this.screen.isDrawProcessed = true;

  var ctx = this.ctx;
  ctx.textBaseline = 'buttom';

  // bgUpdateMap indicates if bg updated or not at the grid in this draw iteration.
  var bgUpdateMap = this.getNewBgUpdateMap();

  for(var i=this.scrollOffsetY; i<this.scrollOffsetY+this.screenSetting.row; i++){
    for(var j=0; j<this.screenSetting.column; j++){

      if(this.screen.data[i][j].isNew === true){
        //draw backgroundColor
        if(!bgUpdateMap[i][j]){
          var bgX = this.blockWidth*j;
          var bgY = this.blockHeight*(i-this.scrollOffsetY);
          var width = this.getBackgroundWidthRecursive(i,j,bgUpdateMap);
          var height = this.blockHeight;
          ctx.fillStyle = this.screen.data[i][j].backgroundColor;
          ctx.fillRect(bgX,bgY,width,height);
        }

        //draw char
        if(this.screen.data[i][j].char && this.screen.data[i][j].char[0] != '$'){
          var chX = this.blockWidth*j;
          var chY = this.blockHeight*(i-this.scrollOffsetY)+this.blockHeight*0.8; // y adjustment
          var charset = TM.common.getCharGroup(this.charGroups, this.screen.data[i][j].char);
          if(charset){
            ctx.font = this.screenSetting.fontSize*charset.sizeAdj+'px '+this.screen.data[i][j].font;
            chX = chX+this.blockWidth*charset.xAdj;
            chY = chY+this.blockHeight*charset.yAdj;
          }
          else {
            ctx.font = this.screenSetting.fontSize+'px '+(this.isFontLoaded?this.screen.data[i][j].font:'monospace');
          }
          ctx.fillStyle = this.screen.data[i][j].color;
          ctx.fillText(this.screen.data[i][j].char[0],chX,chY);
        }

        //do not draw once it already drew for the better performance
        this.screen.data[i][j].isNew = false;
      }

      //draw inactive block
      if(!this.screen.data[i][j].isActive){
        this.screen.data[i][j].backgroundColor = this.screenSetting.backgroundColor;
        var offX = this.blockWidth*j;
        var offY = this.blockHeight*(i-this.scrollOffsetY);
        var offWidth = this.blockWidth;
        var offHeight = this.blockHeight;
        ctx.fillStyle = this.screen.data[i][j].backgroundColor;
        ctx.fillRect(offX,offY,offWidth,offHeight);
      }

      //draw cursor
      if(this.cursor.isUpdated){
        if(this.cursor.blinkFlag){ //cursor not showing
          this.cursor.isUpdated = false;
        }
        else {
          var cursorX = this.cursor.fixedX!==undefined?this.cursor.fixedX:this.cursor.x;
          var cursorY = this.cursor.fixedY!==undefined?this.cursor.fixedY:this.cursor.y;
          if(j == cursorX && i-this.scrollOffsetY == cursorY){ //cursor showing
            this.cursor.isUpdated = false;
            var cursorWidth = this.cursor.width;
            var cursorHeight = this.blockHeight*this.cursor.size;
            var cursorX = this.blockWidth*cursorX;
            var cursorY = (this.blockHeight)*(cursorY)+(this.blockHeight-cursorHeight);
            var cursorColor = this.cursor.color;
            ctx.fillStyle = cursorColor;
            ctx.fillRect(cursorX,cursorY,cursorWidth,cursorHeight);
          }
        }
      }

    }
  }

};
TM.ScreenManager.prototype.startLoadingFont = function(self){
  var _self = self?self:this;
  if(!_self.screenSetting.webFontJsPath) return console.error("TM.ScreenManager ERROR: 'webFontJsPath' is required to load font from 'fontSource'!");
  if(!_self.screenSetting.fontFaceObserverJsPath) return console.error("TM.ScreenManager ERROR: 'fontFaceObserverJsPath' is required to load font from 'fontSource'!");

  var isReadyToLoad = true;
  if(!window.WebFont){
    isReadyToLoad = false;
    TM.common.includeScript(_self.screenSetting.webFontJsPath);
  }

  if(!window.FontFaceObserver){
    isReadyToLoad = false;
    TM.common.includeScript(_self.screenSetting.fontFaceObserverJsPath);
  }

  if(isReadyToLoad){
    _self.loadWebFont();
  }
  else {
    setTimeout(function(){
      TM.ScreenManager.prototype.startLoadingFont(_self);
    },100)
  }
};
TM.ScreenManager.prototype.loadWebFont = function(){
  WebFont.load({
    custom: {
      families: [this.screenSetting.fontFamily],
      urls : [this.screenSetting.fontSource]
    }
  });

  var font = new FontFaceObserver(this.screenSetting.fontFamily);
  var _self = this;
  font.load()
    .then(function(){
      _self.isFontLoaded = true;
      _self.refreshScreen();
      _self.drawSystemMessage('Loading...', true);
    },function(){
      _self.isFontLoaded = true;
      var message = 'TM.ScreenManager ERROR: Cannot load font: '+_self.screenSetting.fontFamily;
      _self.drawSystemMessage(message);
      console.error(message);
    });

};
TM.ScreenManager.prototype.resetScreenData = function(){
  this.screen.data = [];
  for(var i=this.scrollOffsetY; i<this.scrollOffsetY+this.screenSetting.row; i++){
    this.screen.data[i]=[];
    for(var j=0; j<this.screenSetting.column; j++){
      this.screen.data[i][j]=new TM.ScreenManager_Char(this.screenSetting, ' ');
    }
  }
};
TM.ScreenManager.prototype.getNewBgUpdateMap = function(){
  var bgUpdateMap = [];
  for(var i=this.scrollOffsetY; i<this.scrollOffsetY+this.screenSetting.row; i++){
    bgUpdateMap[i] = [];
    for(var j=0; j<this.screenSetting.column; j++){
      bgUpdateMap[i][j] = false;
    }
  }
  return bgUpdateMap;
};
TM.ScreenManager.prototype.getBackgroundWidthRecursive = function(i,j,bgUpdateMap){
  bgUpdateMap[i][j] = true;
  if(j+1<this.screenSetting.column
  && this.screen.data[i][j+1].isNew
  && this.screen.data[i][j].backgroundColor == this.screen.data[i][j+1].backgroundColor){
    return this.getBackgroundWidthRecursive(i,j+1,bgUpdateMap) + this.blockWidth;
  } else {
    return this.blockWidth;
  }
};
TM.ScreenManager.prototype.refreshScreen = function(){
  for(var i=0; i<this.screen.data.length; i++){
    for(var j=0; j<this.screen.data[i].length; j++){
      this.screen.data[i][j].isNew = true;
    }
  }
  this.requestDraw();
};
TM.ScreenManager.prototype.isInScreen = function(x,y){
  var isInScreen = false;
  if(x>=0 && y>=0 && y<this.screenSetting.row && x<this.screenSetting.column){
    isInScreen = true;
  }
  return isInScreen;
};
TM.ScreenManager.prototype.insertChar = function(char,color,backgroundColor){
  var screenX = this.cursor.x;
  var screenY = this.cursor.y;
  var dataX = this.cursor.x;
  var dataY = this.cursor.y+this.scrollOffsetY;

  if(this.isInScreen(screenX,screenY)){

    if(this.screen.data[dataY][dataX].char != char
      || this.screen.data[dataY][dataX].color != (color?color:this.screenSetting.fontColor)
      || this.screen.data[dataY][dataX].backgroundColor != (backgroundColor?backgroundColor:this.screenSetting.backgroundColor)
      || (this.screen.data[dataY][dataX].char[0] == '$' && dataX-1>0 && this.screen.data[dataY][dataX-1].isNew)
    ){
      var regex = new RegExp(this.FullwidthRegex);
      var fullwidth = regex?regex.test(char):false;

      this.screen.data[dataY][dataX].update(char,fullwidth,color,backgroundColor);

      // to clean background outliner
      if(this.isInScreen(screenX-1,screenY)) this.screen.data[dataY][dataX-1].draw = true;
      if(this.isInScreen(screenX+(fullwidth?2:1),screenY)) this.screen.data[dataY][dataX+(fullwidth?2:1)].draw = true;

      //draw screen
      this.requestDraw();
    }

    //move cursor
    if(this.screen.data[dataY][dataX].char[0] == '$' && dataX==0){ //when fullwidth character cut in half at the end of screen

    }
    else if(screenX+1>=this.screenSetting.column && screenY+1<this.screenSetting.row){
      this.cursor.move(0,screenY+1);
    }
    else if(screenX+1>=this.screenSetting.column && screenY+1>=this.screenSetting.row){
      this.cursor.move(0,screenY);
      this.scrollDown();
    }
    else {
      this.cursor.move(screenX+1,screenY);
    }
  }
};
TM.ScreenManager.prototype.drawSystemMessage = function(message, remove){
  var cursorX = this.cursor.x;
  var cursorY = this.cursor.y;
  if(remove) this.deleteTextAt(0,0,message);
  else this.insertTextAt(0,0,message);
  this.cursor.move(cursorX, cursorY);
};

// TM.ScreenManager public functions
TM.ScreenManager.prototype.onReady = function(func){
  if(this.checkReady()){
    this.onReadyFunc();
  }
  else {
    this.onReadyFunc = func;
  }
};
TM.ScreenManager.prototype.checkReady = function(){
  var isReady = false;

  var isFontReady = this.screenSetting.fontSource?this.isFontLoaded:true;

  isReady = isFontReady;
  return isReady;
};
TM.ScreenManager.prototype.fillScreen = function(char, color, backgroundColor){
  for(var i=this.scrollOffsetY; i<this.scrollOffsetY+this.screenSetting.row; i++){
    for(var j=0; j<this.screenSetting.column; j++){
      this.screen.data[i][j].update(char, false, color, backgroundColor);
    }
  }
  this.requestDraw();
};
TM.ScreenManager.prototype.scrollDown = function(){
  var buttomLine = this.scrollOffsetY+this.screenSetting.row;
  if(!this.screen.data[buttomLine]){
    this.screen.data[buttomLine] = [];
    for(var j=0; j<this.screenSetting.column; j++){
      this.screen.data[buttomLine][j] = new TM.ScreenManager_Char(this.screenSetting, ' ');
    }
  }
  this.scrollOffsetY++;
  this.refreshScreen();
};
TM.ScreenManager.prototype.scrollUp = function(){
  if(this.scrollOffsetY>0){
    this.scrollOffsetY--;
  }
  this.refreshScreen();
};
TM.ScreenManager.prototype.clearScreen = function(){
  this.cursor.move(0,0);
  this.scrollOffsetY = 0;
  this.fillScreen(' ');
};
TM.ScreenManager.prototype.insertText = function(text,color,backgroundColor){
  var regex = this.FullwidthRegex;
  if(regex) text = text.toString().replace(regex,'$1 ');

  var sX = this.cursor.x; // store the starting x position

  for(var i=0; i<text.length; i++){
    switch(text[i]){
      case '\n':
        if(this.cursor.y+1<this.screenSetting.row){
          this.cursor.move(sX,this.cursor.y+1);
        }
        else{
          this.cursor.move(sX,this.cursor.y);
          this.scrollDown();
        }
        break;
      case '\r':
        this.cursor.move(0,this.cursor.y);
        sX = 0;
        break;
      default:
        var fullwidth = regex?(new RegExp(this.FullwidthRegex)).test(text[i]):false;
        this.insertChar(text[i],color,backgroundColor);
        if(fullwidth){
          i++;
          this.insertChar('$fullwidthFiller',color,backgroundColor);
        }
        break;
    }
  }
  return {
    x: this.cursor.x,
    y: this.cursor.y,
  };
};
TM.ScreenManager.prototype.insertTextAt = function(x,y,text,color,backgroundColor){
  if(this.cursor.move(x,y)){
    return this.insertText(text,color,backgroundColor);
  }
};
TM.ScreenManager.prototype.deleteText = function(text){
  var regex = new RegExp(this.FullwidthRegex);
  text = text.toString().replace(regex,'$1 ');
  this.insertText(text.replace(/./g,' '));
};
TM.ScreenManager.prototype.deleteTextAt = function(x,y,text){
  if(this.cursor.move(x,y)){
    this.deleteText(text);
  }
};
TM.ScreenManager.prototype.copyScreen = function(){
  var copyToCanvas = document.createElement('canvas');
  var ctx = copyToCanvas.getContext('2d');
  copyToCanvas.width = this.canvas.width;
  copyToCanvas.height = this.canvas.height;
  ctx.drawImage(this.canvas, 0, 0);
  return copyToCanvas;
};
TM.ScreenManager.prototype.pasteScreen = function(canvas){
  this.ctx.drawImage(canvas, 0, 0);
};
TM.ScreenManager.prototype.consoleScreenData = function(canvas){
  for(var i=this.scrollOffsetY; i<this.scrollOffsetY+this.screenSetting.row; i++){
    var row = '';
    for(var j=0; j<this.screenSetting.column; j++){
      row += this.screen.data[i][j].char[0]+(this.screen.data[i][j].isNew?'!':' ');
    }
    console.log(row);
  }
};
