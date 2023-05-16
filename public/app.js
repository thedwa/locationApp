let map;
let marker;
let currentLocation = { lat: 51.505, lng: -0.09 }; // Default location

// Initialize the map
function initMap() {
    map = L.map('mapid').setView([currentLocation.lat, currentLocation.lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    marker = L.marker([currentLocation.lat, currentLocation.lng], {draggable: true}).addTo(map);
    marker.on('dragend', function (e) {
        currentLocation = marker.getLatLng();
    });
}


// Function to get location from browser
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            currentLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            localStorage.setItem('currentLocation', JSON.stringify(currentLocation));
            map.setView([currentLocation.lat, currentLocation.lng]);
            marker.setLatLng([currentLocation.lat, currentLocation.lng]);
        }, () => {
            const savedLocation = localStorage.getItem('currentLocation');
            if (savedLocation) {
                currentLocation = JSON.parse(savedLocation);
                map.setView([currentLocation.lat, currentLocation.lng]);
                marker.setLatLng([currentLocation.lat, currentLocation.lng]);
            }
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Function to get location from Nominatim OpenStreetMap
async function getLocationFromOSM(city) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?city=${city}&format=json`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to handle button click
async function handleClick(buttonNum) {
    // Send a request to your backend with the selected location and buttonNum
    const response = await fetch('/api/call-openai', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ location, buttonNum }),
    });

    const data = await response.json();
    console.log(data);
}

document.addEventListener('DOMContentLoaded', (event) => {
    initMap();
    getLocation();

    // Add event listeners to buttons
    document.querySelectorAll('.btn').forEach((button, index) => {
        button.addEventListener('click', () => handleClick(index + 1));
    });

    // Add event listener to location search button
    document.getElementById('location-search').addEventListener('click', getLocationFromOSM);
});
