# API Endpoints
## User Endpoints
<table>
    <th>
        <td>Name</td>
        <td>URL</td>
        <td>Method</td>
        <td>Description</td>
    </th>
    <tr>
        <td>1.</td>
        <td>User Signup</td>
        <td><code>/api/users/signup</code></td>
        <td>POST</td>
        <td>Allows a new user to sign up.</td>
    </tr>
    <tr>
        <td>2.</td>
        <td>User Login</td>
        <td><code>/api/users/login</code></td>
        <td>POST</td>
        <td>Allows a user to log in.</td>
    </tr>
    <tr>
        <td>3.</td>
        <td>Search Flights</td>
        <td><code>/api/flights/search</code></td>
        <td>GET</td>
        <td>Allows a user to search for flights by name, date, or flight number.</td>
    </tr>
    <tr>
        <td>4.</td>
        <td>Book Tickets</td>
        <td><code>/api/users/bookings</code></td>
        <td>POST</td>
        <td>Allows a user to book flight tickets.</td>
    </tr>
    <tr>
        <td>5.</td>
        <td>Admin Login</td>
        <td><code>/api/admin/login</code></td>
        <td>POST</td>
        <td>Allows an admin to log in.</td>
    </tr>
    <tr>
        <td>6.</td>
        <td>Admin Signup</td>
        <td><code>/api/admin/signup</code></td>
        <td>POST</td>
        <td>Allows an admin to signup.</td>
    </tr>
    <tr>
        <td>7.</td>
        <td>View Bookings</td>
        <td><code>/api/admin/bookings</code></td>
        <td>GET</td>
        <td>Allows an admin to view all the flights and users and their respective bookings.</td>
    </tr>
    <tr>
        <td>8.</td>
        <td>Add new Flight</td>
        <td><code>/api/admin/flights</code></td>
        <td>POST</td>
        <td>Allows an admin to add a new flight.</td>
    </tr>
</table>

----
### 1. User Signup

Request Body:
```json
{
  "username": "string",
  "password": "string",
  "email": "string"
}
```
----
### 2. User Login
Request Body:
```json
{
  "username": "string",
  "password": "string"
}
```
Response:
```json
{
  "access_token": "string"
}
```
----
### 3. Search Flights
Query Parameters:
```
flight_name (optional)
date (optional)
flight_number (optional)
```
Example Request:
```sh
curl -X GET "http://127.0.0.1:5000/api/flights/search?flight_name=Flight123&date=2023-07-01"
```
----
### 4. Book Tickets
Request Body:
```json
{
  "flight_id": "integer",
  "num_tickets": "integer"
}
```
Headers:
```http
Authorization: Bearer <your_jwt_token>
```
Example Request:
```sh
curl -X POST http://127.0.0.1:5000/api/users/bookings \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <your_jwt_token>" \
-d '{
  "flight_id": 1,
  "num_tickets": 2
}'
```
----
### 5. Admin Login
Request Body:
```json
{
  "username": "string",
  "password": "string"
}
```
Response:
```json
{
  "access_token": "string"
}
```
----
### 6. Admin Signup
Request Body:
```json
{
  "username": "string",
  "password": "string",
  "email": "string"
}
```
Example Request:
```sh
curl -X POST http://127.0.0.1:5000/api/admin/signup \
-H "Content-Type: application/json" \
-d '{
  "username": "admin_user",
  "password": "adminpassword",
  "email": "admin@example.com"
}'
```
----
### 7. View Bookings
Query Parameters:
```
flight_id (optional)
flight_name (optional)
date (optional)
```
Headers:
```http
Authorization: Bearer <your_jwt_token>
```
Example Request:
```sh
curl -X GET "http://127.0.0.1:5000/api/admin/bookings?flight_id=1" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <your_jwt_token>"
```
----
### 8. Add New Flight
Request Body:
```json
{
  "flight_name": "string",
  "flight_number": "string",
  "departure_time": "string (ISO 8601 format)",
  "arrival_time": "string (ISO 8601 format)",
  "origin": "string",
  "destination": "string",
  "total_seats": "integer (default: 60)"
}
```
Headers:
```http
Authorization: Bearer <your_jwt_token>
```
Example Request:
```http
curl -X POST http://127.0.0.1:5000/api/admin/flights \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <your_jwt_token>" \
-d '{
  "flight_name": "Flight123",
  "flight_number": "F123",
  "departure_time": "2023-07-01T10:00:00",
  "arrival_time": "2023-07-01T14:00:00",
  "origin": "CityA",
  "destination": "CityB",
  "total_seats": 60
}'
```
