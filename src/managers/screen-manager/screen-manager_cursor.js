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
  this.isUpdated = true;

  this.refScreenManager.requestDraw();
};
TM.ScreenManager_Cursor.prototype._calculate = function(){
  this.blinkFlag = !this.blinkFlag;
  this.isUpdated = true;

  this.refScreenManager.requestDraw();
};
TM.ScreenManager_Cursor.prototype._draw = function(){};

// TM.ScreenManager_Cursor functions
TM.ScreenManager_Cursor.prototype.changeColor = function(color){
  this.color = color?color:this.refScreenManager.screenSetting.fontColor;
  this.refScreenManager.requestDraw();
};
TM.ScreenManager_Cursor.prototype.pin = function(x,y){
  this.fixedX = x?x:this.x;
  this.fixedY = y?y:this.y;

  this.refScreenManager.screen.data[this.y+this.refScreenManager.scrollOffsetY][this.x].isNew = true;

  this.refScreenManager.requestDraw();
}
TM.ScreenManager_Cursor.prototype.unpin = function(){
  this.refScreenManager.screen.data[this.fixedY+this.refScreenManager.scrollOffsetY][this.fixedX].isNew = true;

  this.fixedX = undefined;
  this.fixedY = undefined;

  this.refScreenManager.requestDraw();
}
TM.ScreenManager_Cursor.prototype.move = function(x,y){
  var isMoved = false;
  if(this.isActive && x>=0 && x<= this.xMax && y>=0 && y<= this.yMax){
    this.refScreenManager.screen.data[this.y+this.refScreenManager.scrollOffsetY][this.x].isNew = true;

    isMoved = true;
    this.x = x;
    this.y = y;

    this.refScreenManager.requestDraw();
  }
  return isMoved;
};
TM.ScreenManager_Cursor.prototype.hide = function(){
  this.isHidden = true;
  this.blinkFlag = true;
  this.interval.inactivate();
  this.isUpdated = true;
  this.refScreenManager.screen.data[this.y+this.refScreenManager.scrollOffsetY][this.x].isNew = true;

  this.refScreenManager.requestDraw();
};
TM.ScreenManager_Cursor.prototype.show = function(){
  this.init();
};
