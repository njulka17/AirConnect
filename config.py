import os

from dotenv import load_dotenv

load_dotenv()


class Config:
    FLASK_SECRET_KEY = os.environ.get('FLASK_SECRET_KEY')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = os.environ.get('SQLALCHEMY_DATABASE_URI')
