//=============================
// TM.ScreenManager_Char
//=============================
TM.ScreenManager_Char = function(screenSetting, char, isFullwidth, color, backgroundColor){
  this.screenSetting = screenSetting;
  this.char = char;
  this.isFullwidth = isFullwidth;
  this.color = color?color:screenSetting.fontColor;
  this.backgroundColor = backgroundColor?backgroundColor:screenSetting.backgroundColor;
  this.font = screenSetting.fontFamily;
  this.isNew = true;
  TM.IObject.call(this);
};
TM.ScreenManager_Char.prototype = Object.create(TM.IObject.prototype);
TM.ScreenManager_Char.prototype.constructor = TM.ScreenManager_Char;

// TM.IObject functions implementation
TM.ScreenManager_Char.prototype._init = function(){};
TM.ScreenManager_Char.prototype._inactivate = function(){};

//TM.ScreenManager_Char functions
TM.ScreenManager_Char.prototype.update = function(char,fullwidth,color,backgroundColor){
  this.char = char?char:' ';
  this.fullwidth = fullwidth?fullwidth:false;
  this.color = color?color:this.screenSetting.fontColor;
  this.backgroundColor = backgroundColor?backgroundColor:this.screenSetting.backgroundColor;
  this.isNew = true;
};
