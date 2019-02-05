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
    value: undefined,
    maxLength: undefined,
    callback: function(input){ },
    interval: undefined,
    cursorSnap: undefined,
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
    textBoxKeydown: function(e){
      if(e.keyCode == 13){ //'Enter' key
        TMS.cursor.paste(_self.textBox.cursorSnap);
        _self.truncateText();
        TMS.cursor.unpin();

        window.clearInterval(_self.textBox.interval);
        TMS.canvasContainer.removeChild(_self.textBox.dom);
        TMS.canvas.removeEventListener('focus', _self.eventHandlers.textBoxFocus);
        _self.textBox.dom.removeEventListener('keyup', _self.eventHandlers.textBoxKeydown);
        _self.textBox.dom = undefined;
        _self.textBox.callback(_self.textBox.value);
        TMS.canvas.focus();
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

// TM.InputManager_Keyboard functions - getText
TM.InputManager_Keyboard.prototype.getText = function(maxLength, callback){
  if(!(TMS instanceof TM.ScreenManager)){
    console.error("TM.InputManager_Keyboard ERROR: 'getText' function requires TMS instant(TM.ScreenManager)");
    return false;
  }

  if(this.textBox.dom){
    return false;
  }
  else{
    this.textBox.callback = callback;
    this.textBox.maxLength = maxLength;
    this.textBox.cursorSnap = TMS.cursor.copy();

    TMS.cursor.pin();
    TMS.cursor.show();

    this.textBox.dom = document.createElement('input');
    this.textBox.dom.type ='text';
    this.textBox.dom.maxLength = maxLength;
    this.textBox.dom.style.position = 'absolute';
    this.textBox.dom.style.top = '-'+TMS.blockHeight+'px';
    this.textBox.dom.style.left = 0;

    // for debug
    // var x = TMS.blockWidth*TMS.cursor.x;
    // var y = TMS.blockHeight*(TMS.cursor.y-TMS.scrollOffsetY);
    // var width = (TMS.cursor.x+maxLength>TMS.screenSetting.column)?TMS.screenSetting.column-TMS.cursor.x:maxLength;
    // this.textBox.dom.style.top = 50+y * TMS.screenSetting.zoom+'px';
    // this.textBox.dom.style.left = x * TMS.screenSetting.zoom+'px';
    // this.textBox.dom.style.width = TMS.blockWidth * width * TMS.screenSetting.zoom+'px';
    // this.textBox.dom.style.outline = 'none';
    // this.textBox.dom.style.fontSize = TMS.screenSetting.fontSize * TMS.screenSetting.zoom+'px';
    // this.textBox.dom.style.fontFamily = TMS.screenSetting.fontFamily;
    // this.textBox.dom.style.letterSpacing = '0.05em';
    // this.textBox.dom.style.border = 'none';

    TMS.canvasContainer.appendChild(this.textBox.dom);
    TMS.canvas.addEventListener('focus', this.eventHandlers.textBoxFocus);

    this.textBox.dom.addEventListener('keydown', this.eventHandlers.textBoxKeydown);
    this.textBox.dom.focus();

    var _self = this;
    this.textBox.interval = window.setInterval(function(){
      _self.textBox.dom.selectionStart = _self.textBox.dom.value.length;
      _self.textBox.dom.selectionEnd = _self.textBox.dom.value.length;

      if(_self.textBox.value != _self.textBox.dom.value) _self.truncateText();
    }, 40); // ~24 FPS

    return true;
  }
};
TM.InputManager_Keyboard.prototype.updateText = function(value){
  if(!this.textBox.dom) {
    return false;
  }
  else {
    this.textBox.dom.value = value;

    return true;
  }
};
TM.InputManager_Keyboard.prototype.truncateText = function(){
    var text = this.textBox.dom.value;
    var textWidth = text.replace(TMS.FullwidthRegex,'$1 ').length;

    //truncate text with fullwidth characters
    var isTruncated = false;
    while(textWidth>this.textBox.maxLength){
      isTruncated = true;
      text = text.slice(0,text.length-1);
      textWidth = text.replace(TMS.FullwidthRegex,'$1 ').length;
    }

    this.textBox.value = text;
    if(isTruncated) this.textBox.dom.value = text;

    //print the text and move cursor
    TMS.cursor.unpin();
    TMS.insertTextAt(this.textBox.cursorSnap.x, this.textBox.cursorSnap.y, text);
    TMS.cursor.pin();

    //fill the rest of space with empty spaces
    var blanks = this.textBox.maxLength-textWidth;
    for(var i=0; i<blanks; i++) TMS.insertText(' ');
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
