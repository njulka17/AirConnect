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


### 2. User Login
Request Body:
```json
{
  "username": "string",
  "password": "string"
}
```

### 3. Search Flights
Query Parameters:
```
flight_name (optional)
date (optional)
flight_number (optional)
```