// copy and paste this codes to main.js in starter program and open index.html on a web browser

var screenSetting = {
  column: 55,
  row: 22,
  fontFamily: 'Nanum Gothic Coding',
  fontSource: 'https://fonts.googleapis.com/earlyaccess/nanumgothiccoding.css',
};

var charGroups = {
  wall: {
    chars: '■',
    isFullwidth: true,
    sizeAdj: 1.2,
    xAdj: -0.05,
    yAdj: 0.03,
  },
};

var debugSetting = {
  devMode: true,
};

var TMS = new TM.ScreenManager(screenSetting,charGroups),
    TMI = new TM.InputManager(screenSetting.canvasId,debugSetting.devMode),
    TMD = new TM.DebugManager(debugSetting);

TMS.cursor.hide();

//=============================
// Frame
//=============================
// Object Type: TM.IObject
var Frame = function(data){
  this.data = {
    x: undefined,
    y: undefined,
    width: 44,
    height: 18,
    score: 0,
  };
  TM.IObject.call(this,data);
};
Frame.prototype = Object.create(TM.IObject.prototype);
Frame.prototype.constructor = Frame;

// TM.IObject functions implementation
Frame.prototype._init = function(){
  this.drawFrame();
  this.drawScore();
};
Frame.prototype._inactivate = function(){
  this.drawFrame(true);
  this.drawScore(true);
};

// Frame functions
Frame.prototype.drawFrame = function(remove){
  for(var i=0; i<this.data.height; i++){
    for(var j=0; j<this.data.width; j++){
      if((i===0 || i==this.data.height-1 || j===0 || j==this.data.width-2)&&(j%2 === 0)){
        var frameText = "■";
        if(remove) TMS.deleteTextAt(this.data.x+j,this.data.y+i,frameText);
        else TMS.insertTextAt(this.data.x+j,this.data.y+i,frameText);
      }
    }
  }
};
Frame.prototype.drawScore = function(remove){
  var scoreText = "Score: ";
  if(remove){
    TMS.deleteTextAt(this.data.x,this.data.y-1,scoreText);
    TMS.deleteText(this.data.score);
  }
  else {
    TMS.insertTextAt(this.data.x,this.data.y-1,scoreText);
    TMS.insertText(this.data.score);
  }
};
Frame.prototype.addScore = function(){
  this.data.score += 100;
  this.drawScore();
};

var frame;
TMS.onReady(function(){
  frame = new Frame({x:5,y:2});
});
