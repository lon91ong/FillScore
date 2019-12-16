# -*- coding: utf-8 -*-
"""
Created on Wed Nov 27 18:58:34 2019

@author: Administrator
"""

from sqlite3 import connect#, OperationalError
from urllib.parse import unquote
from time import localtime
from os import path #, system
import sys
from myMod import mbox
    
import falcon
from json import dumps,loads
from waitress import serve
from falcon.http_status import HTTPStatus

dbpath = path.dirname(path.realpath(__file__)) + "/hwmy"
if localtime().tm_mon < 8 and localtime().tm_mon > 1: # 春季学期
    dbpath += str(localtime().tm_year-2)[-2:]+"_spring.db"
else: #秋季学期
    dbpath += str(localtime().tm_year-1)[-2:]+"_autumn.db"

if not path.isfile(dbpath):
    print('No database file in exe path, check please!')
    mbox('错误','未能在程序目录下找到数据库文件{}！\n请查验后重试！'.format(dbpath[2:]),'error')
    sys.exit(0)
print('Database File:',dbpath)

def dict_factory(cursor, row):
    return dict((col[0], row[idx]) for idx, col in enumerate(cursor.description))

class HandleCORS(object):
    def process_request(self, req, resp):
        resp.set_header('Access-Control-Allow-Origin', '*')
        resp.set_header('Access-Control-Allow-Methods', '*')
        resp.set_header('Access-Control-Allow-Headers', '*')
        resp.set_header('Access-Control-Max-Age', 18000)  # 5 hours
        if req.method == 'OPTIONS':
            raise HTTPStatus(falcon.HTTP_200, body='\n')

class Resource(object):
    global dbpath,dict_factory

    def on_get(self, req, resp):
        print("URL:", req.url)
        conn = connect(dbpath)
        if req.path == '/classes':
            curs = conn.cursor()
            curs.execute('SELECT class FROM classes')
            resp.body = ','.join(t[0] for t in map(list,curs.fetchall()))
        elif req.path =='/class':
            resp.append_header('Cache-Control','no-cache, no-store')
            cla = unquote(req.query_string)
            try:
                print("CLIENT:",req.headers["CLIENT"],"\tClass:",cla)
            except KeyError:
                #print("Unexpected error:", sys.exc_info()[0])
                resp.body = '非法途径访问！'
            else:
                if req.headers["CLIENT"]=='Greasemonkey': # Get scores to fill Web Table
                    curs = conn.cursor()
                    curs.execute('SELECT id,score FROM students WHERE class ="'+cla+'"')
                    resp.body = dumps(dict(curs.fetchall()),ensure_ascii=False)
                if req.headers["CLIENT"]=='Excel': # Excel
                    conn.row_factory = dict_factory
                    curs = conn.cursor()
                    curs.execute('SELECT id,name,score FROM students WHERE class ="'+cla+'"')
                    resp.body = dumps(curs.fetchall(),ensure_ascii=False)
        else:
            resp.body = '非法途径访问！'
            #resp.body = dumps({"success":False,"Contents":"Bad Request Command!"})
        resp.status = falcon.HTTP_200
        curs.close()
        conn.close()
    def on_post(self, req, resp):
        print("URL:", req.url)
        conn = connect(dbpath)
        curs = conn.cursor()
        if req.path == '/updata' and req.headers["CLIENT"]=='Excel':
            scores = loads(req.media)
            for score in scores:
                curs.execute('UPDATE students SET score = '+str(score["score"])+' WHERE ID = '+str(score["id"]))
            conn.commit()
            print('更新{}条记录！'.format(len(scores)))
            resp.body = dumps({"success": True,"Content":'更新{}条记录！'.format(len(scores))},ensure_ascii=False)
        else:
            resp.body = '非法途径访问！'
        resp.status = falcon.HTTP_201
        curs.close()
        conn.close()
        
svrRes = Resource()

app = falcon.API(middleware=[HandleCORS()])

app.add_route('/classes', svrRes)
app.add_route('/class', svrRes)
app.add_route('/updata', svrRes)

serve(app, listen='*:8001')

