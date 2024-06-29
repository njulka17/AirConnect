import datetime

from flask import Flask, jsonify, request, Blueprint
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity, create_access_token
from werkzeug.security import check_password_hash, generate_password_hash

from config import Config

# INIT APP
app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)
jwt = JWTManager(app)


# DATABASE MODELS
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    role = db.Column(db.String(10), nullable=False, default='user')


class Flight(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    flight_name = db.Column(db.String(50), nullable=False)
    flight_number = db.Column(db.String(50), unique=True, nullable=False)
    departure_time = db.Column(db.DateTime, nullable=False)
    arrival_time = db.Column(db.DateTime, nullable=False)
    origin = db.Column(db.String(50), nullable=False)
    destination = db.Column(db.String(50), nullable=False)
    total_seats = db.Column(db.Integer, default=60)


class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    flight_id = db.Column(db.Integer, db.ForeignKey('flight.id'), nullable=False)
    num_tickets = db.Column(db.Integer, nullable=False)
    booking_time = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())


# BLUEPRINT
api_blueprint = Blueprint('api', __name__, url_prefix='/api')


@api_blueprint.route('/users/signup', methods=['POST'])
def signup():
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'])

    new_user = User(username=data['username'], password=hashed_password, email=data['email'])
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully'}), 201


# User Login
@api_blueprint.route('/users/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()

    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'message': 'Invalid credentials'}), 401

    access_token = create_access_token(identity={'id': user.id, 'username': user.username, 'role': user.role})
    return jsonify({'access_token': access_token}), 200


# Search Flights
@api_blueprint.route('/flights/search', methods=['GET'])
def search_flights():
    flight_name = request.args.get('flight_name')
    date = request.args.get('date')
    flight_number = request.args.get('flight_number')
    query = Flight.query

    if flight_name:
        query = query.filter(Flight.flight_name.ilike(f"%{flight_name}%"))

    if date:
        query = query.filter(db.func.date(Flight.departure_time) == date)

    if flight_number:
        query = query.filter(Flight.flight_number.ilike(f"%{flight_number}%"))

    flights = query.all()

    return jsonify([{
        'id': flight.id,
        'flight_name': flight.flight_name,
        'flight_number': flight.flight_number,
        'departure_time': flight.departure_time,
        'arrival_time': flight.arrival_time,
        'origin': flight.origin,
        'destination': flight.destination,
        'total_seats': flight.total_seats
    } for flight in flights]), 200


# Book Tickets
@api_blueprint.route('/bookings', methods=['POST'])
@jwt_required()
def book_tickets():
    user_identity = get_jwt_identity()
    data = request.get_json()
    flight = Flight.query.session.get(data['flight_id'])

    if not flight:
        return jsonify({'message': 'Flight not found'}), 404

    booking = Booking(user_id=user_identity['id'], flight_id=data['flight_id'], num_tickets=data['num_tickets'])
    db.session.add(booking)
    db.session.commit()

    return jsonify({'message': 'Tickets booked successfully'}), 201


# Admin Login
@api_blueprint.route('/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username'], role='admin').first()

    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'message': 'Invalid credentials'}), 401

    access_token = create_access_token(identity={'id': user.id, 'username': user.username, 'role': user.role})
    return jsonify({'access_token': access_token}), 200


# Add Flights
@api_blueprint.route('/flights', methods=['POST'])
@jwt_required()
def add_flights():
    user_identity = get_jwt_identity()

    if user_identity['role'] != 'admin':
        return jsonify({'message': 'Unauthorized access'}), 403

    data = request.get_json()

    departure_time = data['departure_time'].split()
    d_dd, d_mm, d_yyyy = list(map(int, departure_time[0].split('-')))
    d_h, d_m, d_s = list(map(int, departure_time[1].split(':')))

    arrival_time = data['arrival_time'].split()
    a_dd, a_mm, a_yyyy = list(map(int, arrival_time[0].split('-')))
    a_h, a_m, a_s = list(map(int, arrival_time[1].split(':')))

    new_flight = Flight(
        flight_name=data['flight_name'],
        flight_number=data['flight_number'],
        departure_time=datetime.datetime(d_yyyy, d_mm, d_dd, d_h, d_m, d_s),
        arrival_time=datetime.datetime(a_yyyy, a_mm, a_dd, a_h, a_m, a_s),
        origin=data['origin'],
        destination=data['destination'],
        total_seats=data.get('total_seats', 60)
    )
    db.session.add(new_flight)
    db.session.commit()

    return jsonify({'message': 'Flight added successfully'}), 201


# View Bookings
@api_blueprint.route('/bookings', methods=['GET'])
@jwt_required()
def view_bookings():
    user_identity = get_jwt_identity()

    if user_identity['role'] != 'admin':
        return jsonify({'message': 'Unauthorized access'}), 403

    flight_id = request.args.get('flight_id')
    flight_name = request.args.get('flight_name')
    date = request.args.get('date')

    query = (db.session
             .query(Booking, User, Flight)
             .join(User, Booking.user_id == User.id)
             .join(Flight, Booking.flight_id == Flight.id)
             )

    if flight_id:
        query = query.filter(Booking.flight_id == flight_id)

    if flight_name:
        query = query.filter(Flight.flight_name == flight_name)
    if date:
        query = query.filter(db.func.date(Flight.departure_time) == date)

    bookings = query.all()

    results = []
    for booking, user, flight in bookings:
        results.append({
            'booking_id': booking.id,
            'user_id': user.id,
            'username': user.username,
            'flight_id': flight.id,
            'flight_name': flight.flight_name,
            'flight_number': flight.flight_number,
            'departure_time': flight.departure_time,
            'arrival_time': flight.arrival_time,
            'origin': flight.origin,
            'destination': flight.destination,
            'num_tickets': booking.num_tickets,
            'booking_time': booking.booking_time
        })

    return jsonify(results), 200


app.register_blueprint(api_blueprint)


@app.shell_context_processor
def make_shell_context():
    return {
        "db": db,
        "User": User,
        "Flight": Flight,
        "Booking": Booking
    }


if __name__ == '__main__':
    with app.app_context():
        db.create_all()

    app.run(port=8000, debug=True, load_dotenv=True)
