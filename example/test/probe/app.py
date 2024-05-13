# app.py

from flask import Flask

def create_app():
    app = Flask(__name__)

    @app.route('/')
    def hi_today():
        return 'hi today'
    @app.route('/ready')
    def hi_ready():
        return 'hi is ready'
    @app.route('/getInfo')
    def hi_info():
        return 'pengm'
    @app.route('/live')
    def hi_live():
        return 'live is is is ok'

    return app
