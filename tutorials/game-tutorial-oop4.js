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
var Enemy = function(data){
  this.speed = null;
  this.data = {
    refMainObjects: undefined,
    x: null,
    y: null,
    pX: null,
    pY: null,
    dX: 0,
    dY: 1,
    text: "X",
  };
  TM.ILoopObject.call(this, this.speed, data);
};
Enemy.prototype = Object.create(TM.ILoopObject.prototype);
Enemy.prototype.constructor = Enemy;

// TM.ILoopObject functions implementation
Enemy.prototype._init = function(){
  var frame = this.data.refMainObjects.frame;
  this.interval.setSpeed(50+Math.floor(Math.random()*100));
  this.data.x = 2+Math.floor(Math.random()*(frame.data.width-4));
  this.data.y = 1;
};
Enemy.prototype._inactivate = function(){
  var frame = this.data.refMainObjects.frame;
  TMS.deleteTextAt(frame.data.x+this.data.x,frame.data.y+this.data.y,this.data.text);
};
Enemy.prototype._calculate = function(){
  var frame = this.data.refMainObjects.frame;
  this.move();
  if(this.checkHitFrame(frame)){
    this.init();
  }
};
Enemy.prototype._draw = function(){
  var frame = this.data.refMainObjects.frame;
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

//=============================
// Player
//=============================
// Object Type: TM.ILoopObject
var Player = function(data){
  this.speed = 30;
  this.data = {
    x: undefined,
    y: undefined,
    refMainObjects: undefined,
    pX: null,
    pY: null,
    dX: 0,
    dY: 0,
    text: "[-<>-]",
  };
  TM.ILoopObject.call(this, this.speed, data);
};
Player.prototype = Object.create(TM.ILoopObject.prototype);
Player.prototype.constructor = Player;

// TM.ILoopObject functions implementation
Player.prototype._init = function(){};
Player.prototype._inactivate = function(){
  var frame = this.data.refMainObjects.frame;
  TMS.deleteTextAt(frame.data.x+this.data.x,frame.data.y+this.data.y,this.data.text);
};
Player.prototype._calculate = function(){
  this.move();
};
Player.prototype._draw = function(){
  var frame = this.data.refMainObjects.frame;
  if(this.data.pX && this.data.pY){
    TMS.deleteTextAt(frame.data.x+this.data.pX,frame.data.y+this.data.pY,this.data.text);
  }
  TMS.insertTextAt(frame.data.x+this.data.x,frame.data.y+this.data.y,this.data.text);
};

// Player functions
Player.prototype.move = function(){
  this.data.pX = this.data.x;
  this.data.pY = this.data.y;
  this.data.x += this.data.dX;
  this.data.y += this.data.dY;
  this.data.dX = 0;
  this.data.dY = 0;
};
Player.prototype.updateDirection = function(dX,dY){
  this.data.dX += dX;
  this.data.dY += dY;
};

//=============================
// Program_Main
//=============================
// Object Type: TM.IProgrm
var Program_Main = function(){
  this.speed = 30;
  this.data = {};
  this.objects = {
    frame: null,
    enemy: null,
    player: null,
  };
  TM.IProgram.call(this, this.speed);
};
Program_Main.prototype = Object.create(TM.IProgram.prototype);
Program_Main.prototype.constructor = Program_Main;

// Static properties
Program_Main.KEYSET = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
};

// TM.IProgram functions implementation
Program_Main.prototype._init = function(){
  TMS.cursor.hide();
  this.objects.frame = new Frame({x:5,y:2});
  this.objects.enemy = new Enemy({refMainObjects:this.objects});
  this.objects.player = new Player({x:22,y:10,refMainObjects:this.objects});
};
Program_Main.prototype._inactivate = function(){};
Program_Main.prototype._calculate = function(){
  var player = this.objects.player;
  TMD.print("Player",{x:player.data.x,y:player.data.y});
};
Program_Main.prototype._draw = function(){};
Program_Main.prototype._timeline = function(loopCount){};
Program_Main.prototype._getInput = function(){
  var player = this.objects.player;
  var frame = this.objects.frame;
  if(TMI.keyboard.checkKey(Program_Main.KEYSET.LEFT) && player.data.x>2){
    player.updateDirection(-1,0);
  }
  if(TMI.keyboard.checkKey(Program_Main.KEYSET.UP) && player.data.y>1){
    player.updateDirection(0,-1);
  }
  if(TMI.keyboard.checkKey(Program_Main.KEYSET.RIGHT) && player.data.x+player.data.text.length<frame.data.width-2){
    player.updateDirection(1,0);
  }
  if(TMI.keyboard.checkKey(Program_Main.KEYSET.DOWN) && player.data.y<frame.data.height-2){
    player.updateDirection(0,1);
  }
};

var main = new Program_Main();
TMS.onReady(function(){
  main.init();
});
