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

//=============================
// Enemy
//=============================
// Object Type: TM.ILoopObject
var Enemy = function(){
  this.speed = null;
  this.data = {
    x: null,
    y: null,
    pX: null,
    pY: null,
    dX: 0,
    dY: 1,
    text: "X",
  };
  TM.ILoopObject.call(this, this.speed);
};
Enemy.prototype = Object.create(TM.ILoopObject.prototype);
Enemy.prototype.constructor = Enemy;

// TM.ILoopObject functions implementation
Enemy.prototype._init = function(){
  this.interval.setSpeed(50+Math.floor(Math.random()*100));
  this.data.x = 2+Math.floor(Math.random()*(frame.data.width-4));
  this.data.y = 1;
};
Enemy.prototype._inactivate = function(){
  TMS.deleteTextAt(frame.data.x+this.data.x,frame.data.y+this.data.y,this.data.text);
};
Enemy.prototype._calculate = function(){
  this.move();
  if(this.checkHitFrame(frame)){
    this.init();
  }
};
Enemy.prototype._draw = function(){
  if(this.data.pX && this.data.pY){
    TMS.deleteTextAt(frame.data.x+this.data.pX,frame.data.y+this.data.pY,this.data.text);
  }
  TMS.insertTextAt(frame.data.x+this.data.x,frame.data.y+this.data.y,this.data.text);
};

// Enemy functions
Enemy.prototype.move = function(){
  this.data.pX = this.data.x;
  this.data.pY = this.data.y;
  this.data.x += this.data.dX;
  this.data.y += this.data.dY;
};
Enemy.prototype.checkHitFrame = function(frame){
  return (this.data.y>frame.data.height-2);
};

var frame;
var enemy;
TMS.onReady(function(){
  frame = new Frame({x:5,y:2});
  enemy = new Enemy();
});
