//=============================
// TM.Interval
//=============================
TM.Interval = function(speed, func){
  var skipInit = true;
  this.data = {};
  this.speed = speed;
  this.func = func;
  this.intervalId = null;
  TM.IObject.call(this, null, skipInit);
};
TM.Interval.prototype = Object.create(TM.IObject.prototype);
TM.Interval.prototype.constructor = TM.Interval;

// TM.IObject functions implementation
TM.Interval.prototype._init = function(){
  this.stopInterval();
  this.startInterval();
};
TM.Interval.prototype._inactivate = function(){
  this.stopInterval();
};

// TM.Interval public functions
TM.Interval.prototype.setSpeed = function(speed){
  this.speed = speed;
  this.stopInterval();
  this.init();
};

// TM.Interval private functions
TM.Interval.prototype.stopInterval = function(){
  if(this.intervalId) window.clearInterval(this.intervalId);
  this.intervalId = null;
};
TM.Interval.prototype.startInterval = function(){
  var _self = this;
  this.intervalId = window.setInterval(function(){
    _self.func();
  }, this.speed);
};
