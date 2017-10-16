//=============================
// TM.InputManager_Keyboard
//=============================
// Object Type: TM.IObject
TM.InputManager_Keyboard = function(refInputManager){
  this.refInputManager = refInputManager;
  this.keyState = {};
  this.keyPressed = {};

  var _self = this;
  this.eventHandlers = {
    keydown: function(e){
      e.preventDefault();
      if(_self.refInputManager.isActive && _self.isActive){
        _self.keyState[e.keyCode] = true;
        _self.keyPressed[e.keyCode] = true;
      }
      if(_self.refInputManager.devMode){
        console.log('Keyboard Key Pressed keyCode: ', e.keyCode);
      }
    },
    keyup: function(e){
      e.preventDefault();
      delete _self.keyState[e.keyCode];
    },
  };
  TM.IObject.call(this);
};
TM.InputManager_Keyboard.prototype = Object.create(TM.IObject.prototype);
TM.InputManager_Keyboard.prototype.constructor = TM.InputManager_Keyboard;

// TM.IObject functions implementation
TM.InputManager_Keyboard.prototype._init = function(){
  this.refInputManager.targetDom.addEventListener('keydown', this.eventHandlers.keydown);
  this.refInputManager.targetDom.addEventListener('keyup', this.eventHandlers.keyup);
};
TM.InputManager_Keyboard.prototype._inactivate = function(){};

// TM.InputManager_Keyboard functions - keyState
TM.InputManager_Keyboard.prototype.checkKeyState = function(keyCode){
  if(this.keyState[keyCode]) {
    return true;
  }
  else return false;
};
TM.InputManager_Keyboard.prototype.checkKeyStateAny = function(){
  if(Object.keys(this.keyState).length){
    return true;
  }
  else return false;
};
TM.InputManager_Keyboard.prototype.removeKeyState = function(keyCode){
  delete this.keyState[keyCode];
};
TM.InputManager_Keyboard.prototype.clearKeyState = function(){
  this.keyState = {};
};

// TM.InputManager_Keyboard functions - keyPressed
TM.InputManager_Keyboard.prototype.checkKeyPressed = function(keyCode){
  if(this.keyPressed[keyCode]) {
    delete this.keyPressed[keyCode];
    return true;
  }
  else return false;
};
TM.InputManager_Keyboard.prototype.checkKeyPressedAny = function(){
  if(Object.keys(this.keyPressed).length){
    this.keyPressed = {};
    return true;
  }
  else return false;
};
TM.InputManager_Keyboard.prototype.removeKeyPressed = function(keyCode){
  delete this.keyPressed[keyCode];
};
TM.InputManager_Keyboard.prototype.clearKeyPressed = function(){
  this.keyPressed = {};
};

// TM.InputManager_Keyboard functions - key
TM.InputManager_Keyboard.prototype.checkKey = function(keyCode){
  return this.checkKeyPressed(keyCode) || this.checkKeyState(keyCode);
};
TM.InputManager_Keyboard.prototype.checkKeyAny = function(){
  return this.checkKeyPressedAny() || this.checkKeyStateAny();
};
TM.InputManager_Keyboard.prototype.removeKey = function(keyCode){
  this.removeKeyPressed(keyCode);
  this.removeKeyState(keyCode);
};
TM.InputManager_Keyboard.prototype.clearKey = function(){
  this.clearKeyPressed();
  this.clearKeyState();
};

// TM.InputManager_Keyboard functions - getInput
TM.InputManager_Keyboard.prototype.getInput = function(question){
  return prompt(question);
};
