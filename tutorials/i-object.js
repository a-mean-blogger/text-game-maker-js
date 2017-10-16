// copy and paste this codes to main.js in starter program and open index.html on a web browser

var TMS = new TM.ScreenManager();

//=============================
// Frame
//=============================
// Object Type: TM.IObject
// Description: a sample game frame object
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

var myFrame = new Frame({x:2,y:2});
