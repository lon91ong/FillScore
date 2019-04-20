'use strict';
// background 引用popup页面DOM
//var popup = chrome.extension.getViews({ type: 'popup' })[0];
//console.log(popup.location.href);

var worker = new Worker("./js/worker.sql.js");
//worker.onerror = error;
var gPort = [];
var queId = 'class';
var queVal = '';

// 数据库查询功能函数
function execute(commands) {
    console.log(commands);
    return new Promise(function(resolve, reject) {
        worker.onmessage = function(event) {
            var results = event.data.results;
            //console.info("**********************\n", event.data.results);
            //console.info("Type of data.results:",typeof(event.data.results));
            if (typeof(results) != 'undefined') { //数据库读取成功
                resolve(results);
            } else {
                reject(new Error('DateBase Error!'));
            }
        };
        worker.postMessage({ action: 'exec', sql: commands });
    });
}

/* 获取当前页面tabid
function getCurrentTabId(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (callback) callback(tabs.length ? tabs[0].id : null);
    });
}*/

function qRequest(msg,sendingPort) {
    //if(msg.action =="query"){
    let act = {
        'query': () => {
            if (queVal != msg.conStr) { //防止重复
                queVal = msg.conStr;
                //console.log('收到长连接消息：', msg.queryS);
                var sqlcmd = "SELECT id, score FROM students WHERE " + queId + " = '" + queVal + "';";
                execute(sqlcmd).then(value => {
                    gPort.postMessage({ queryR: value[0].values });
                }).catch(err => {
                    console.error(err);
                });
            }
        },
        'notice': () => {
            chrome.notifications.create(null, {
                type: 'basic',
                iconUrl: '../data/icons/512.png',
                title: '提示',
                message: '成功录入' + msg.conStr + '个成绩！\n保存成功，请手动提交！\n请自行检查成绩，录错后果自负!'
            });
        },
        'enable': () => { // extension enabled
            //getCurrentTabId(tabId => {
                chrome.pageAction.show(sendingPort.sender.tab.id);
                console.info('Extension enabled in tab:'+sendingPort.sender.tab.id);
            //});
        },
    }
    act[msg.action]();
}

// 长消息
chrome.runtime.onConnect.addListener(function(port) {
    if (port.name == 'msgSQL') {
        gPort = port;
        port.onMessage.addListener(qRequest);
    }
});
