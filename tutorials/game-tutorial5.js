// copy and paste this codes to main.js in starter program and open index.html on a web browser

var screenSetting = {
  // canvasId: 'tm-canvas',
  // frameSpeed: 40,
  // column: 60,
  // row: 20,
  // backgroundColor: '#151617',
  // webFontJsPath: 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js',
  // fontColor: '#F5F7FA',
  // fontFamily: 'monospace',
  // fontSource: null,
  // fontSize: 30,
  // zoom: 0.5,
  column: 55,
  row: 22,
  fontFamily: 'Nanum Gothic Coding',
  fontSource: 'https://fonts.googleapis.com/earlyaccess/nanumgothiccoding.css',
};

var charGroups = {
  wall: {
    chars: '■',
    isFullwidth: true,
    sizeAdj: 1.2,
    xAdj: -0.05,
    yAdj: 0.03,
  },
};

var debugSetting = {
  // devMode: false,
  // outputDomId: 'tm-debug-output',
  devMode: true,
};

var TMS = new TM.ScreenManager(screenSetting,charGroups),
    TMI = new TM.InputManager(screenSetting.canvasId,debugSetting.devMode),
    TMD = new TM.DebugManager(debugSetting);

TMS.cursor.hide();

var KEYSET = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
};
var frame = {
  x: 5,
  y: 2,
  width: 44,
  height: 18,
  score: 0,
};
var player = {
  x: 22,
  y: 10,
  text: "[-<>-]",
};
var enemy = {
  x: null,
  y: null,
  text: "X",
  turnCount: 0,
  turnCountMax: 5,
};

function calculate(){
  // check key and move player
  if(TMI.keyboard.checkKey(KEYSET.LEFT) && player.x>2) player.x--;
  if(TMI.keyboard.checkKey(KEYSET.UP) && player.y>1) player.y--;
  if(TMI.keyboard.checkKey(KEYSET.RIGHT) && player.x+player.text.length<frame.width-2) player.x++;
  if(TMI.keyboard.checkKey(KEYSET.DOWN) && player.y<frame.height-2) player.y++;
  processCollusion();

  //reset enemy
  if(enemy.y===null || enemy.y>frame.height-3){
    resetEnemy();
  }

  //move enemy
  if(++enemy.turnCount>enemy.turnCountMax){
    enemy.turnCount = 0;
    enemy.y++;
  }
  processCollusion();
}

function draw(){
  //clearScreen
  TMS.clearScreen();

  //draw score
  TMS.insertTextAt(frame.x,frame.y-1,"Score: ");
  TMS.insertText(frame.score);

  //draw frame
  for(var i=0; i<frame.height; i++){
    for(var j=0; j<frame.width; j++){
      if((i===0 || i==frame.height-1 || j===0 || j==frame.width-2)&&(j%2 === 0)){
        TMS.insertTextAt(frame.x+j,frame.y+i,"■");
      }
    }
  }

  //draw player
  TMS.insertTextAt(frame.x+player.x,frame.y+player.y,player.text);

  //draw enemy
  TMS.insertTextAt(frame.x+enemy.x,frame.y+enemy.y,enemy.text);
}

function resetEnemy(){
  enemy.x = 2+Math.floor(Math.random()*(frame.width-4));
  enemy.y = 1;
  enemy.turnCount = 0;
  // enemy.turnCountMax = 3+Math.floor(Math.random()*10);
  enemy.turnCountMax = 3;
}

function processCollusion(){
  if(player.y==enemy.y && player.x<=enemy.x && player.x+player.text.length>=enemy.x){
    resetEnemy();
    frame.score += 100;
  }
}

var mainInterval;
TMS.onReady(function(){
  mainInterval = window.setInterval(function(){
    calculate();
    draw();
    TMD.print("Player",{x:player.x,y:player.y});
  },30);
});
