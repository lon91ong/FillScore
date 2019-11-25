// ==UserScript==
// @name         AutoFillScore
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fill the scores automatically
// @author       Xiaoniu29
// @match        http://211.81.249.99/js_main.aspx?xh=*
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @grant        none
// ==/UserScript==

var svrIP = "10.0.18.207"; //服务器IP
var col = 5; //期末:5,总评:7

var claName = ''; //保存班级名称
var quRes = [];
var sTable = [];
var sqlcmd = '';
var None = null; //适配python的定义

const insP = document.querySelector('#headDiv > ul');
const exeNode = document.createElement("li")
const clsNode = document.createElement("li")
exeNode.class = "top";
clsNode.class = "top";
exeNode.innerHTML = '<a class="top_link"><span> 执行填表</span></a>';
clsNode.innerHTML = '<a class="top_link"><span> 清空表单</span></a>';
var execBtn = insP.insertBefore(exeNode, insP.childNodes[8]);
var clsBtn = insP.insertBefore(clsNode,insP.childNodes[10]);
execBtn.style.display="none"; //暂不显示
clsBtn.style.display='none';
execBtn.addEventListener("click", execFill, true);
clsBtn.addEventListener("click", clsForm, true);
const iframe = document.getElementById("frame_content");

(function() {
    'use strict';

    var socket = new WebSocket("ws://" + svrIP + ":8001");
    socket.onopen = function() {
    /* 与服务器端连接成功后，自动执行 */
    };
    socket.onmessage = function(event) {
        /* 服务器端向客户端发送数据时，自动执行 */
        quRes = eval(event.data);
        console.info('收到' + quRes.length + '条记录。');
        //if (sTable.rows.length > 1) { execFill(); } //消息激发填充
    };
    socket.onclose = function(event) {
        /* 服务器端主动断开连接时，自动执行 */
        if (event.code == 3001) {
            console.log('ws closed');
            socket = null;
        } else {
            socket = null;
            console.log('ws connection error');
            //alert("数据库服务器连接失败！\n" + event.type + "\n请检查服务端！");
        }
    };
    socket.onerror = function(event) {
        if (socket.readyState == 1) {
            console.log('ws normal error: ' + event.type);
        }else{
            console.log('ws connection error');
        }
    };
    iframe.onload = function() {
        var tempNode = $('#TextBox1', iframe.contentDocument);
        if(tempNode.length) { //存在
            tempNode[0].value = "5678";
            tempNode = $('#Button1', iframe.contentDocument);
            if (tempNode.length && tempNode[0].value == "确  定") {
                tempNode[0].click();
            }else{
                try {
                    claName = $('#ddlBJMC > option:nth-child(1)', iframe.contentDocument)[0].attributes.value.nodeValue;
                    sTable = $('#DataGrid1', iframe.contentDocument)[0];
                    var saveNode = document.createElement("span"); //添加保存按钮
                    saveNode.innerHTML='<input type="submit" name="Button1" value="保  存" id="Button1" class="button" />';
                    var saveParent = $('.footbutton',iframe.contentDocument)[0];
                    saveParent.insertBefore(saveNode, saveParent.childNodes[0]);
                    execBtn.style.display="block"; //显示按钮
                    clsBtn.style.display="block";
                    $('#rad_4', iframe.contentDocument)[0].click(); //关闭自动保存
                    console.log('Class found:' + queStr);
                } catch (exception) {
                    console.log('Class not found!');
                    execBtn.style.display="none"; //不是填表页，隐藏按钮
                    clsBtn.style.display="none";
                }
                if (claName != '') {
                    sqlcmd = "SELECT id, score FROM students WHERE class = '" + encodeURI(claName)+ "';";
                    //if(socket.readyState == 1){ //net SQL
                    socket.send(sqlcmd);
                    //}else{
                    //    alert("数据服务器连接错误，请查验后刷新重试！");
                    //}
                }
            }
        }
    };
})();

function execFill() {
    var n = 0;
    for (var i = 1; i < sTable.rows.length; i++) { //排除表头行
        var idnum = sTable.rows[i].cells[1].innerText.replace(/(\s|\u00A0)+$/,'');//排除空白取学号
        for (var j = 0; j < quRes.length; j++) {
            if (idnum == quRes[j][0] && quRes[j][1] != null) {
                $(".text_nor.width68", sTable.rows[i].cells[col])[0].value = quRes[j][1];
                n++;
                break;
            } else if (idnum == quRes[j][0] && quRes[j][1] == null) { //没成绩
                if(idnum.slice(0,2)<queStr.slice(-4,-2)){
                    console.info(sTable.rows[i].cells[2].innerText + "-降级!");
                    $("select", sTable.rows[i].cells[8])[0].options[0].selected = true;
                }else{
                    console.info(sTable.rows[i].cells[2].innerText + "-缺考!");
                    $("select", sTable.rows[i].cells[8])[0].options[1].selected = true;
                }
            }
        }
    }
    //$('#Button1', iframe.contentDocument)[0].click(); //保存
};

function clsForm(){
    for (var i = 1; i < sTable.rows.length; i++) { //排除表头行
        $(".text_nor.width68", sTable.rows[i].cells[col])[0].value ='';
        $("select", sTable.rows[i].cells[8])[0].options[2].selected = true;
    }
    //$('#Button1', iframe.contentDocument)[0].click(); //保存
};
