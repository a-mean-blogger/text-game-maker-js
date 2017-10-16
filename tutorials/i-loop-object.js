// copy and paste this codes to main.js in starter program and open index.html on a web browser

var TMS = new TM.ScreenManager();

//=============================
// MovingObject
//=============================
// Object Type: TM.ILoopObject
// Description: a sample moving object
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

var myMovingObject = new MovingObject(200,{x:12,y:2,dX:1});
