//=============================
// TM.IProgram
//=============================
TM.IProgram = function(speed, data, objects){
  var skipInit = true;
  this.loopCount = 0;
  this.objects = TM.common.mergeObjects(this.objects, objects);
  TM.ILoopObject.call(this, speed, data, skipInit);
};
TM.IProgram.prototype = Object.create(TM.ILoopObject.prototype);
TM.IProgram.prototype.constructor = TM.IProgram;

// TM.ILoopObject functions inheritance
TM.IProgram.prototype.init = function(){
  TM.ILoopObject.prototype.init.call(this);
  this.loopCount = 0;
};
TM.IProgram.prototype.inactivate = function(){
  TM.ILoopObject.prototype.inactivate.call(this);
  for(var key in this.objects){
    if(Array.isArray(this.objects[key])){
      for (var i=this.objects[key].length-1; i>=0; i--){
        this.objects[key][i].inactivate();
      }
    }
    else if(this.objects[key]) {
      this.objects[key].inactivate();
    }
  }
};
TM.IProgram.prototype.calculate = function(){
  TM.ILoopObject.prototype.calculate.call(this);
  this.loopCount++;
  this.timeline(this.loopCount);
  this.getInput();
};
TM.IProgram.prototype.draw = function(){
  TM.ILoopObject.prototype.draw.call(this);
  this._draw();
};

// TM.IProgram functions
TM.IProgram.prototype.timeline = function(loopCount){
  this._timeline(loopCount);
};
TM.IProgram.prototype.getInput = function(){
  this._getInput();
};

// TM.IProgram interface functions
TM.IProgram.prototype._init = function(){};
TM.IProgram.prototype._inactivate = function(){};
TM.IProgram.prototype._calculate = function(){};
TM.IProgram.prototype._draw = function(){};
TM.IProgram.prototype._timeline = function(loopCount){};
TM.IProgram.prototype._getInput = function(){};
