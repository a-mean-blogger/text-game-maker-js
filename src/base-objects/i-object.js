//=============================
// TM.IObject
//=============================
TM.IObject = function(data, skipInit){
  this.isActive = null;
  this.data = TM.common.mergeObjects(this.data, data);
  if(!skipInit) this.init();
};

// TM.IObject functions
TM.IObject.prototype.init = function(){
  this._init();
  this.isActive = true;
};
TM.IObject.prototype.inactivate = function(){
  this._inactivate();
  this.isActive = false;
};

// TM.IObject interface functions
TM.IObject.prototype._init = function(){};
TM.IObject.prototype._inactivate = function(){};
