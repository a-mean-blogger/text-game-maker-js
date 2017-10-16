//=============================
// TM.DebugManager
//=============================
// Object Type: TM.IObject
TM.DebugManager = function(debugSetting){
  this.debugSetting = TM.common.mergeObjects(TM.defaultSettings.debug, debugSetting);

  try{
    this.outputDom = document.querySelector('#'+this.debugSetting.outputDomId);
    if(!this.outputDom){
      throw('[#'+this.debugSetting.outputDomId+'] does not exist! ');
    }
  }
  catch(errorMessage){
    this.isActive = false;
    console.error('new TM.DebugManager ERROR: '+errorMessage+' TM.DebugManager is not created.');
    return;
  }

  this.doms = {};
  TM.IObject.call(this);
};
TM.DebugManager.prototype = Object.create(TM.IObject.prototype);
TM.DebugManager.prototype.constructor = TM.DebugManager;

// TM.IObject functions implementation
TM.DebugManager.prototype._init = function(){};
TM.DebugManager.prototype._inactivate = function(){
  this.deleteAll();
};

// TM.DebugManager private functions
TM.DebugManager.prototype.replacer = function() {
  var checkedObjects = [];

  return function(key, value) {
    if(value && typeof(value) === 'object'){
      var index = checkedObjects.indexOf(value);
      if(index>-1){
        return '[Circular]';
      }
    }
    checkedObjects.push(value);
    return value;
  }
};

// TM.DebugManager pulbic functions
TM.DebugManager.prototype.print = function(name,data){
  if(this.debugSetting.devMode && this.isActive){
    if(!this.doms[name]){
      this.doms[name] = document.createElement('pre');
      this.outputDom.appendChild(this.doms[name]);
    }
    var title = '-- '+name+' --\n';
    var dataJson = JSON.stringify(data,this.replacer(data),2);
    this.doms[name].innerHTML = title+dataJson;
  }
  else {
    this.delete(name);
  }
};
TM.DebugManager.prototype.delete = function(name){
  if(this.doms[name]){
    if(this.doms[name].remove) this.doms[name].remove();
    else this.doms[name].parentElement.removeChild(this.doms[name]); //for IE
    delete this.doms[name];
  }
};
TM.DebugManager.prototype.deleteAll = function(){
  for(var task in this.doms){
    this.delete(task);
  }
};
