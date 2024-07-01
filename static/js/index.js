function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
}

function enableButton(btn) {
	btn.disabled = false;
	btn.style.backgroundColor = '#007bff';
	btn.style.color = 'white';
}

function disableButton(btn) {
	btn.disabled = true;
	btn.style.backgroundColor = '#3597ff';
	btn.style.color = '#b4b4b4';
}

function removeDisplay(ele) {
	ele.classList.add('hidden');
}

function showDisplay(ele) {
	ele.classList.remove('hidden');
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
        localStorage.setItem('last_login', new Date());
        localStorage.setItem('role', 'user');
        showSection('flights');
    })
    .catch(error => console.error('Error:', error));

    enableButton(document.getElementById('signOut'));
    removeDisplay(document.getElementById('userSignIn'));
    removeDisplay(document.getElementById('userSignUp'));
    removeDisplay(document.getElementById('adminSignIn'));
    removeDisplay(document.getElementById('adminSignUp'));
    showDisplay(document.getElementById('bookFlight'));
});

document.getElementById('signupRedirect').addEventListener('click', () => { showSection('signup'); })
document.getElementById('adminSignupRedirect').addEventListener('click', () => { showSection('admin-signup'); })
document.getElementById('adminLoginRedirect').addEventListener('click', () => { showSection('admin-login'); })

document.getElementById('signOut').addEventListener('click', () => {
	localStorage.setItem('access_token', null);
	localStorage.setItem('last_login', null);
	localStorage.setItem('role', null);

	document.querySelectorAll('input').forEach((inputEle) => {inputEle.value = ''});
	showSection('login');

	enableButton(document.getElementById('adminSignIn'));
	enableButton(document.getElementById('adminSignUp'));
	disableButton(document.getElementById('signOut'));

	removeDisplay(document.getElementById('addFlight'));
	removeDisplay(document.getElementById('viewBooking'));
	removeDisplay(document.getElementById('bookFlight'));
	removeDisplay(document.getElementById('searchFlight'));

	showDisplay(document.getElementById('adminSignIn'));
	showDisplay(document.getElementById('adminSignUp'));
})

document.getElementById('adminSignIn').addEventListener('click', () => {
	showSection('admin-login');
	removeDisplay(document.getElementById('adminSignIn'));
	removeDisplay(document.getElementById('adminSignUp'));
	showDisplay(document.getElementById('userSignIn'));
	showDisplay(document.getElementById('userSignUp'));
})

document.getElementById('adminSignUp').addEventListener('click', () => {
	showSection('admin-signup');
	removeDisplay(document.getElementById('adminSignIn'));
	removeDisplay(document.getElementById('adminSignUp'));
	showDisplay(document.getElementById('userSignIn'));
	showDisplay(document.getElementById('userSignUp'));
})

document.getElementById('userSignIn').addEventListener('click', () => {
	showSection('login');
	showDisplay(document.getElementById('adminSignIn'));
	showDisplay(document.getElementById('adminSignUp'));
	removeDisplay(document.getElementById('userSignIn'));
	removeDisplay(document.getElementById('userSignUp'));
})

document.getElementById('userSignUp').addEventListener('click', () => {
	showSection('signup');
	showDisplay(document.getElementById('adminSignIn'));
	showDisplay(document.getElementById('adminSignUp'));
	removeDisplay(document.getElementById('userSignIn'));
	removeDisplay(document.getElementById('userSignUp'));
})

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
            const flightInfo = `<p class="search-result">Flight ID: ${flight.id}<br>Flight Name: ${flight.flight_name}<br>Flight Number:${flight.flight_number}<br>Date: ${flight.departure_time}<br>Arrival Time: ${flight.arrival_time}<br>Origin: ${flight.origin}<br>Destination: ${flight.destination}<br>Total Seats: ${flight.total_seats}<br></p>`;
            resultsDiv.innerHTML += flightInfo;
        });
    })
    .catch(error => console.error('Error:', error));
});

document.getElementById('searchFlight').addEventListener('click', () => {
	showSection('flights');
	removeDisplay(document.getElementById('searchFlight'));
	showDisplay(document.getElementById('bookFlight'));
})

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
    document.querySelectorAll('input').forEach((inputEle) => {inputEle.value = ''});
});

document.getElementById('bookFlight').addEventListener('click', () => {
	showSection('bookTickets');
	removeDisplay(document.getElementById('bookFlight'));
	showDisplay(document.getElementById('searchFlight'));
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
        localStorage.setItem('last_login', new Date());
        localStorage.setItem('role', 'admin')
        showSection('viewBookings');
    })
    .catch(error => console.error('Error:', error));

    enableButton(document.getElementById('signOut'));
    removeDisplay(document.getElementById('adminSignUp'));
    removeDisplay(document.getElementById('adminSignIn'));
    removeDisplay(document.getElementById('userSignIn'));
    removeDisplay(document.getElementById('userSignUp'));
    showDisplay(document.getElementById('addFlight'));
});

// Admin Signup
document.getElementById('adminSignupForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('adminSignupUsername').value;
    const email = document.getElementById('adminSignupEmail').value;
    const password = document.getElementById('adminSignupPassword').value;

    fetch('/api/admin/signup', {
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

document.getElementById('addFlight').addEventListener('click', () => {
	showSection('addFlights');
	showDisplay(document.getElementById('viewBooking'));
	removeDisplay(document.getElementById('addFlight'));
})

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

document.getElementById('viewBooking').addEventListener('click', () => {
	showSection('viewBookings');
	removeDisplay(document.getElementById('viewBooking'));
	showDisplay(document.getElementById('addFlight'));
})


if (localStorage.getItem('access_token') === null || localStorage.getItem('access_token') === 'null') {
	showSection('login');
	disableButton(document.getElementById('signOut'));
} else {
	if (new Date() - localStorage.getItem('last_login') > 86400) {
		localStorage.setItem('access_token', null);
		localStorage.setItem('last_login', null);
		localStorage.setItem('role', null);
		showSection('login');
		disableButton(document.getElementById('signOut'));
	}
	if (localStorage.getItem('role') === 'admin') {
		showSection('viewBookings');
	    removeDisplay(document.getElementById('adminSignUp'));
	    removeDisplay(document.getElementById('adminSignIn'));
	    removeDisplay(document.getElementById('userSignIn'));
	    removeDisplay(document.getElementById('userSignUp'));
	    showDisplay(document.getElementById('addFlight'));
	} else {
		showSection('flights');
	    removeDisplay(document.getElementById('adminSignUp'));
	    removeDisplay(document.getElementById('adminSignIn'));
	    removeDisplay(document.getElementById('userSignIn'));
	    removeDisplay(document.getElementById('userSignUp'));
	    showDisplay(document.getElementById('bookFlight'));
	}
	enableButton(document.getElementById('signOut'));
}
