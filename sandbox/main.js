var TMS = new TM.ScreenManager(),
    TMI = new TM.InputManager(null,true),
    TMD = new TM.DebugManager({devMode:true});

TMS.cursor.move(1,1);
TMS.insertText("TMS: new TM.ScreenManager() instance\n");
TMS.insertText("TMI: new TM.InputManager() instance\n");
TMS.insertText("TMD: new TM.DebugManager() instance\n\r");
