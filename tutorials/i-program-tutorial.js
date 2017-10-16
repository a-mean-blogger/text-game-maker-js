// copy and paste this codes to main.js in starter program and open index.html on a web browser

var TMS = new TM.ScreenManager(),
    TMI = new TM.InputManager(null,true);

//=============================
// Frame
//=============================
// Object Type: TM.IObject
var Frame = function(data){
  this.data = {
    x: undefined,
    y: undefined,
    frame: [
      '+-----------<  My Frame  >-----------+\n',
      '|                                    |\n',
      '|                                    |\n',
      '|                                    |\n',
      '|                                    |\n',
      '|                                    |\n',
      '|                                    |\n',
      '|                                    |\n',
      '+------------------------------------+\n'
    ],
    todayText: null,
  };
  TM.IObject.call(this, data);
};
Frame.prototype = Object.create(TM.IObject.prototype);
Frame.prototype.constructor = Frame;

// TM.IObject functions implementation
Frame.prototype._init = function(){
  this.updateTodayText();
  this.drawFrame();
  this.drawTodayText();
};
Frame.prototype._inactivate = function(){
  this.drawTodayText(true);
  this.drawFrame(true);
};

// Frame functions
Frame.prototype.updateTodayText = function(){
  var today = new Date();
  var year = today.getFullYear();
  var month = today.getMonth()+1;
  var date = today.getDate();
  this.data.todayText = year+'-'+month+'-'+date;
};
Frame.prototype.drawFrame = function(remove){
  TMS.cursor.move(this.data.x, this.data.y);
  for(var i=0; i<this.data.frame.length; i++){
    if(remove) TMS.deleteText(this.data.frame[i]);
    else TMS.insertText(this.data.frame[i]);
  }
};
Frame.prototype.drawTodayText = function(remove){
  TMS.cursor.move(this.data.x+2, this.data.y+1);
  if(remove) TMS.deleteText(this.data.todayText);
  else TMS.insertText(this.data.todayText);
};

//=============================
// MovingObject
//=============================
// Object Type: TM.ILoopObject
var MovingObject = function(speed, data){
  this.data = {
    x: undefined,
    y: undefined,
    dX: undefined, // x direction -1 or 1 (-1:left, 1:right)
    pX: null, // previous x position
    text: '[<>]',
    width: 4,
    turnCount: 0,
  };
  TM.ILoopObject.call(this, speed, data);
};
MovingObject.prototype = Object.create(TM.ILoopObject.prototype);
MovingObject.prototype.constructor = MovingObject;

// TM.ILoopObject functions implementation
MovingObject.prototype._init = function(){
  this.data.pX = this.data.x;
};
MovingObject.prototype._inactivate = function(){
  TMS.deleteTextAt(this.data.x, this.data.y, this.data.text);
};
MovingObject.prototype._calculate = function(){
  this.move();
  this.changeDirection();
};
MovingObject.prototype._draw = function(){
  TMS.deleteTextAt(this.data.pX, this.data.y, this.data.text);
  TMS.insertTextAt(this.data.x, this.data.y, this.data.text);
};

// MovingObject function
MovingObject.prototype.move = function(){
  this.data.pX = this.data.x;
  this.data.x += this.data.dX;
};
MovingObject.prototype.changeDirection = function(){
  this.data.turnCount++;
  if(this.data.turnCount%10 == 0){
    this.data.turnCount = 0;
    this.data.dX = (this.data.dX == 1)?-1:1;
  }
};

//=============================
// Program_main
//=============================
// Object Type: TM.IProgram
var Program_main = function(){
  var speed = 100;
  this.data = {};
  this.objects = {
    frame: null,
    movingObjects: [],
  };
  TM.IProgram.call(this, speed);
};
Program_main.prototype = Object.create(TM.IProgram.prototype);
Program_main.prototype.constructor = Program_main;

// Static properties
Program_main.KEYSET = {
  ESC: 27, // esc key
};

// TM.IProgram functions implementation
Program_main.prototype._init = function(){
  TMS.cursor.hide();
  this.objects.frame = new Frame({x:2,y:2});
};
Program_main.prototype._inactivate = function(){
  TMS.clearScreen();
};
Program_main.prototype._calculate = function(){};
Program_main.prototype._draw = function(){};
Program_main.prototype._timeline = function(loopCount){
  if(loopCount == 10) this.objects.movingObjects.push(new MovingObject(200,{x:4,y:5,dX:1}));
  if(loopCount == 20) this.objects.movingObjects.push(new MovingObject(400,{x:24,y:7,dX:-1}));
  if(loopCount == 30) this.objects.movingObjects.push(new MovingObject(300,{x:16,y:9,dX:1}));
};
Program_main.prototype._getInput = function(){
  if(TMI.keyboard.checkKey(Program_main.KEYSET.ESC)){
    this.inactivate();
    this.init();
  }
};

var main = new Program_main();
main.init();
