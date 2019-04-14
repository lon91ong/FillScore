'use strict';

var dbFileElm = document.getElementById('dbfile');
var bg = chrome.extension.getBackgroundPage();

//$('#idName').html("班级");//bg.queId;
//$('#idXpth').html(bg.queVal);

// Load a db from a file
dbFileElm.onchange = function() {
    //alert($('#fill-name').val());
    var f = dbFileElm.files[0];
    var r = new FileReader();
    r.onload = function() {
        //var Uints = new Uint8Array(r.result);
        //db = new SQL.Database(Uints);
        try {
            bg.worker.postMessage({ action: 'open', buffer: r.result }, [r.result]);
        } catch (exception) {
            bg.worker.postMessage({ action: 'open', buffer: r.result });
        }
    };
    r.readAsArrayBuffer(f);
    //bg.queId = $('#idName').val();
    //bg.queVal = $('#idXpth').val();
    
    if (bg.gPort != [] && bg.queVal != "") {
        //var sqlcmd = "SELECT id, score FROM students WHERE " + bg.queId + " = '" + bg.queVal + "';";
        setTimeout('bg.execute("SELECT id, score FROM students WHERE " + bg.queId + " = \'" + bg.queVal + "\';").then(value => {\
            bg.gPort.postMessage({ queryR: value[0].values });\
        }).catch(err => {\
            console.error(err);\
        })',2000);
    }
}