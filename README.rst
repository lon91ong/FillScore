自动填写成绩
===============

使用说明
----------

    由Python版REST API服务器和Excel VBA版客户端(ScoreIn.xlsm)以及浏览器端的Greasemonkey(油猴)脚本构成。

油猴插件请自行在浏览器应用市场搜索关键字Tampermonkey安装。 `QQ浏览器 <https://pcbrowser.dd.qq.com/pcbrowserbig/qbextension/update/20191117/dhdgffkkebhmkfjojejmpbldmpobfkfo.crx>`_ ， `猎豹浏览器 <https://pcbrowser.dd.qq.com/pcbrowserbig/qbextension/update/20191117/dhdgffkkebhmkfjojejmpbldmpobfkfo.crx>`_ ，`360浏览器 <http://download.chrome.360.cn/ext/Tampermonkey_4.8.41_dhdgffkkebhmkfjojejmpbldmpobfkfo.crx>`_ ，插件安装完成后，打开 `脚本地址 <https://gitee.com/sobweb/FillScore/raw/master/AutoFillScore.user.js>`_ ，点击“安装脚本“即可。

Step 1: Excle操作部分
----------------------

在Excel中计算成绩并提交数据到服务器中的数据库保存

**step 1.1** 用Excel或WPS打开”成绩录入.xlsm", 并“启用宏”。

.. image:: images/启用宏1.png

.. image:: images/启用宏2.png


**step 1.2-1** 录入各实验成绩，得到平均分并保存。

.. image:: images/成绩录入1.png

**step 1.2-2** 直接录入平均成绩，调整成绩并保存

.. image:: images/成绩录入2.png

Setp 2: 浏览器自动填成绩表
-------------------------
Step 2：在浏览器中打开成绩录入页面，由脚本自动填写成绩，手动保存/提交。

.. image:: images/填表.png

说明结束-END-
============

JavaScript的习作
------------------

用时一周，代码不多，关键是不习惯JavaScript太灵活的语法，慢慢啃，好歹是东拼西凑的整出来了！

还有待学习的几个方面：

- Promise 这个和平成接触的python用法很不一样，虽然懵懵懂懂的用对了一下，但是还没整太明白，需要再学学。
 参考资料 `迷你书 <http://liubin.org/promises-book/>`_ ; ES6 Promise 简明指南:`中文版 <https://ifyour.github.io/2018/05/29/ES6-Promise-简明指南/>`_ , `英文版 <https://codeburst.io/a-simple-guide-to-es6-promises-d71bacd2e13a>`_ ; `简明实例 <https://blog.dingkewz.com/post/tech/javascript_promise/>`_

- MutationObserver 这个监听没整明白
 参考 `高效监听DOM变动 <https://hijiangtao.github.io/2017/08/03/How-to-Manipulate-DOM-Effectively/>`_ `参考二 <https://javascript.ruanyifeng.com/dom/mutationobserver.html>`_

- Fetch发出的请求返回值是Promise，需要通过 `IIFE(立即执行函数) <https://segmentfault.com/a/1190000003985390>`_ 包装才能得到返回结果
 `参考mozilla <https://developer.mozilla.org/zh-CN/docs/Glossary/%E7%AB%8B%E5%8D%B3%E6%89%A7%E8%A1%8C%E5%87%BD%E6%95%B0%E8%A1%A8%E8%BE%BE%E5%BC%8F>`_ , `知乎 <https://zhuanlan.zhihu.com/p/32689741>`_ 

 `Example <https://www.it-swarm.net/zh/javascript/%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8%E5%87%BD%E6%95%B0asyncawait%E4%BB%8E%E5%BC%82%E6%AD%A5%E5%87%BD%E6%95%B0%E8%BF%94%E5%9B%9E%E5%80%BC%EF%BC%9F/837141330/>`_ ：(async ()=>{result = await launchFetch(encodeURI(urlString));})();


记忆深刻的坑
--------------

**iframe里面的子页面元素提取，空耗了半天的时间在Google上转悠，真真的巨坑啊！**

autofill.js文件里面大多数注释掉的代码都是在这个坑里转悠的记录

插件开发的高价值资料
----------------------

- `【干货】Chrome插件(扩展)开发全攻略 <http://www.cnblogs.com/liuxianan/p/chrome-plugin-develop.html>`_
   个人觉得比 `360插件开发文档 <http://open.chrome.360.cn/extension_dev/overview.html>`_ 实用的多
- `火狐的官方文档 <https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/Port>`_
   有 `中文的 <https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/A_re-introduction_to_JavaScript>`_ ，但是翻译的不全

