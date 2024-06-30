from flask import Blueprint, render_template

website_blueprint = Blueprint('website', __name__)


@website_blueprint.route('/', methods=['GET'])
def index():
    return render_template('base.html')
