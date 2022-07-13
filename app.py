from bson import ObjectId
from pymongo import MongoClient
import jwt
import datetime
import hashlib
from flask import Flask, render_template, jsonify, request, redirect, url_for
from datetime import datetime, timedelta

app = Flask(__name__)
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config['UPLOAD_FOLDER'] = "./static/profile_pics"

SECRET_KEY = 'SPARTA'

client = MongoClient('mongodb+srv://test:sparta@cluster0.qvb2j.mongodb.net/?retryWrites=true&w=majority')
db = client.dbsparta_plus_week4


@app.route('/')
def home():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.users.find_one({"username": payload["id"]})
        return render_template('mainpage.html', user_info=user_info)
    except jwt.ExpiredSignatureError:
        return redirect(url_for("login", msg="로그인 시간이 만료되었습니다."))
    except jwt.exceptions.DecodeError:
        return redirect(url_for("login", msg="로그인 정보가 존재하지 않습니다."))

@app.route('/joinpage')
def login_1():
    return render_template('joinpage.html')

@app.route('/loginpage')
def login_2():
    return render_template('loginpage.html')


@app.route('/post', methods=['POST'])
def save_post():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.users.find_one({"username": payload["id"]})

        title_receive = request.form["title_give"]
        description_receive = request.form["description_give"]
        image_receive = request.form["image_give"]
        date_receive = request.form["date_give"]

        doc = {
            "username": user_info["username"],
            "title": title_receive,
            "description": description_receive,
            "image": image_receive,
            "date": date_receive
        }
        db.posts.insert_one(doc)
        return jsonify({"result": "success", 'msg': '작성 완료'})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))

@app.route('/login')
def login():
    msg = request.args.get("msg")
    return render_template('loginpage.html', msg=msg)


@app.route('/login', methods=['POST'])
def sign_in():
    username_receive = request.form['username_give']
    password_receive = request.form['password_give']

    pw_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()
    result = db.users.find_one({'username': username_receive, 'password': pw_hash})

    if result is not None:
        payload = {
            'id': username_receive,
            'exp': datetime.utcnow() + timedelta(seconds=60 * 60 * 24)  # 로그인 24시간 유지
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

        return jsonify({'result': 'success', 'token': token})
    # 찾지 못하면
    else:
        return jsonify({'result': 'fail', 'msg': '아이디/비밀번호가 일치하지 않습니다.'})


@app.route('/sign_up', methods=['POST'])
def sign_up():
    username_receive = request.form['username_give']
    password_receive = request.form['password_give']
    password_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()
    doc = {
        "username": username_receive,
        "password": password_hash,
    }
    db.users.insert_one(doc)
    return jsonify({'result': 'success'})


@app.route('/sign_up/check_dup', methods=['POST'])
def check_dupp():
    username_receive = request.form['username_give']
    exists = bool(db.users.find_one({"username": username_receive}))
    return jsonify({'result': 'success', 'exists': exists})


@app.route("/posts", methods=['GET'])
def get_posts():
    posts = list(db.posts.find({}).sort("date", -1))
    for post in posts:
        post["_id"] = str(post["_id"])
    return jsonify({'posts': posts})


@app.route("/post/<id>", methods=['GET'])
def get_post(id):
    post = db.posts.find_one({"_id": ObjectId(id)})
    post["_id"] = str(post["_id"])
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user = db.users.find_one({"username": payload["id"]}, {'_id': False})
        return jsonify({'post': post, 'user': user})

    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return jsonify({'post': post})


@app.route("/post/<id>", methods=['DELETE'])
def delete_post(id):
    db.posts.delete_one({"_id": ObjectId(id)})
    return jsonify({'msg': '삭제 완료'})


@app.route("/post/<id>", methods=['PATCH'])
def update_post(id):
    title = request.form['title_give']
    description = request.form['description_give']
    image = request.form['image_give']
    db.posts.update_one({"_id": ObjectId(id)}, {'$set': {'title': title, 'description': description, 'image': image}})
    return jsonify({'msg': '업데이트 완료'})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
