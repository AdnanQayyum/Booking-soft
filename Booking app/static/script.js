document.addEventListener('DOMContentLoaded', function() {
    // Mock data for rooms (in real implementation, this data will come from the backend)
    const rooms = [
        {id: 1, type: 'Single Room', capacity: {adults: 2, children: 1}, price: 100},
        {id: 2, type: 'Double Room', capacity: {adults: 4, children: 2}, price: 200},
        {id: 3, type: 'Family Suite', capacity: {adults: 6, children: 3}, price: 300},
        {id: 4, type: 'Deluxe Suite', capacity: {adults: 4, children: 2}, price: 250}
    ];

    const roomsContainer = document.getElementById('rooms-container');
    const selectedRoomsContainer = document.getElementById('selected-rooms');
    const totalPriceElement = document.getElementById('price');
    let selectedRooms = [];

    // Function to display rooms
    function displayRooms(filteredRooms) {
        roomsContainer.innerHTML = '';
        filteredRooms.forEach(room => {
            const roomCard = document.createElement('div');
            roomCard.className = 'room-card';
            roomCard.innerHTML = `
                <h3>${room.type}</h3>
                <p>Capacity: ${room.capacity.adults} Adults, ${room.capacity.children} Children</p>
                <p>Price: $${room.price} per night</p>
                <button onclick="selectRoom(${room.id})">Select Room</button>
            `;
            roomsContainer.appendChild(roomCard);
        });
    }

    // Filter rooms based on user input
    document.getElementById('search-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const checkInDate = document.getElementById('check-in').value;
        const checkOutDate = document.getElementById('check-out').value;
        const adults = parseInt(document.getElementById('adults').value);
        const children = parseInt(document.getElementById('children').value);

        const filteredRooms = rooms.filter(room => {
            return room.capacity.adults >= adults && room.capacity.children >= children;
        });

        displayRooms(filteredRooms);
    });

    // Function to select a room
    window.selectRoom = function(roomId) {
        const selectedRoom = rooms.find(room => room.id === roomId);
        selectedRooms.push(selectedRoom);

        const roomElement = document.createElement('div');
        roomElement.textContent = `${selectedRoom.type} - $${selectedRoom.price}`;
        selectedRoomsContainer.appendChild(roomElement);

        const totalPrice = selectedRooms.reduce((sum, room) => sum + room.price, 0);
        totalPriceElement.textContent = totalPrice;
    };

    // Reservation popup functionality
    const popup = document.getElementById('reservation-popup');
    const reserveButton = document.getElementById('reserve-button');
    const closeButton = document.querySelector('.close-btn');

    reserveButton.addEventListener('click', () => {
        if (selectedRooms.length > 0) {
            popup.style.display = 'flex';
        } else {
            alert('Please select a room first.');
        }
    });

    closeButton.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    // Handle form submission
    document.getElementById('reservation-form').addEventListener('submit', function(event) {
        event.preventDefault();
        alert('Reservation confirmed!');
        popup.style.display = 'none';
        selectedRooms = [];
        selectedRoomsContainer.innerHTML = '';
        totalPriceElement.textContent = 0;
    });
});


let selectedRooms = [];
let totalPrice = 0;
const selectedRoomsContainer = document.getElementById('selected-rooms');
const totalPriceElement = document.getElementById('total-price');

function selectRoom(roomId, roomType, roomPrice) {
    selectedRooms.push({ roomId, roomType, roomPrice });
    totalPrice += roomPrice;
    
    const roomElement = document.createElement('div');
    roomElement.textContent = `${roomType} - $${roomPrice}`;
    selectedRoomsContainer.appendChild(roomElement);
    
    totalPriceElement.textContent = totalPrice;
}

function showReservationForm() {
    document.getElementById('reservation-popup').style.display = 'block';
}

function closeReservationForm() {
    document.getElementById('reservation-popup').style.display = 'none';
}

document.getElementById('reservation-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const checkInDate = document.getElementById('check_in_date').value;
    const checkOutDate = document.getElementById('check_out_date').value;
    const adults = parseInt(document.getElementById('adults').value);
    const children = parseInt(document.getElementById('children').value);
    const fullName = document.getElementById('full_name').value;
    const email = document.getElementById('email').value;

    const reservation = {
        room_type: selectedRooms.map(room => room.roomType).join(', '),
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        adults: adults,
        children: children,
        total_price: totalPrice,
        full_name: fullName,
        email: email
    };

    fetch('/api/reserve', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reservation)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        closeReservationForm();
    });
});


// script.js

// Function to show the reservation sidebar
function showReservationSidebar() {
    document.getElementById('reservation-sidebar').style.display = 'block';
}

// Function to show the reservation form
function showReservationForm() {
    document.getElementById('reservation-popup').style.display = 'flex';
}

// Function to close the reservation form
function closeReservationForm() {
    document.getElementById('reservation-popup').style.display = 'none';
}

// Example of how to trigger the sidebar when a room is booked
document.querySelectorAll('.booking-form').forEach(form => {
    form.addEventListener('submit', event => {
        event.preventDefault();
        // Update reservation details in the sidebar
        showReservationSidebar();
        // Optionally, you could update the selected rooms and total price here
    });
});



// Function to show the reservation sidebar
function showReservationSidebar() {
    document.getElementById('reservation-sidebar').style.display = 'block';
    document.getElementById('view-reservations-btn').style.display = 'none'; // Hide the floating button when sidebar is open
}

// Function to close the reservation sidebar
function closeReservationSidebar() {
    document.getElementById('reservation-sidebar').style.display = 'none';
    document.getElementById('view-reservations-btn').style.display = 'block'; // Show the floating button again
}

// Function to show the reservation form
function showReservationForm() {
    document.getElementById('reservation-popup').style.display = 'flex';
}

// Function to close the reservation form
function closeReservationForm() {
    document.getElementById('reservation-popup').style.display = 'none';
}

// Example of triggering the sidebar when a room is booked
document.querySelectorAll('.booking-form').forEach(form => {
    form.addEventListener('submit', event => {
        event.preventDefault();
        showReservationSidebar();
        // Optionally, update selected rooms and total price here
    });
});



















document.getElementById('reservation-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const checkInDate = document.getElementById('check_in_date').value;
    const checkOutDate = document.getElementById('check_out_date').value;
    const adults = parseInt(document.getElementById('adults').value);
    const children = parseInt(document.getElementById('children').value);
    const fullName = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    const reservation = new URLSearchParams();
    reservation.append('room_type', selectedRooms.map(room => room.roomType).join(', '));
    reservation.append('check_in_date', checkInDate);
    reservation.append('check_out_date', checkOutDate);
    reservation.append('adults', adults);
    reservation.append('children', children);
    reservation.append('total_price', totalPrice);
    reservation.append('full_name', fullName);
    reservation.append('email', email);

    fetch('/api/reserve', {
        method: 'POST',
        body: reservation
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        closeReservationForm();
    });
});
