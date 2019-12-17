# -*- coding: utf-8 -*-
"""
Created on Sat Apr 27 15:36:01 2019

@author: xiaoniu29
"""

def mbox(title, text, style = ''):
    from win32api import MessageBox
    if style == 'error':
        MessageBox(0, text, title, 16) #win32con.MB_ICONERROR=16
    elif style == 'info':
        MessageBox(0, text, title, 64) #win32con.MB_ICONASTERISK=64
    elif style == 'warn':
        MessageBox(0, text, title, 48) #win32con.MB_ICONWARNING=48
    else:
        MessageBox(0, text, title, 0) #win32con.MB_OK=0

def GetDesktopPath():
    import winreg
    key = winreg.OpenKey(winreg.HKEY_CURRENT_USER,r'Software\Microsoft\Windows\CurrentVersion\Explorer\Shell Folders')
    return winreg.QueryValueEx(key, "Desktop")[0]

def getFile(initdir="C:\\",title="Open File", filt = "All files (*.*)|*.*||"):
    from win32ui import CreateFileDialog
    dlg = CreateFileDialog(1, None, None, 2|4096, filt) #win32con.OFN_OVERWRITEPROMPT | win32con.OFN_FILEMUSTEXIST
    dlg.SetOFNTitle(title)
    dlg.SetOFNInitialDir(initdir)
    if dlg.DoModal() == 1: #win32con.IDOK
        return dlg.GetPathName()
    else:
        return ''