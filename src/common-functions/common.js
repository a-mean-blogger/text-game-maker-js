TM.common = {};

TM.common.getBlockWidth = function(fontSize){
  return fontSize*0.6;
};
TM.common.getBlockHeight = function(fontSize){
  var blockHeight;
  if(fontSize < 3){
    blockHeight = fontSize;
  } else {
    var offsets = [6,7,7];
    var index = 0;
    var adjustment = 1;
    var val = fontSize-3;

    var recursive = function(val){
      if(val-offsets[index] <= 0) return;
      else {
        val -= offsets[index];
        adjustment++;
        index = (index+1)%3;
        recursive(val);
      }
    };

    recursive(val);
    blockHeight = fontSize + adjustment;
  }
  return blockHeight;
};
TM.common.isNumber = function(num){
  if(num === 0|| (num && num.constructor == Number)) return true;
  else return false;
};
TM.common.getCharGroup = function(charGroups, char){
  for(var group in charGroups){
    var charset = charGroups[group];
    var regex = new RegExp('^['+charset.chars+']$');
    if(regex.test(char)) return charset;
  }
};
TM.common.getFullwidthRegex = function(charGroups){
  var string = '';
  for(var group in charGroups){
    var charset = charGroups[group];
    if(charset&&charset.isFullwidth) string += charset.chars;
  }
  if(string) return new RegExp('(['+string+'])','g');
};
TM.common.includeScript = function(ScriptPath, onload){
  if(!ScriptPath) return;

  var script = document.querySelector('script[src="'+ScriptPath+'"]');
  if(!script){
    script = document.createElement('script');
    script.src = ScriptPath;
    script.onload = onload;
    document.getElementsByTagName('head')[0].appendChild(script);
  }
};
TM.common.checkFontLoadedByWebFont = function(fontName){
  var alteredFontName = fontName.replace(/ /g,'').toLowerCase();
  var fontAppliedDom = document.querySelector('.wf-'+alteredFontName+'-n4-active');
  return fontAppliedDom?true:false;
};
TM.common.mergeObjects = function(object1, object2){
  var mergedObject = {};
  var objects = [object1, object2];
  for(var i=0; i<objects.length; i++){
    for(var key in objects[i]){
      mergedObject[key] = objects[i][key];
    }
  }
  return mergedObject;
};
