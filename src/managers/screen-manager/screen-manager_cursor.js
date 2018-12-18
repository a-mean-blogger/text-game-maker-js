//=============================
// TM.ScreenManager_Cursor
//=============================
// Object Type: TM.ILoopObject
TM.ScreenManager_Cursor = function(refScreenManager){
  this.speed = 500;

  this.refScreenManager = refScreenManager;

  this.x = 0;
  this.y = 0;
  this.fixedX = undefined;
  this.fixedY = undefined;
  this.xMax = this.refScreenManager.screenSetting.column-1;
  this.yMax = this.refScreenManager.screenSetting.row-1;
  this.color = this.refScreenManager.screenSetting.fontColor;
  this.width = this.refScreenManager.blockWidth;
  this.size = 0.1;
  this.isHidden = false;
  this.blinkFlag = false;
  this.isUpdated = true;

  TM.ILoopObject.call(this, this.speed);
};
TM.ScreenManager_Cursor.prototype = Object.create(TM.ILoopObject.prototype);
TM.ScreenManager_Cursor.prototype.constructor = TM.ScreenManager_Cursor;


// TM.ILoopObject function implementations
TM.ScreenManager_Cursor.prototype._init = function(){
  this.blinkFlag = false;
  this.isHidden = false;
};
TM.ScreenManager_Cursor.prototype._inactivate = function(){
  this.blinkFlag = true;

  this.requestDraw();
};
TM.ScreenManager_Cursor.prototype._calculate = function(){
  this.blinkFlag = !this.blinkFlag;

  this.requestDraw();
};
TM.ScreenManager_Cursor.prototype._draw = function(){};

// TM.ScreenManager_Cursor functions
TM.ScreenManager_Cursor.prototype.changeColor = function(color){
  this.color = color?color:this.refScreenManager.screenSetting.fontColor;

  this.requestDraw();
};
TM.ScreenManager_Cursor.prototype.pin = function(x,y){
  this.requestDraw();

  this.fixedX = x!=null?x:this.x;
  this.fixedY = y!=null?y:this.y;

  this.requestDraw();
}
TM.ScreenManager_Cursor.prototype.unpin = function(){
  this.x = this.fixedX!=undefined?this.fixedX:this.x;
  this.y = this.fixedY!=undefined?this.fixedY:this.y;

  this.fixedX = undefined;
  this.fixedY = undefined;

  this.requestDraw();
}
TM.ScreenManager_Cursor.prototype.move = function(x,y){
  var isMoved = false;
  if(this.isActive && x>=0 && x<= this.xMax && y>=0 && y<= this.yMax){
    isMoved = true;
    this.x = x;
    this.y = y;

    this.requestDraw();
  }
  return isMoved;
};
TM.ScreenManager_Cursor.prototype.requestDraw = function(){
  var x = this.fixedX!=undefined?this.fixedX:this.x;
  var y = this.fixedY!=undefined?this.fixedY:this.y;

  this.isUpdated = true;
  this.refScreenManager.screen.data[y+this.refScreenManager.scrollOffsetY][x].isNew = true;
  this.refScreenManager.requestDraw();
}
TM.ScreenManager_Cursor.prototype.hide = function(){
  this.isHidden = true;
  this.blinkFlag = true;
  this.interval.inactivate();

  this.requestDraw();
};
TM.ScreenManager_Cursor.prototype.show = function(){
  this.init();

  this.requestDraw();
};
