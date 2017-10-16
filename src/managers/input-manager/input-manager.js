//=============================
// TM.InputManager
//=============================
// Object Type: TM.IObject
TM.InputManager = function(customTargetDomId,devMode){
  var targetDomId = customTargetDomId?customTargetDomId:TM.defaultSettings.screen.canvasId;
  try{
    this.targetDom = document.querySelector('#'+targetDomId);
    if(!this.targetDom){
      throw('[#'+domId+'] does not exist! ');
    }
  }
  catch(errorMessage){
    this.isActive = false;
    console.error('new TM.InputManager ERROR: '+errorMessage+' TM.InputManager is not created.');
    return;
  }
  this.devMode = devMode;
  this.keyboard = new TM.InputManager_Keyboard(this);
  TM.IObject.call(this);
};
TM.InputManager.prototype = Object.create(TM.IObject.prototype);
TM.InputManager.prototype.constructor = TM.InputManager;

// TM.IObject functions implementation
TM.InputManager.prototype._init = function(){};
TM.InputManager.prototype._inactivate = function(){};
