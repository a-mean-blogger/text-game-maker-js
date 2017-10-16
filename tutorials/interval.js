// copy and paste this codes to main.js in starter program and open index.html on a web browser

var TMS = new TM.ScreenManager();

var myWatch = new TM.Interval(1000,function(){
  var date = new Date();
  TMS.insertTextAt(1,1,date.toLocaleTimeString());
})
myWatch.init();
