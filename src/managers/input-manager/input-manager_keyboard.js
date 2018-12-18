//=============================
// TM.InputManager_Keyboard
//=============================
// Object Type: TM.IObject
TM.InputManager_Keyboard = function(refInputManager){
  this.refInputManager = refInputManager;
  this.keyState = {};
  this.keyPressed = {};

  this.textBox = {
    dom: undefined,
    maxLength: undefined,
    callback: function(input){ },
    cursorSnap: {
      x: undefined,
      y: undefined,
    },
  };

  var _self = this;
  this.eventHandlers = {
    keydown: function(e){
      e.preventDefault();
      if(_self.refInputManager.isActive && _self.isActive){
        _self.keyState[e.keyCode] = true;
        _self.keyPressed[e.keyCode] = true;
      }
      if(_self.refInputManager.devMode && _self.refInputManager.isActive && _self.isActive){
        console.log('Keyboard Key Pressed keyCode: ', e.keyCode);
      }
    },
    keyup: function(e){
      e.preventDefault();
      delete _self.keyState[e.keyCode];
    },
    textBoxFocus: function(e){
      _self.textBox.dom.focus();
    },
    textBoxKeyup: function(e){
      var inputValue = _self.textBox.dom.value.slice(0,_self.textBox.dom.maxLength);
      var maxLengthOffset =inputValue.replace(TMS.FullwidthRegex,'$1 ').length-inputValue.length;

      _self.textBox.dom.maxLength = Math.max(_self.textBox.maxLength-maxLengthOffset, _self.textBox.maxLength/2);
      _self.textBox.dom.value = _self.textBox.dom.value.slice(0,_self.textBox.dom.maxLength);

      if(e.keyCode == 13){ //enter key
        TMS.cursor.unpin();
        TMS.insertTextAt(_self.textBox.cursorSnap.x, _self.textBox.cursorSnap.y, _self.textBox.dom.value);
        TMS.canvasContainer.removeChild(_self.textBox.dom);
        TMS.canvas.removeEventListener('focus', _self.eventHandlers.textBoxFocus);
        _self.textBox.dom.removeEventListener('keyup', _self.eventHandlers.textBoxKeyup);

        _self.textBox.callback(_self.textBox.dom.value);

        _self.textBox.dom = undefined;
      }
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
TM.InputManager_Keyboard.prototype._inactivate = function(){
  this.keyState = {};
  this.keyPressed = {};
};

// TM.InputManager_Keyboard functions - putTextBox
TM.InputManager_Keyboard.prototype.crateTextBox = function(callback, maxLength){
  if(!(TMS instanceof TM.ScreenManager)){
    console.error("TM.InputManager_Keyboard ERROR: 'putTextBox' function requires TMS instant(TM.ScreenManager)");
    return false;
  }

  if(this.textBox.dom){
    return false;
  }
  else{
    TMS.cursor.pin();
    this.textBox.callback = callback;
    this.textBox.maxLength = maxLength;
    this.textBox.cursorSnap.x = TMS.cursor.x;
    this.textBox.cursorSnap.y = TMS.cursor.y;

    var x = TMS.blockWidth*TMS.cursor.x;
    var y = TMS.blockHeight*(TMS.cursor.y-TMS.scrollOffsetY);
    var width = (TMS.cursor.x+maxLength>TMS.screenSetting.column)?TMS.screenSetting.column-TMS.cursor.x:maxLength;

    this.textBox.dom = document.createElement('input');
    this.textBox.dom.type ='text';
    this.textBox.dom.maxLength = maxLength;
    this.textBox.dom.style.position = 'absolute';
    this.textBox.dom.style.top = y * TMS.screenSetting.zoom+'px';
    this.textBox.dom.style.left = x * TMS.screenSetting.zoom+'px';
    this.textBox.dom.style.width = TMS.blockWidth * width * TMS.screenSetting.zoom+'px';
    this.textBox.dom.style.outline = 'none';
    this.textBox.dom.style.fontSize = TMS.screenSetting.fontSize * TMS.screenSetting.zoom+'px';
    this.textBox.dom.style.fontFamily = TMS.screenSetting.fontFamily;
    this.textBox.dom.style.letterSpacing = '0.05em';
    this.textBox.dom.style.border = 'none';

    TMS.canvasContainer.append(this.textBox.dom);
    TMS.canvas.addEventListener('focus', this.eventHandlers.textBoxFocus);

    this.textBox.dom.addEventListener('keyup', this.eventHandlers.textBoxKeyup);
    this.textBox.dom.focus();
  }
};
TM.InputManager_Keyboard.prototype.updateTextBoxValue = function(value){
  this.textBox.dom.value = value;
  this.textBox.dom.dispatchEvent(new KeyboardEvent('keyup'));
};

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
