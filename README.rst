自动填写成绩
===============

使用说明
----------

SELECT id, score FROM students WHERE class = 'Your Class'

如上所述，成绩保存在students表单里，students表单有学号（id）、姓名（name）、班级（class）和成绩（score）四个字段
（待续...）

JavaScript的习作
------------------

用时一周，代码不多，关键是不习惯JavaScript太灵活的语法，慢慢啃，好歹是东拼西凑的整出来了！

还有待学习的几个方面：

- Promise 这个和平成接触的python用法很不一样，虽然懵懵懂懂的用对了一下，但是还没整太明白，需要再学学。
 参考资料 `迷你书 <http://liubin.org/promises-book/>`_

- MutationObserver 这个监听没整明白
 参考 `高效监听DOM变动 <https://hijiangtao.github.io/2017/08/03/How-to-Manipulate-DOM-Effectively/>`_ `参考二 <https://javascript.ruanyifeng.com/dom/mutationobserver.html>`_

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

