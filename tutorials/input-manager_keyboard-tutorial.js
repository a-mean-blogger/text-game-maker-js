// copy and paste this codes to main.js in starter program and open index.html on a web browser

var TMS = new TM.ScreenManager()
    TMI = new TM.InputManager(null, true);

var KEYSET = {
  A: 65,
  S: 83,
  D: 68,
};

var myInputMgr = new TM.Interval(200,function(){
  var textA = "TMI.keyboard.checkKeyState(KEYSET.A)";
  if(TMI.keyboard.checkKeyState(KEYSET.A)) TMS.insertTextAt(1,1,textA);
  else TMS.deleteTextAt(1,1,textA);

  var textS = "TMI.keyboard.checkKeyPressed(KEYSET.S)";
  if(TMI.keyboard.checkKeyPressed(KEYSET.S)) TMS.insertTextAt(1,2,textS);
  else TMS.deleteTextAt(1,2,textS);

  var textD = "TMI.keyboard.checkKey(KEYSET.D)";
  if(TMI.keyboard.checkKey(KEYSET.D)) TMS.insertTextAt(1,3,textD);
  else TMS.deleteTextAt(1,3,textD);
})
myInputMgr.init();
