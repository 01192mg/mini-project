from flask import Flask, render_template, request, jsonify, redirect, url_for
from pymongo import MongoClient
import requests

app = Flask(__name__)

client = MongoClient('3.38.210.185', 27017, username="text", password="sparta")
db = client.dbsparta


@app.route('/')
def home():
    return render_template("mainpage.html")


@app.route('/post', methods=['POST'])
def save_post():
    title_receive = title.form
    definition_receive = request.form['definition_give']
    doc = {'word': word_receive, 'definition': definition_receive}
    db.word.insert_one(doc)
    return jsonify({'result': 'success', 'msg': f'단어 {word_receive} 저장'})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
