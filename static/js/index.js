function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
}

// User Signup
document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    fetch('/api/users/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
    })
    .then(response => response.json())
    .then(data => {
        showSection('login');
    })
    .catch(error => console.error('Error:', error));
});

document.getElementById('loginRedirect').addEventListener('click', () => { showSection('login'); })

// User Login
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    fetch('/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        localStorage.setItem('access_token', data.access_token);
        showSection('flights');
    })
    .catch(error => console.error('Error:', error));
});

document.getElementById('signupRedirect').addEventListener('click', () => { showSection('signup'); })

// Search Flights
document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const flight_name = document.getElementById('searchFlightName').value;
    const date = document.getElementById('searchFlightDate').value;
    const flight_number = document.getElementById('searchFlightNumber').value;

    const query = new URLSearchParams({
        flight_name,
        date,
        flight_number
    });

    fetch(`/api/flights/search?${query.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const resultsDiv = document.getElementById('searchResults');
        resultsDiv.innerHTML = '<h3>Search Results:</h3>';
        data.forEach(flight => {
            const flightInfo = `<p class="search-result">Flight Name: ${flight.flight_name}<br>Date: ${flight.departure_time}<br>Flight Number: ${flight.flight_number}</p>`;
            resultsDiv.innerHTML += flightInfo;
        });
    })
    .catch(error => console.error('Error:', error));
});

// Book Tickets
document.getElementById('bookingForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const flight_id = document.getElementById('bookingFlightId').value;
    const num_tickets = document.getElementById('bookingNumTickets').value;

    fetch('/api/bookings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ flight_id, num_tickets })
    })
    .then(response => response.json())
    .then(data => alert('Tickets booked successfully!'))
    .catch(error => console.error('Error:', error));
});

// Admin Login
document.getElementById('adminLoginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('adminLoginUsername').value;
    const password = document.getElementById('adminLoginPassword').value;

    fetch('/api/admin/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        localStorage.setItem('access_token', data.access_token);
        showSection('addFlights');
    })
    .catch(error => console.error('Error:', error));
});

// Add Flights
document.getElementById('addFlightForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const flight_name = document.getElementById('addFlightName').value;
    const flight_number = document.getElementById('addFlightNumber').value;
    const departure_time = document.getElementById('addDepartureTime').value;
    const arrival_time = document.getElementById('addArrivalTime').value;
    const origin = document.getElementById('addOrigin').value;
    const destination = document.getElementById('addDestination').value;
    const total_seats = document.getElementById('addTotalSeats').value;

    fetch('/api/admin/flights', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ flight_name, flight_number, departure_time, arrival_time, origin, destination, total_seats })
    })
    .then(response => response.json())
    .then(data => alert('Flight added successfully!'))
    .catch(error => console.error('Error:', error));
});

// View Bookings
document.getElementById('viewBookingsForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const flight_id = document.getElementById('viewBookingFlightId').value;
    const flight_name = document.getElementById('viewBookingFlightName').value;
    const date = document.getElementById('viewBookingDate').value;

    const query = new URLSearchParams({
        flight_id,
        flight_name,
        date
    });

    fetch(`/api/admin/bookings?${query.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const resultsDiv = document.getElementById('bookingResults');
        resultsDiv.innerHTML = '<h3>Booking Results:</h3>';
        data.forEach(booking => {
            const bookingInfo = `<p class="search-result">Booking ID: ${booking.booking_id}<br>User ID: ${booking.user_id}<br>Username: ${booking.username}<br>Flight ID: ${booking.flight_id}<br>Flight Name: ${booking.flight_name}<br>Flight Number: ${booking.flight_number}<br>Departure Time: ${booking.departure_time}<br>Arrival Time: ${booking.arrival_time}<br>Origin: ${booking.origin}<br>Destination: ${booking.destination}<br>Number of Tickets: ${booking.num_tickets}<br>Booking Time: ${booking.booking_time}</p>`;
            resultsDiv.innerHTML += bookingInfo;
        });
    })
    .catch(error => console.error('Error:', error));
});


if (localStorage.getItem('access_token') === null) {
	showSection('login');
} else {
	showSection('flights');
}
