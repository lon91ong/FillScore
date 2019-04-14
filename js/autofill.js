'use strict';

const insP = document.querySelector('#headDiv > ul');
const exeNode = document.createElement("li")
exeNode.class = "top";
exeNode.innerHTML = '<a class="top_link"><span> 执行填表</span><!--[if gte IE 7]><!--></a>';
var execBtn = insP.insertBefore(exeNode, insP.childNodes[8]);
execBtn.style.display="none"; //先不显示
var queStr = ''; //保存班级名称
const iframe = document.getElementById("frame_content");
const port = chrome.runtime.connect(chrome.runtime.id, { name: 'msgSQL' }); //长消息端口
var quRes = [];
var sTable = [];
/*var idoc = iframe.contentDocument;
/* DOMContentLoaded
//document.addEventListener('DOMContentLoaded', function () {
//document.addEventListener('DOMSubtreeModified', function () {
//$(document).ready(function() {
// load
//$(document).load(function() {
	iframe.ready = function(){ //ready, onreadystatechange, load
	    //if (iframe.readyState==4 && iframe.status==200) {
});
*/
function execFill() {
    //var trs = [];
    //trs = sTable.getElementsByTagName("tr");
    //console.log("Rows:" + quRes.length + ":we are!");
    var n = 0;
    for (var i = 1; i < sTable.rows.length; i++) { //排除表头行
        //var tds = [];
        //tds = trs[i].getElementsByTagName("td");
        //var idnum = tds[1].innerText; //学号
        var idnum = sTable.rows[i].cells[1].innerText;
        //console.log('Here:'+ i+"--" + idnum);
        for (var j = 0; j < quRes.length; j++) {
            if (idnum == quRes[j][0] && quRes[j][1] != null) {
                //var inputs = [];
                //inputs = trs[i].getElementsByClassName("text_nor width68");
                //inputs[4].value = quRes[j][1];
                $(".text_nor.width68", sTable.rows[i].cells[7])[0].value = quRes[j][1];
                n++;
                break;
            } else if (idnum == quRes[j][0] && quRes[j][1] == null) { //没成绩
                //console.log(sTable.rows[i].cells[2].innerText + "没成绩!");
                if(idnum.slice(0,2)<queStr.slice(-4,-2)){
                	console.info(sTable.rows[i].cells[2].innerText + "-降级!");
                	//$("select", sTable.rows[i].cells[8])[0].value = "降级";
			$("select", sTable.rows[i].cells[8])[0].options[0].selected = true;
                }else{
                	console.info(sTable.rows[i].cells[2].innerText + "-缺考!");
                	//$("select", sTable.rows[i].cells[8])[0].value = "缺考";
			$("select", sTable.rows[i].cells[8])[0].options[1].selected = true;
                }
            }
        }
    }
    port.postMessage({ action: 'notice', conStr: JSON.stringify(n) });
    $('#Button1', iframe.contentDocument)[0].click(); //保存
}

port.onMessage.addListener(function(msg) {
    console.info('收到' + msg.queryR.length + '条记录。');
    execBtn.addEventListener("click", execFill, true);
    quRes = msg.queryR;
    if (sTable.rows.length > 1) { execFill(); }
});
//var observer = new MutationObserver(function(mutations) {
/*
mutations.forEach(function(mutation) {
  for (var i = 0; i < mutation.addedNodes.length; i++)
    insertedNodes.push(mutation.addedNodes[i]);
})
*/
iframe.onload = function() {
    //idoc.addEventListener('DOMContentLoaded', function() {
    //iframe.ready = function(){
    //setTimeout("console.log('timeout:'+$('#ddlBJMC > option:nth-child(1)',iframe.contentDocument)[0].attributes.value.nodeValue)", 2000);
    //setTimeout("\
    try {
        $('#TextBox1', iframe.contentDocument)[0].value = "5678";
        if ($('#Button1', iframe.contentDocument)[0].value == "确  定") {
            $('#Button1', iframe.contentDocument)[0].click();
            //console.log("自动确定测试！");
        }
    } catch (exception) {
        console.log('Button not found!');
    }
    try {
        queStr = $('#ddlBJMC > option:nth-child(1)', iframe.contentDocument)[0].attributes.value.nodeValue;
        sTable = $('#DataGrid1', iframe.contentDocument)[0];
        execBtn.style.display="block";
        $('#rad_4', iframe.contentDocument)[0].click(); //关闭自动保存
        console.log('Class found:' + queStr);
    } catch (exception) {
        console.log('Class not found!');
        execBtn.style.display="none"; //不是填表页，隐藏按钮
    } //", 2000);

    if (queStr != '') {
        try {
            port.postMessage({ action: 'query', conStr: queStr });
        } catch (err) {
            alert("莫名的掉坑里!\n" + err+"\n刷新一下试试看！");
        }
        /* 发送短消息并回显响应
        chrome.runtime.sendMessage({ queryS: queStr }, function(response) {
            console.log('Response from Bcakground:' + response);
        });*/
    }
};
//observer.observe(iframe, { 'attributes': true });
//observer.disconnect();
