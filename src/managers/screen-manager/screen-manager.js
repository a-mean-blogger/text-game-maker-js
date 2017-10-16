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

  this.isFontLoaded = false;
  this.screenData = [];
  this.blockWidth = TM.common.getBlockWidth(this.screenSetting.fontSize);
  this.blockHeight = TM.common.getBlockHeight(this.screenSetting.fontSize);
  this.canvas.width = this.blockWidth * this.screenSetting.column;
  this.canvas.height = this.blockHeight * this.screenSetting.row;
  this.canvas.style.border = this.screenSetting.backgroundColor+' 1px solid';
  this.canvas.style.borderRadius = '5px';
  this.canvas.style.backgroundColor = this.screenSetting.backgroundColor;
  this.canvas.style.width = this.canvas.width * this.screenSetting.zoom+'px';
  this.canvas.style.height = this.canvas.height * this.screenSetting.zoom+'px';
  this.canvas.tabIndex = 1; // for input keydown event
  this.canvas.style.outline = 'none'; // for input keydown event
  this.ctx = this.canvas.getContext('2d');

  this.scrollOffsetY = 0;
  this.cursor = new TM.ScreenManager_Cursor({
    refScreenManager: this,
    xMax: this.screenSetting.column-1,
    yMax: this.screenSetting.row-1,
    color: "gray",
    width: this.blockWidth,
    size: 0.1,
  });

  this.FullwidthRegex = TM.common.getFullwidthRegex(this.charGroups);

  TM.ILoopObject.call(this, this.speed);
};
TM.ScreenManager.prototype = Object.create(TM.ILoopObject.prototype);
TM.ScreenManager.prototype.constructor = TM.ScreenManager;

// TM.ILoopObject functions implementation
TM.ScreenManager.prototype._init = function(){
  this.resetScreenData();
  if(this.screenSetting.fontSource && !TM.common.checkFontLoadedByWebFont(this.screenSetting.fontFamily)){
    this.startLoadingFont();
  }
};
TM.ScreenManager.prototype._inactivate = function(){};
TM.ScreenManager.prototype._calculate = function(){
  if(!this.isFontLoaded && TM.common.checkFontLoadedByWebFont(this.screenSetting.fontFamily)){
    this.isFontLoaded = true;
    this.drawLoading(true);
    this.cursor.move(0,0);
    this.refreshScreen();
  }
  if(this.checkReady()){
    if(this.onReadyFunc){
      this.onReadyFunc();
      delete this.onReadyFunc;
    }
  }
  else {
    this.drawLoading();
  }
};
TM.ScreenManager.prototype._draw = function(){
  var ctx = this.ctx;
  ctx.textBaseline = 'buttom';

  // bgUpdateMap indicates if bg updated or not at the grid in this draw iteration.
  var bgUpdateMap = this.getNewBgUpdateMap();

  for(var i=this.scrollOffsetY; i<this.scrollOffsetY+this.screenSetting.row; i++){
    for(var j=0; j<this.screenSetting.column; j++){

      if(this.screenData[i][j].isNew === true){

        //draw backgroundColor
        if(!bgUpdateMap[i][j]){
          var bgX = this.blockWidth*j;
          var bgY = this.blockHeight*(i-this.scrollOffsetY);
          var width = this.getBackgroundWidthRecursive(i,j,bgUpdateMap);
          var height = this.blockHeight;
          ctx.fillStyle = this.screenData[i][j].backgroundColor;
          ctx.fillRect(bgX,bgY,width,height);
        }

        //draw char
        if(this.screenData[i][j].char && this.screenData[i][j].char[0] != '$'){
          var chX = this.blockWidth*j;
          var chY = this.blockHeight*(i-this.scrollOffsetY)+this.blockHeight*0.8; // y adjustment
          var charset = TM.common.getCharGroup(this.charGroups, this.screenData[i][j].char);
          if(charset){
            ctx.font = this.screenSetting.fontSize*charset.sizeAdj+'px '+this.screenData[i][j].font;
            chX = chX+this.blockWidth*charset.xAdj;
            chY = chY+this.blockHeight*charset.yAdj;
          }
          else {
            ctx.font = this.screenSetting.fontSize+'px '+this.screenData[i][j].font;
          }
          ctx.fillStyle = this.screenData[i][j].color;
          ctx.fillText(this.screenData[i][j].char[0],chX,chY);
        }

        //do not draw once it already drew for the better performance
        this.screenData[i][j].isNew = false;
      }

      if(!this.screenData[i][j].isActive && this.screenData[i][j].char != '$off'){
        this.screenData[i][j].char = '$off';
        this.screenData[i][j].backgroundColor = this.screenSetting.backgroundColor;
        var offX = this.blockWidth*j;
        var offY = this.blockHeight*(i-this.scrollOffsetY);
        var offWidth = this.blockWidth;
        var offHeight = this.blockHeight;
        ctx.fillStyle = this.screenData[i][j].backgroundColor;
        ctx.fillRect(offX,offY,offWidth,offHeight);
      }

    }
  }

  //draw.cursor
  var cursorData = this.cursor.data;
  if(cursorData.isUpdated){
    cursorData.isUpdated = false;
    if(cursorData.isHidden){
      this.screenData[cursorData.y+this.scrollOffsetY][cursorData.x].isNew = true;
    }
    else {
      var cursorWidth = cursorData.width;
      var cursorHeight = this.blockHeight*cursorData.size;
      var cursorX = this.blockWidth*cursorData.x;
      var cursorY = (this.blockHeight)*(cursorData.y)+(this.blockHeight-cursorHeight);
      var cursorColor = this.screenSetting.fontColor;
      ctx.fillStyle = cursorColor;
      ctx.fillRect(cursorX,cursorY,cursorWidth,cursorHeight);
    }
  }

};

// TM.ScreenManager private functions
TM.ScreenManager.prototype.startLoadingFont = function(){
  if(!this.screenSetting.webFontJsPath) return console.error("TM.ScreenManager ERROR: 'webFontJsPath' is required to load font from 'fontSource'!");

  if(!window.WebFont){
    TM.common.includeScript(this.screenSetting.webFontJsPath,this.loadWebFont());
  }
  else {
    this.loadWebFont();
  }
};
TM.ScreenManager.prototype.loadWebFont = function(){
  var _self = this;
  return function(){
    var link = document.createElement("link");
    link.rel ="stylesheet";
    link.href=_self.screenSetting.fontSource;
    document.head.appendChild(link);

    WebFont.load({
      custom: {
        families: [_self.screenSetting.fontFamily],
        urls : [_self.screenSetting.fontSource]
      }
    });
  };
};
TM.ScreenManager.prototype.resetScreenData = function(){
  this.screenData = [];
  for(var i=this.scrollOffsetY; i<this.scrollOffsetY+this.screenSetting.row; i++){
    this.screenData[i]=[];
    for(var j=0; j<this.screenSetting.column; j++){
      this.screenData[i][j]=new TM.ScreenManager_Char(this.screenSetting, ' ');
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
  && this.screenData[i][j+1].isNew
  && this.screenData[i][j].backgroundColor == this.screenData[i][j+1].backgroundColor){
    return this.getBackgroundWidthRecursive(i,j+1,bgUpdateMap) + this.blockWidth;
  } else {
    return this.blockWidth;
  }
};
TM.ScreenManager.prototype.refreshScreen = function(){
  for(var i=0; i<this.screenData.length; i++){
    for(var j=0; j<this.screenData[i].length; j++){
      this.screenData[i][j].isNew = true;
    }
  }
};
TM.ScreenManager.prototype.isInScreen = function(x,y){
  var isInScreen = false;
  if(x>=0 && y>=0 && y<this.screenSetting.row && x<this.screenSetting.column){
    isInScreen = true;
  }
  return isInScreen;
};
TM.ScreenManager.prototype.insertChar = function(char,color,backgroundColor){
  var screenX = this.cursor.data.x;
  var screenY = this.cursor.data.y;
  var dataX = this.cursor.data.x;
  var dataY = this.cursor.data.y+this.scrollOffsetY;

  if(this.isInScreen(screenX,screenY)){

    if(this.screenData[dataY][dataX].char != char
      || this.screenData[dataY][dataX].color != (color?color:this.screenSetting.fontColor)
      || this.screenData[dataY][dataX].backgroundColor != (backgroundColor?backgroundColor:this.screenSetting.backgroundColor)
      || (this.screenData[dataY][dataX].char[0] == '$' && this.screenData[dataY][dataX-1].isNew)
    ){
      var regex = this.FullwidthRegex;
      var fullwidth = regex?regex.test(char):false;

      this.screenData[dataY][dataX].update(char,fullwidth,color,backgroundColor);

      // to clean background outliner
      if(this.isInScreen(screenX-1,screenY)) this.screenData[dataY][dataX-1].draw = true;
      if(this.isInScreen(screenX+(fullwidth?2:1),screenY)) this.screenData[dataY][dataX+(fullwidth?2:1)].draw = true;
    }

    //move cursor
    if(screenX+1>=this.screenSetting.column && screenY+1<this.screenSetting.row){
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
TM.ScreenManager.prototype.drawLoading = function(remove){
  var text = "Loading...";
  if(remove) this.deleteTextAt(0,0,text);
  else this.insertTextAt(0,0,text);
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
      this.screenData[i][j].update(char, false, color, backgroundColor);
    }
  }
};
TM.ScreenManager.prototype.scrollDown = function(){
  var buttomLine = this.scrollOffsetY+this.screenSetting.row;
  if(!this.screenData[buttomLine]){
    this.screenData[buttomLine] = [];
    for(var j=0; j<this.screenSetting.column; j++){
      this.screenData[buttomLine][j] = new TM.ScreenManager_Char(this.screenSetting, ' ');
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
  this.fillScreen(' ');
};
TM.ScreenManager.prototype.insertText = function(text,color,backgroundColor){
  var regex = this.FullwidthRegex;
  if(regex) text = text.toString().replace(regex,'$1 ');

  var sX = this.cursor.data.x; // store the starting x position
  var cursorData = this.cursor.data;

  for(var i=0; i<text.length; i++){
    switch(text[i]){
      case "\n":
        if(cursorData.y+1<this.screenSetting.row){
          this.cursor.move(sX,cursorData.y+1);
        }
        else{
          this.cursor.move(sX,cursorData.y);
          this.scrollDown();
        }
        break;
      case "\r":
        this.cursor.move(0,cursorData.y);
        break;
      default:
        var fullwidth = regex?regex.test(text[i]):false;
        this.insertChar(text[i],color,backgroundColor);
        if(fullwidth){
          i++;
          this.insertChar('$fullwidthFiller',color,backgroundColor);
        }
        break;
    }
  }
};
TM.ScreenManager.prototype.insertTextAt = function(x,y,text,color,backgroundColor){
  if(this.cursor.move(x,y)){
    this.insertText(text,color,backgroundColor);
  }
};
TM.ScreenManager.prototype.deleteText = function(text){
  var regex = this.FullwidthRegex;
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
      row += this.screenData[i][j].char[0]+(this.screenData[i][j].isNew?'!':' ');
    }
    console.log(row);
  }
};
